import { Skeleton } from "@components/skeleton";
import { CatalogContainer } from "../footer/container/CatalogContainer";
import { FooterContainer } from "../footer/container/FooterContainer";

const FooterSkeleton = () => {
	return (
		<FooterContainer>
			<CatalogContainer>
				{Array.from({ length: 3 })?.map((_, index) => (
					<div key={index}>
						<Skeleton className="mb-4 h-3 w-24 rounded-full sm:mb-8" key={index} />
						<ul className="mt-2 sm:mt-4">
							{Array.from({ length: 2 })?.map((_, index) => (
								<Skeleton className="my-2 h-4 w-2/3 rounded-full text-sm md:my-4" key={index} />
							))}
						</ul>
					</div>
				))}
			</CatalogContainer>
		</FooterContainer>
	);
};
FooterSkeleton.displayName = "FooterSkeleton";

export { FooterSkeleton };
