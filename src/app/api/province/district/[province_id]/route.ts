// /api/province/district/[province_id]/route.ts
// Uses provinces.open-api.vn as the data source

type ParamsGet = {
	params: Promise<{
		province_id: string;
	}>;
};

const GET = async (request: Request, { params }: ParamsGet) => {
	const { province_id } = await params;

	try {
		const response = await fetch(`https://provinces.open-api.vn/api/p/${province_id}?depth=2`);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = (await response.json()) as {
			districts: Array<{
				name: string;
				code: number;
				division_type: string;
				codename: string;
				province_code: number;
			}>;
		};

		// Transform to match the expected format: { results: District[] }
		const results = (data.districts || []).map((district) => ({
			district_id: String(district.code),
			district_name: district.name
				.replace("Huyện ", "")
				.replace("Quận ", "Q.")
				.replace("Thành phố ", "Tp. ")
				.replace("Thị xã ", "TX. ")
		}));

		return new Response(JSON.stringify({ results }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error), results: [] }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};

export { GET, type ParamsGet };
