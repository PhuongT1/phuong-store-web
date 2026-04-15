import Image from "next/image";
import Link from "next/link";

type SuggestionProduct = {
	id: string;
	name: string;
	slug: string;
	thumbnail?: { url: string; alt?: string | null } | null;
	pricing?: {
		onSale?: boolean | null;
		priceRange?: {
			start?: { gross: { amount: number; currency: string } } | null;
		} | null;
	} | null;
	variants?: Array<{
		quantityAvailable?: number | null;
		pricing?: {
			onSale?: boolean | null;
			price?: { gross: { amount: number; currency: string } } | null;
			priceUndiscounted?: { gross: { amount: number; currency: string } } | null;
		} | null;
	}> | null;
};

type Props = {
	product: SuggestionProduct;
	channel: string;
	onClose: () => void;
};

const formatPrice = (amount: number, currency: string): string => {
	if (currency === "VND") return `${amount.toLocaleString("vi-VN")}₫`;
	return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
};

const resolveVariantPricing = (product: SuggestionProduct) => {
	const variant = product.variants?.find((v) => (v.quantityAvailable ?? 0) > 0) ?? product.variants?.[0];
	if (variant?.pricing?.onSale) {
		const current = variant.pricing.price?.gross;
		const original = variant.pricing.priceUndiscounted?.gross;
		if (current && original) {
			const pct = Math.round(((original.amount - current.amount) / original.amount) * 100);
			return { current, original, pct };
		}
	}
	const fallback = product.pricing?.priceRange?.start?.gross ?? null;
	return { current: fallback, original: null, pct: null };
};

const SuggestionProductRow = ({ product, channel, onClose }: Props) => {
	const { current, original, pct } = resolveVariantPricing(product);

	return (
		<Link
			href={`/${channel}/products/${product.slug}`}
			onClick={onClose}
			className="group surface-subtle flex items-center gap-3 px-2.5 py-2 transition-all duration-200 hover:border-info/35 hover:bg-accent/45"
		>
			<div className="bg-muted border-border/50 relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
				{product.thumbnail ? (
					<Image
						src={product.thumbnail.url}
						alt={product.thumbnail.alt ?? product.name}
						fill
						sizes="48px"
						className="object-cover"
						loading="lazy"
					/>
				) : null}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="text-foreground line-clamp-2 text-sm leading-snug font-medium group-hover:text-info">
					{product.name}
				</span>
				{current && (
					<div className="flex items-center gap-1.5">
						<span className="text-price text-sm font-bold">
							{formatPrice(current.amount, current.currency)}
						</span>
						{original && (
							<>
								<span className="text-muted-foreground text-xs line-through">
									{formatPrice(original.amount, original.currency)}
								</span>
								{pct && pct > 0 && (
									<span className="text-destructive bg-destructive/12 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold">
										-{pct}%
									</span>
								)}
							</>
						)}
					</div>
				)}
			</div>
		</Link>
	);
};

export { SuggestionProductRow };
export type { SuggestionProduct };
