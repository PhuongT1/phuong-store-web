import Image from "next/image";
import { ArrowRight, MoveRight, Sparkles, Star, Zap } from "lucide-react";
import { CategoriesListDocument, CollectionsListDocument, type ProductFragment } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";
import { SAMPLE_BLOG_POSTS } from "@/lib/blog-samples";
import { ContainerLayout } from "@components/layouts";
import { LinkWithChannel } from "@components/navigation";

type HomePageSectionsProps = {
	products: ProductFragment[];
	channel: string;
};

type EditorialLink = {
	label: string;
	href: string;
};

const FALLBACK_CATEGORY_LINKS: EditorialLink[] = [
	{ label: "Running", href: "/search?filter_search=running" },
	{ label: "Lifestyle", href: "/search?filter_search=sneaker" },
	{ label: "Training", href: "/search?filter_search=training" }
];

const FALLBACK_COLLECTION_LINKS: EditorialLink[] = [
	{ label: "New season", href: "/search?filter_search=new" },
	{ label: "Best sellers", href: "/search?filter_search=best" },
	{ label: "Everyday icons", href: "/search?filter_search=classic" }
];

const formatPrice = (product?: ProductFragment) => {
	const amount = product?.pricing?.priceRange?.start?.gross.amount;
	const currency = product?.pricing?.priceRange?.start?.gross.currency;

	if (amount == null || !currency) {
		return "Xem chi tiết";
	}

	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency,
		maximumFractionDigits: amount % 1 === 0 ? 0 : 2
	}).format(amount);
};

const getCategoryLinks = async (): Promise<EditorialLink[]> => {
	try {
		const data = await executeGraphQL(CategoriesListDocument, {
			variables: { first: 6, level: 0 }
		});

		const categories =
			data.categories?.edges
				.map(({ node }) => node)
				.filter((category) => category.slug && category.name)
				.slice(0, 3)
				.map((category) => ({
					label: category.name,
					href: `/categories/${category.slug}/`
				})) ?? [];

		return categories.length > 0 ? categories : FALLBACK_CATEGORY_LINKS;
	} catch {
		return FALLBACK_CATEGORY_LINKS;
	}
};

const getCollectionLinks = async (channel: string): Promise<EditorialLink[]> => {
	try {
		const data = await executeGraphQL(CollectionsListDocument, {
			variables: { first: 6, channel }
		});

		const collections =
			data.collections?.edges
				.map(({ node }) => node)
				.filter((collection) => collection.slug && collection.name)
				.slice(0, 3)
				.map((collection) => ({
					label: collection.name,
					href: `/collections/${collection.slug}/`
				})) ?? [];

		return collections.length > 0 ? collections : FALLBACK_COLLECTION_LINKS;
	} catch {
		return FALLBACK_COLLECTION_LINKS;
	}
};

const ProductFeatureCard = ({
	product,
	eyebrow,
	description,
	background
}: {
	product?: ProductFragment;
	eyebrow: string;
	description: string;
	background: string;
}) => {
	if (!product) return null;

	return (
		<LinkWithChannel
			href={`/products/${product.slug}`}
			className="group block w-full relative overflow-hidden rounded-[32px] border border-black/10 dark:border-white/10"
		>
			<div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105" style={{ background }} />
			<div className="relative z-10 grid min-h-[420px] gap-6 p-8 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
				<div className="relative z-10 flex max-w-xl flex-col justify-between">
					<div>
						<p className="text-xs font-semibold tracking-[0.28em] uppercase text-white/60">{eyebrow}</p>
						<h2 className="mt-4 max-w-lg text-4xl leading-[0.95] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
							{product.name}
						</h2>
						<p className="mt-5 max-w-md text-sm leading-6 text-white/72 sm:text-base">{description}</p>
					</div>

					<div className="mt-10 flex flex-wrap items-center gap-3">
						<span className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm font-medium text-white/92 backdrop-blur">
							{formatPrice(product)}
						</span>
						<span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform duration-300 group-hover:translate-x-1">
							Khám phá
							<ArrowRight className="h-4 w-4" />
						</span>
					</div>
				</div>

				<div className="relative flex min-h-[240px] items-end justify-center lg:min-h-[360px]">
					<div className="absolute inset-x-[8%] top-[18%] bottom-0 rounded-[28px] bg-white/10 blur-3xl" />
					{product.thumbnail?.url ? (
						<Image
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? product.name}
							width={780}
							height={780}
							className="relative z-10 max-h-[320px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.03]"
							sizes="(max-width: 1024px) 100vw, 42vw"
							priority
						/>
					) : (
						<div className="relative z-10 h-[240px] w-[240px] rounded-full border border-white/12 bg-white/10" />
					)}
				</div>
			</div>
		</LinkWithChannel>
	);
};

