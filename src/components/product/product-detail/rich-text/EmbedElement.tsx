"use client";

import xss from "xss";

interface EmbedData {
	data?: {
		service?: string;
		source?: string;
	};
}

const EmbedElement = ({ data }: EmbedData) => {
	if (data?.service === "youtube" && data?.source) {
		const videoIdMatch = data.source.match(/(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=)([^&?\/\s]+)/);
		const videoId = videoIdMatch ? videoIdMatch[1] : null;

		if (videoId) {
			const videoUrl = `https://www.youtube.com/embed/${videoId}`;
			return `
				<div class="youtube-embed" style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
					<iframe
						src="${xss(videoUrl)}"
						style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen>
					</iframe>
				</div>
			`;
		}
	}
	return `<p>Không hỗ trợ url </p>`;
};

EmbedElement.displayName = "EmbedElement";

export { EmbedElement };
