"use client";

import { Search } from "lucide-react";
import { LinkWithChannel } from "@components/navigation";

type SearchEmptyStateProps = {
	searchQuery?: string;
};

const SearchEmptyState = ({ searchQuery }: SearchEmptyStateProps) => {
	const suggestedCategories = [
		{ name: "Giày dép", href: "/collections/shoes" },
		{ name: "Quần áo", href: "/collections/clothing" },
		{ name: "Phụ kiện", href: "/collections/accessories" },
		{ name: "Thể thao", href: "/collections/sports" }
	];

	return (
		<section className="py-20">
			<div className="mx-auto max-w-2xl text-center">
				<div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
					<Search className="h-10 w-10 text-gray-400" />
				</div>

				<h2 className="mb-3 text-3xl font-semibold tracking-tight text-gray-900">
					{searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : "Không tìm thấy sản phẩm"}
				</h2>

				<p className="mb-10 text-base leading-relaxed text-gray-600">
					Hãy thử tìm kiếm với từ khóa khác hoặc xem các danh mục phổ biến bên dưới
				</p>

				<div className="mb-10">
					<p className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">Danh mục phổ biến</p>
					<div className="flex flex-wrap justify-center gap-3">
						{suggestedCategories.map((category) => (
							<LinkWithChannel
								key={category.name}
								href={category.href}
								className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
							>
								{category.name}
							</LinkWithChannel>
						))}
					</div>
				</div>

				<div className="text-sm text-gray-600">
					<p className="mb-3 font-semibold text-gray-900">Gợi ý tìm kiếm:</p>
					<ul className="space-y-2 text-sm">
						<li>• Kiểm tra lỗi chính tả</li>
						<li>• Thử sử dụng từ khóa ngắn gọn hơn</li>
						<li>• Tìm kiếm với tên sản phẩm hoặc thương hiệu</li>
					</ul>
				</div>
			</div>
		</section>
	);
};

export { SearchEmptyState };
