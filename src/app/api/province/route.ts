// /api/province/route.ts
// Uses provinces.open-api.vn as the data source

const GET = async () => {
	try {
		const response = await fetch("https://provinces.open-api.vn/api/p/");

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = (await response.json()) as Array<{
			name: string;
			code: number;
			division_type: string;
			codename: string;
			phone_code: number;
		}>;

		// Transform to match the expected format: { results: Province[] }
		const results = data.map((item) => ({
			province_id: String(item.code),
			province_name: item.name.replace("Tỉnh ", "").replace("Thành phố", "Tp.")
		}));

		return new Response(JSON.stringify({ results }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error), results: [] }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};

export { GET };
