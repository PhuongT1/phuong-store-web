"use client";

import edjsHTML from "editorjs-html";
import { TableElement } from "./TableElement";
import { EmbedElement } from "./EmbedElement";

const RenderRichText = ({ item }: { item?: string | null }) => {
	const parser = edjsHTML({
		embed: EmbedElement,
		table: TableElement
	});

	let description: string[] | null = null;

	try {
		if (item) {
			const parsedData = JSON.parse(item);
			description = parser.parse(parsedData);
		}
	} catch (error) {
		console.error("Error parsing or rendering content:", error);
	}

	return (
		<>
			{description?.map((content, index) => (
				<div className="rich-text text-sm" key={index} dangerouslySetInnerHTML={{ __html: content }} />
			))}
		</>
	);
};

RenderRichText.displayName = "RenderRichText";

export { RenderRichText };
