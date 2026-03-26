import { Skeleton } from "./Skeleton";

const ProductFilterSkeleton = () => {
	return (
		<aside className="h-full overflow-hidden md:sticky md:top-[72px]">
			<div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-sm">
				{/* Header: Bộ lọc + Xóa */}
				<div className="flex items-center justify-between border-b pb-4">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-7 w-10" />
				</div>
				{/* Accordion sections */}
				{["Mức giá", "Tình trạng", "Thương hiệu", "Kích thước", "Màu sắc"].map((label, i) => (
					<div key={i} className="space-y-3 border-b-0 py-2">
						<Skeleton className="h-4 w-24" />
						{i === 0 && (
							<div className="space-y-2">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-24" />
								<div className="mt-2 grid grid-cols-2 gap-2">
									<Skeleton className="h-9" />
									<Skeleton className="h-9" />
								</div>
							</div>
						)}
						{i === 1 && <Skeleton className="h-5 w-24" />}
						{i === 2 && (
							<div className="space-y-2">
								{[1, 2, 3].map((j) => <Skeleton key={j} className="h-5 w-28" />)}
							</div>
						)}
						{i === 3 && (
							<div className="flex flex-wrap gap-2">
								{["S", "M", "L", "XL", "XXL"].map((s) => <Skeleton key={s} className="h-10 w-12 rounded-md" />)}
							</div>
						)}
						{i === 4 && (
							<div className="flex flex-wrap gap-3">
								{[1, 2, 3, 4, 5].map((j) => <Skeleton key={j} className="h-10 w-10 rounded-full" />)}
							</div>
						)}
					</div>
				))}
			</div>
		</aside>
	);
};
ProductFilterSkeleton.displayName = "ProductFilterSkeleton";

export { ProductFilterSkeleton };
