"use client";

type TableElementProps = {
	data: {
		content: string[][];
	};
};

const TableElement = ({ data }: TableElementProps) => {
	const rows = data.content
		.map((row: string[]) => {
			return `<tr>${row
				.map((cell: string, cellIndex: number) => {
					const isFirstCell = cellIndex === 0;
					return `<td class="${isFirstCell ? "w-[200px]" : ""} border-b border-gray-300 py-3">${cell}</td>`;
				})
				.join("")}</tr>`;
		})
		.join("");
	return `<table class="w-full">${rows}</table>`;
};

TableElement.displayName = "TableElement";

export { TableElement, type TableElementProps };
