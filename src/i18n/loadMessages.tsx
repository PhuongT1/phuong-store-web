import path from "path";
import { promises as fs } from "fs";

export async function loadAllJson(locate: any) {
	const dirPath = path.join(process.cwd(), `messages/${locate}`);
	const files = await fs.readdir(dirPath);

	const jsonFiles = files.filter((f) => f.endsWith(".json"));

	const data = await Promise.all(
		jsonFiles.map(async (file) => {
			const content = await fs.readFile(path.join(dirPath, file), "utf8");
			return JSON.parse(content);
		})
	);

	return data;
}
