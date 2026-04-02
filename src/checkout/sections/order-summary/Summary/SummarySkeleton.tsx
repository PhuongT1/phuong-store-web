export const SummarySkeleton = () => (
	<div className="px-6 pt-6">
		<div className="animate-pulse space-y-4">
			{/* Subtotal */}
			<div className="flex justify-between">
				<div className="bg-muted h-4 w-1/5 rounded" />
				<div className="bg-muted h-4 w-1/6 rounded" />
			</div>
			{/* Shipping */}
			<div className="flex justify-between">
				<div className="bg-muted h-4 w-1/4 rounded" />
				<div className="bg-muted h-4 w-1/6 rounded" />
			</div>
			<div className="bg-border h-px" />
			{/* Total */}
			<div className="flex justify-between">
				<div className="bg-muted h-6 w-1/3 rounded" />
				<div className="bg-muted h-6 w-1/4 rounded" />
			</div>
		</div>
	</div>
);
