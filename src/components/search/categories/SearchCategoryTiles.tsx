import Image from "next/image";
import {
	Shirt,
	Watch,
	ShoppingBasket,
	Laptop,
	BookOpen,
	Dumbbell,
	Home,
	Sparkles,
	Baby,
	Tag,
	type LucideIcon
} from "lucide-react";
import { CategoriesListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";
import { LinkWithChannel } from "@components/navigation";

/** Map common category slugs to a recognizable icon */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
	apparel: Shirt,
	clothing: Shirt,
	"quan-ao": Shirt,
	accessories: Watch,
	"phu-kien": Watch,
	groceries: ShoppingBasket,
	"thuc-pham": ShoppingBasket,
	electronics: Laptop,
	"dien-tu": Laptop,
	books: BookOpen,
	sach: BookOpen,
	sports: Dumbbell,
	"the-thao": Dumbbell,
	home: Home,
	"noi-that": Home,
	beauty: Sparkles,
	"lam-dep": Sparkles,
	kids: Baby,
	"tre-em": Baby
};

const getCategoryIcon = (slug: string): LucideIcon => {
	const lower = slug.toLowerCase();
	for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
		if (lower.includes(key)) return Icon;
	}
	return Tag;
};

const SearchCategoryTiles = async ({ channel: _channel }: { channel: string }) => {
	let categories: {
		id: string;
		name: string;
		slug: string;
		seoDescription?: string | null;
		backgroundImage?: { url: string; alt?: string | null } | null;
	}[] = [];
	try {
		const data = await executeGraphQL(CategoriesListDocument, {
			variables: { first: 20, level: 0 }
		});
		categories = data.categories?.edges.map((e) => e.node) ?? [];
	} catch {
		// fail silently — show nothing if API is unavailable
	}

	if (categories.length === 0) return null;

	return (
		<section className="py-12">
			{/* TEST: trapezoid — outer clips right side, inner skews + rounds top-left
			     Chỉnh:  skewX(-15deg) = độ xéo | borderTopLeftRadius = độ bo | width inner = fill đủ sau khi skew */}
			{/* <div style={{ width: "300px", height: "80px", overflow: "hidden", marginBottom: "1.5rem" }}>
				<div
					style={{
						width: "120%",
						height: "100%",
						background: "oklch(0.55 0.22 25 / 0.35)",
						borderTopLeftRadius: "2rem",
						transform: "skewX(-30deg)",
						transformOrigin: "bottom left"
					}}
				/>
			</div> */}
			<div className="mb-6">
				<h2 className="text-foreground text-2xl font-semibold tracking-tight">Shop by Category</h2>
				<p className="text-muted-foreground mt-1 text-sm">Find what you&apos;re looking for</p>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{categories.map((cat) => {
					const Icon = getCategoryIcon(cat.slug);
					return (
						<LinkWithChannel
							key={cat.id}
							href={`/categories/${cat.slug}/`}
							className="group border-border bg-card relative overflow-hidden rounded-xl border shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
						>
							{cat.backgroundImage?.url ? (
								<div className="relative aspect-[4/3] w-full overflow-hidden">
									<Image
										src={cat.backgroundImage.url}
										alt={cat.backgroundImage.alt ?? cat.name}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
									<div className="absolute right-3 bottom-3 left-3">
										<span className="text-sm font-semibold text-white drop-shadow">{cat.name}</span>
										{cat.seoDescription && (
											<p className="mt-0.5 line-clamp-1 text-xs text-white/70">{cat.seoDescription}</p>
										)}
									</div>
								</div>
							) : (
								<div className="flex h-32 flex-col justify-between p-5">
									<div className="bg-info/10 flex h-10 w-10 items-center justify-center rounded-full">
										<Icon className="text-info h-5 w-5" strokeWidth={1.6} />
									</div>
									<div>
										<p className="text-foreground group-hover:text-info text-base font-semibold transition-colors">
											{cat.name}
										</p>
										{cat.seoDescription ? (
											<p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-snug">
												{cat.seoDescription}
											</p>
										) : (
											<p className="text-muted-foreground mt-0.5 text-xs">Khám phá ngay →</p>
										)}
									</div>
								</div>
							)}
						</LinkWithChannel>
					);
				})}
			</div>
		</section>
	);
};

export { SearchCategoryTiles };
