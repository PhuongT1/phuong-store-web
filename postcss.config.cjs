module.exports = {
	plugins: {
		"@tailwindcss/postcss": {},
		autoprefixer: {},
		"postcss-pxtorem": {
			rootValue: 16, // Base font size (e.g., 16px for 1rem)
			unitPrecision: 5, // Precision of the generated rem values
			propList: [
				"*",
				"!border-width",
				"!border-top-width",
				"!border-right-width",
				"!border-bottom-width",
				"!border-left-width"
			], // Properties to convert (use '*' for all, or specify)
			selectorBlackList: [], // Selectors to ignore
			replace: true, // Replace px with rem
			mediaQuery: false, // Don't convert px in media queries
			minPixelValue: 0, // Minimum pixel value to convert
			exclude: /node_modules/i // Exclude files from conversion
		}
	}
};
