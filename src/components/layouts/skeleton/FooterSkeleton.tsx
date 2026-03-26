import { Skeleton } from "@components/skeleton";
import { FooterContainer } from "../footer/container/FooterContainer";
import { CatalogContainer } from "../footer/container/CatalogContainer";

const FooterSkeleton = () => {
	return (
		<FooterContainer>
			<CatalogContainer>
				{Array.from({ length: 3 })?.map((_, index) => (
					<div key={index}>
						<Skeleton className="h-6 w-2/3" key={index} />
						<ul className="mt-2 sm:mt-4">
							{Array.from({ length: 2 })?.map((_, index) => (
								<Skeleton className="my-2 h-4 w-1/3 text-sm md:my-4" key={index} />
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
