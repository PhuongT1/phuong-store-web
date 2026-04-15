import Image from "next/image";
import { Flame } from "lucide-react";
import { CollectionsListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";
import { LinkWithChannel } from "@components/navigation";

const SearchTrendingCollections = async ({ channel }: { channel: string }) => {
	let collections: {
		id: string;
		name: string;
		slug: string;
		seoDescription?: string | null;
		backgroundImage?: { url: string; alt?: string | null } | null;
	}[] = [];
	try {
		const data = await executeGraphQL(CollectionsListDocument, {
			variables: { first: 20, channel }
		});
		collections = data.collections?.edges.map((e) => e.node) ?? [];
	} catch {
		// fail silently — show nothing if API is unavailable
	}

	if (collections.length === 0) return null;

	return (
		<section className="py-12">
			<div className="mb-8 flex items-center gap-2">
				<Flame className="text-info h-5 w-5" />
				<div>
					<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Trending</p>
					<h2 className="text-foreground text-2xl font-semibold tracking-tight">Shop by Collection</h2>
				</div>
			</div>
			<div className="scrollbar-hide w-full overflow-x-hidden">
				<div className="flex gap-4 overflow-x-auto pb-4">
					{collections.map((col) => (
						<LinkWithChannel
							key={col.id}
							href={`/collections/${col.slug}/`}
							className="group border-border bg-card relative min-w-[220px] shrink-0 overflow-hidden rounded-xl border shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md sm:min-w-[260px]"
						>
							{col.backgroundImage?.url ? (
								<div className="relative h-36 w-full overflow-hidden">
									<Image
										src={col.backgroundImage.url}
										alt={col.backgroundImage.alt ?? col.name}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
										sizes="260px"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
									<div className="absolute right-4 bottom-3 left-4">
										<span className="text-sm font-semibold text-white drop-shadow">{col.name}</span>
										{col.seoDescription && (
											<p className="mt-0.5 line-clamp-1 text-xs text-white/70">{col.seoDescription}</p>
										)}
									</div>
								</div>
							) : (
								<div className="flex h-32 flex-col justify-between p-5">
									<div className="bg-info/10 flex h-9 w-9 items-center justify-center rounded-full">
										<Flame className="text-info h-4 w-4" />
									</div>
									<div>
										<p className="text-foreground group-hover:text-info text-base font-semibold transition-colors">
											{col.name}
										</p>
										{col.seoDescription ? (
											<p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-snug">
												{col.seoDescription}
											</p>
										) : (
											<p className="text-muted-foreground mt-0.5 text-xs">Xem bộ sưu tập →</p>
										)}
									</div>
								</div>
							)}
						</LinkWithChannel>
					))}
				</div>
			</div>
		</section>
	);
};

export { SearchTrendingCollections };
