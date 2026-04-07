import { type NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				hostname: "*"
			}
		]
	},
	typescript: {
		ignoreBuildErrors: true
	},
	eslint: {
		ignoreDuringBuilds: true
	},

	experimental: {
		turbo: {
			rules: {
				"*.svg": {
					loaders: [
						{
							loader: "@svgr/webpack",
							options: {
								icon: true
							}
						}
					],
					as: "*.js"
				}
			}
		}
	},
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined
};

export default withNextIntl(config);