const ProductMiniCard = ({ product }: { product?: ProductFragment }) => {
	if (!product) return null;

	return (
		<LinkWithChannel
			href={`/products/${product.slug}`}
			className="group block border-border/50 bg-card/90 hover:bg-card relative overflow-hidden rounded-[28px] border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-35px_rgba(15,23,42,0.55)]"
		>
			<div className="from-muted/70 to-background dark:from-muted/10 relative flex aspect-[1/1.05] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br">
				<div className="absolute inset-x-[14%] bottom-[10%] h-12 rounded-full bg-black/10 dark:bg-white/5 blur-2xl" />
				{product.thumbnail?.url ? (
					<Image
						src={product.thumbnail.url}
						alt={product.thumbnail.alt ?? product.name}
						width={520}
						height={520}
						className="relative z-10 max-h-[220px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
						sizes="(max-width: 768px) 50vw, 25vw"
					/>
				) : (
					<div className="h-32 w-32 rounded-full bg-white/60" />
				)}
			</div>

			<div className="mt-4 flex items-start justify-between gap-4">
				<div>
					<p className="text-muted-foreground text-[11px] font-semibold tracking-[0.22em] uppercase">
						{product.category?.name ?? "Signature"}
					</p>
					<h3 className="text-foreground mt-2 text-lg font-semibold tracking-tight">{product.name}</h3>
				</div>
				<MoveRight className="text-muted-foreground mt-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
			</div>

			<div className="mt-3 flex items-center justify-between">
				<p className="text-foreground text-sm font-semibold">{formatPrice(product)}</p>
				{product.pricing?.onSale && (
					<span className="rounded-full bg-emerald-500/12 px-3 py-1 text-[11px] font-semibold text-emerald-700">
						On sale
					</span>
				)}
			</div>
		</LinkWithChannel>
	);
};

const SpotlightPanel = ({
	title,
	description,
	link,
	icon,
	background
}: {
	title: string;
	description: string;
	link: EditorialLink;
	icon: React.ReactNode;
	background: string;
}) => (
	<LinkWithChannel
		href={link.href}
		className="group block relative overflow-hidden rounded-[28px] p-6 lg:min-h-[280px]"
	>
		<div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105" style={{ background }} />
		<div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)] mix-blend-overlay" />
		<div className="relative z-10 flex h-full min-h-[240px] flex-col justify-between">
			<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-white/10 text-white backdrop-blur">
				{icon}
			</div>

			<div>
				<p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/65">Featured</p>
				<h3 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-white">{title}</h3>
				<p className="mt-3 max-w-sm text-sm leading-6 text-white/72">{description}</p>
				<div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
					{link.label}
					<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
				</div>
			</div>
		</div>
	</LinkWithChannel>
);

