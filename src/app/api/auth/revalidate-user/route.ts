// src/app/api/revalidate-user/route.ts
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST() {
	revalidateTag("posts");
	return Response.json({ message: "User data revalidated" });
}
