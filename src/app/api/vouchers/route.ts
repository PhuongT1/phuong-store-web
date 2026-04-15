import { fetchGraphQL } from "@/lib/api/secureGraphQL";

type VoucherApiItem = {
	id: string;
	code: string;
	name: string;
	discountValue: number | null;
	discountValueType: "FIXED" | "PERCENTAGE";
	minSpent: { amount: number; currency: string } | null;
	type: string;
};

type VouchersQueryResult = {
	vouchers: {
		edges: Array<{
			node: {
				id: string;
				name: string | null;
				discountValue: number | null;
				discountValueType: "FIXED" | "PERCENTAGE";
				type: string;
				minSpent: { amount: number; currency: string } | null;
				translation: { name: string | null } | null;
				codes: {
					edges: Array<{
						node: {
							code: string | null;
							isActive: boolean | null;
						};
					}>;
				} | null;
			};
		}>;
	} | null;
};

const VOUCHERS_QUERY = /* GraphQL */ `
	query CheckoutVoucherList($channel: String, $languageCode: LanguageCodeEnum!) {
		vouchers(
			first: 24
			channel: $channel
			filter: { status: [ACTIVE] }
			sortBy: { field: START_DATE, direction: DESC }
		) {
			edges {
				node {
					id
					name
					type
					discountValue
					discountValueType
					minSpent {
						amount
						currency
					}
					translation(languageCode: $languageCode) {
						name
					}
					codes(first: 1) {
						edges {
							node {
								code
								isActive
							}
						}
					}
				}
			}
		}
	}
`;

const localeToLanguageCode = (locale: string | null) => {
	if (!locale) return "EN";
	if (locale.toLowerCase().startsWith("vi")) return "VI";
	return "EN";
};

const GET = async (request: Request) => {
	try {
		if (!process.env.SALEOR_APP_TOKEN) {
			return Response.json({ results: [], source: "missing_token" }, { status: 200 });
		}

		const { searchParams } = new URL(request.url);
		const channel = searchParams.get("channel") ?? undefined;
		const languageCode = localeToLanguageCode(searchParams.get("locale"));

		const data = await fetchGraphQL<VouchersQueryResult, { channel?: string; languageCode: string }>(
			VOUCHERS_QUERY,
			{
				variables: { channel, languageCode },
				cache: "no-store",
				saleorAppToken: process.env.SALEOR_APP_TOKEN
			}
		);

		const results: VoucherApiItem[] =
			data.vouchers?.edges
				.map(({ node }) => {
					const codeNode = node.codes?.edges.find(({ node: voucherCode }) => voucherCode.code)?.node;
					const code = codeNode?.code?.trim();

					if (!code || codeNode?.isActive === false) {
						return null;
					}

					return {
						id: node.id,
						code,
						name: node.translation?.name?.trim() || node.name?.trim() || code,
						discountValue: node.discountValue,
						discountValueType: node.discountValueType,
						minSpent: node.minSpent,
						type: node.type
					};
				})
				.filter((voucher): voucher is VoucherApiItem => Boolean(voucher)) ?? [];

		return Response.json({ results, source: "saleor" }, { status: 200 });
	} catch (error) {
		return Response.json(
			{ results: [], error: error instanceof Error ? error.message : "Failed to load vouchers" },
			{ status: 500 }
		);
	}
};

export { GET };