const HomePageSections = async ({ products, channel }: HomePageSectionsProps) => {
	const categoryLinks = await getCategoryLinks(channel);
	const collectionLinks = await getCollectionLinks(channel);
	const featuredProducts = products.slice(0, 6);
	const heroProduct = featuredProducts[0];
	const heroAccentProduct = featuredProducts[1];
	const heroEdgeProduct = featuredProducts[2];
	const editorialProducts = featuredProducts.slice(2, 6);
	const stories = SAMPLE_BLOG_POSTS.slice(0, 3);

	return (
		<div className="bg-background min-h-screen overflow-x-hidden pb-24">
			<section className="border-border/45 border-b">
				<ContainerLayout className="py-3">
					<div className="text-foreground/82 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[12px] font-medium sm:text-[13px]">
						<span>Thiết kế tinh giản, công năng vượt trội, chuẩn mực mới.</span>
						<span className="hidden text-foreground/28 sm:inline">•</span>
						<span>Miễn phí giao hàng cho đơn hàng tiêu chuẩn.</span>
						<span className="hidden text-foreground/28 sm:inline">•</span>
						<span>Những sản phẩm hoàn hảo cho nhịp sống hiện đại mỗi ngày.</span>
					</div>
				</ContainerLayout>
			</section>

			<ContainerLayout className="space-y-8 py-4 md:space-y-10 md:py-6">
				<ProductFeatureCard
					product={heroProduct}
					eyebrow="Deal24 Home"
					description="Trang chủ không chỉ để xem sản phẩm. Đây là nơi mở đầu cho những drop đáng mặc, những đôi giày đang lên form và những món đồ khiến bạn muốn bấm vào ngay."
					background="linear-gradient(135deg, #0b1220 0%, #12233b 38%, #1f4a6d 100%)"
				/>

				<div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
					<SpotlightPanel
						title="Được chế tác để bứt tốc."
						description="Lựa chọn tối ưu dành cho chạy bộ, tập luyện cường độ cao và những ngày bạn muốn di chuyển nhanh hơn."
						link={categoryLinks[0] ?? FALLBACK_CATEGORY_LINKS[0]}
						icon={<Zap className="h-5 w-5" />}
						background="linear-gradient(160deg, #0f172a 0%, #172554 52%, #1d4ed8 100%)"
					/>
					<SpotlightPanel
						title="Sự sang trọng thầm lặng."
						description="Form dáng gọn gàng, bảng màu tinh tế. Sản phẩm dễ mặc mỗi ngày nhưng vẫn duy trì sự cao cấp."
						link={collectionLinks[0] ?? FALLBACK_COLLECTION_LINKS[0]}
						icon={<Sparkles className="h-5 w-5" />}
						background="linear-gradient(160deg, #3b2519 0%, #70482f 52%, #c58a52 100%)"
					/>
					<SpotlightPanel
						title="Biểu tượng vượt thời gian."
						description="Những thiết kế mang tính biểu tượng, kiến tạo giá trị bền vững thay vì trào lưu nhất thời."
						link={collectionLinks[1] ?? FALLBACK_COLLECTION_LINKS[1]}
						icon={<Star className="h-5 w-5" />}
						background="linear-gradient(160deg, #17302a 0%, #115e59 48%, #0f766e 100%)"
					/>
				</div>

				<section className="overflow-hidden rounded-[32px] border border-black/5 dark:border-white/5 bg-[linear-gradient(180deg,#faf7f2_0%,#ffffff_58%,#f7f9fc_100%)] dark:bg-[linear-gradient(180deg,#09090b_0%,#18181b_58%,#09090b_100%)]">
					<div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12">
						<div className="max-w-lg">
							<p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
								Tôn vinh nhịp điệu riêng
							</p>
							<h2 className="text-foreground mt-4 text-4xl leading-[0.95] font-semibold tracking-tight sm:text-5xl">
								Nội dung là trung tâm của trải nghiệm.
							</h2>
							<p className="text-muted-foreground mt-5 text-sm leading-7 sm:text-base">
								Phong cách thiết kế trang chủ tinh tế và mạch lạc: một điểm nhấn lớn để khơi gợi cảm xúc, tiếp theo là các tiêu điểm spotlight để mở rộng câu chuyện, rồi mới nhẹ nhàng dẫn dắt bạn vào từng bộ sưu tập.
							</p>

							<div className="mt-8 grid gap-3 sm:grid-cols-2">
								<div className="rounded-2xl border border-black/6 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 p-4">
									<p className="text-foreground text-2xl font-semibold">03</p>
									<p className="text-muted-foreground mt-1 text-sm">Lớp nội dung gồm Campaign, Category, và Curated.</p>
								</div>
								<div className="rounded-2xl border border-black/6 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 p-4">
									<p className="text-foreground text-2xl font-semibold">01</p>
									<p className="text-muted-foreground mt-1 text-sm">Thông điệp rõ ràng, tập trung vào trải nghiệm cốt lõi.</p>
								</div>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="from-[#f5f0e6] to-[#ffffff] dark:from-zinc-900 dark:to-zinc-950 rounded-[26px] bg-gradient-to-br p-5">
								<p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">Need state</p>
								<h3 className="text-foreground mt-3 text-2xl font-semibold">Chạy bộ. Tập luyện. Phục hồi.</h3>
								<p className="text-muted-foreground mt-3 text-sm leading-6">
									Hành trình mua sắm linh hoạt, được dẫn dắt bằng chính nhu cầu thực sự của bạn.
								</p>
							</div>
							<div className="from-[#edf5ff] to-[#ffffff] dark:from-zinc-900 dark:to-zinc-950 rounded-[26px] bg-gradient-to-br p-5">
								<p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">Merchandising</p>
								<h3 className="text-foreground mt-3 text-2xl font-semibold">Hiện diện nổi bật.</h3>
								<p className="text-muted-foreground mt-3 text-sm leading-6">
									Chọn lọc những tinh hoa đắt giá nhất, đủ mạnh mẽ để tạo nên giá trị tuyệt đối.
								</p>
							</div>
							<div className="from-[#f3f0ff] to-[#ffffff] dark:from-zinc-900 dark:to-zinc-950 rounded-[26px] bg-gradient-to-br p-5 sm:col-span-2">
								<p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">Storytelling</p>
								<h3 className="text-foreground mt-3 text-2xl font-semibold">
									Mang đến cho sản phẩm một bối cảnh sống động.
								</h3>
								<p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
									Sự kết hợp hoàn hảo giữa thương mại và nghệ thuật: đẹp để nhìn ngắm, mượt mà để lướt, và luôn đủ tinh tế để thuyết phục.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="space-y-6 py-4">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
								Tuyển chọn tuần này
							</p>
							<h2 className="text-foreground mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
								Khám phá bộ sưu tập tinh hoa.
							</h2>
							<p className="text-muted-foreground mt-3 text-sm leading-6 sm:text-base">
								Chỉ những sản phẩm vươn tầm chuẩn mực - sở hữu thiết kế tuyệt mỹ, chất lượng hoàn hảo và sức hút khó cưỡng ngay từ ánh nhìn đầu tiên.
							</p>
						</div>

						<LinkWithChannel
							href={collectionLinks[2]?.href ?? "/search"}
							className="text-foreground inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
						>
							Xem tất cả
							<MoveRight className="h-4 w-4" />
						</LinkWithChannel>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{editorialProducts.map((product) => (
							<ProductMiniCard key={product.id} product={product} />
						))}
					</div>
				</section>

				<section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
					<div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f1115_0%,#191d28_42%,#2f3445_100%)] p-6 sm:p-8">
						<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
							<div className="max-w-xl relative z-10">
								<p className="text-xs font-semibold tracking-[0.28em] uppercase text-white/55">Tâm điểm ánh nhìn</p>
								<h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
									Khơi dậy niềm khao khát ngay từ phút đầu tiên.
								</h2>
								<p className="mt-4 text-sm leading-7 text-white/68 sm:text-base">
									Lấy cảm hứng từ ngôn ngữ thiết kế đẳng cấp quốc tế: sử dụng các block biểu đạt vững chãi, tiết chế ký tự để nhường chỗ cho hình ảnh quyền lực, tối giản để dẫn dắt từng nhịp chạm.
								</p>

								<div className="mt-7 flex flex-wrap gap-3">
									{categoryLinks.map((link) => (
										<LinkWithChannel
											key={link.href}
											href={link.href}
											className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white/88 backdrop-blur transition-colors hover:bg-white/12"
										>
											{link.label}
										</LinkWithChannel>
									))}
								</div>
							</div>

							<div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
								{heroAccentProduct && (
									<LinkWithChannel
										href={`/products/${heroAccentProduct.slug}`}
										className="group from-white/12 to-white/4 block rounded-[28px] border border-white/10 bg-gradient-to-br p-4"
									>
										<div className="relative flex aspect-[1/1.05] items-center justify-center overflow-hidden rounded-[22px] bg-black/10">
											{heroAccentProduct.thumbnail?.url ? (
												<Image
													src={heroAccentProduct.thumbnail.url}
													alt={heroAccentProduct.thumbnail.alt ?? heroAccentProduct.name}
													width={420}
													height={420}
													className="max-h-[200px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
													sizes="(max-width: 1024px) 50vw, 22vw"
												/>
											) : null}
										</div>
										<p className="mt-4 text-sm font-semibold text-white/92">{heroAccentProduct.name}</p>
										<p className="mt-1 text-sm text-white/55">{formatPrice(heroAccentProduct)}</p>
									</LinkWithChannel>
								)}

								{heroEdgeProduct && (
									<LinkWithChannel
										href={`/products/${heroEdgeProduct.slug}`}
										className="group from-white/12 to-white/4 block rounded-[28px] border border-white/10 bg-gradient-to-br p-4"
									>
										<div className="relative flex aspect-[1/1.05] items-center justify-center overflow-hidden rounded-[22px] bg-black/10">
											{heroEdgeProduct.thumbnail?.url ? (
												<Image
													src={heroEdgeProduct.thumbnail.url}
													alt={heroEdgeProduct.thumbnail.alt ?? heroEdgeProduct.name}
													width={420}
													height={420}
													className="max-h-[200px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
													sizes="(max-width: 1024px) 50vw, 22vw"
												/>
											) : null}
										</div>
										<p className="mt-4 text-sm font-semibold text-white/92">{heroEdgeProduct.name}</p>
										<p className="mt-1 text-sm text-white/55">{formatPrice(heroEdgeProduct)}</p>
									</LinkWithChannel>
								)}
							</div>
						</div>
					</div>

					<div className="grid gap-4">
						{stories.map((story, index) => (
							<LinkWithChannel
								key={story.slug}
								href={`/blog/${story.slug}`}
								className="group border-border/45 bg-card/88 hover:bg-card block rounded-[28px] border p-6 transition-all duration-300 hover:-translate-y-1"
							>
								<p className="text-muted-foreground text-xs font-semibold tracking-[0.24em] uppercase">
									Story {String(index + 1).padStart(2, "0")}
								</p>
								<h3 className="text-foreground mt-3 text-2xl font-semibold tracking-tight">{story.title}</h3>
								<p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-6">
									{story.seoDescription ?? story.title}
								</p>
								<span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
									Đọc tiếp
									<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
								</span>
							</LinkWithChannel>
						))}
					</div>
				</section>
			</ContainerLayout>
		</div>
	);
};

HomePageSections.displayName = "HomePageSections";

export { HomePageSections };
