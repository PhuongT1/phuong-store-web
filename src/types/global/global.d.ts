type Messages = typeof import("../../../messages/vi-VN.json");
type NonFalsy<T> = T extends false | 0 | "" | null | undefined | 0n ? never : T;
/**
 * 🔧 Utility Type: MakeOptional
 *
 * Transforms one or more properties (`K`) of a given type (`T`)
 * from required to optional.
 *
 * @template T - The original type to modify.
 * @template K - One or more keys of `T` that should become optional.
 *
 * 📘 How it works:
 * - `Omit<T, K>` removes the specified keys from `T`.
 * - `Partial<Pick<T, K>>` creates a version of those keys where all are optional.
 * - The two parts are combined (`&`) to form a new type.
 *
 * 🧩 Example:
 * ```ts
 * type User = { id: string; name: string; email: string };
 *
 * type UserWithOptionalEmail = MakeOptional<User, 'email'>;
 * // => { id: string; name: string; email?: string }
 *
 * type UserWithOptionalFields = MakeOptional<User, 'name' | 'email'>;
 * // => { id: string; name?: string; email?: string }
 * ```
 */
type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface Array<T> {
	includes(searchElement: unknown, fromIndex?: number): searchElement is T;
}

interface ReadonlyArray<T> {
	includes(searchElement: unknown, fromIndex?: number): searchElement is T;
}

interface Body {
	json(): Promise<unknown>;
}

interface Array<T> {
	filter(predicate: BooleanConstructor, thisArg?: unknown): NonFalsy<T>[];
}

interface ReadonlyArray<T> {
	filter(predicate: BooleanConstructor, thisArg?: unknown): NonFalsy<T>[];
}

interface ArrayConstructor {
	isArray(arg: unknown): arg is unknown[];
}

interface JSON {
	/**
	 * Converts a JavaScript Object Notation (JSON) string into an object.
	 * @param text A valid JSON string.
	 * @param reviver A function that transforms the results. This function is called for each member of the object.
	 * If a member contains nested objects, the nested objects are transformed before the parent object is.
	 */
	parse(text: string, reviver?: (this: unknown, key: string, value: unknown) => unknown): unknown;
}

interface Set<T> {
	has(value: unknown): value is T;
}

declare module "*.svg" {
	import { type FC, type SVGProps } from "react";
	const content: FC<SVGProps<SVGElement>>;

	export default content;
}

declare module "*.svg?url" {
	const content: any;

	export default content;
}

declare interface IntlMessages extends Messages {}

type Slug = string;
type Id = string;
type RevalidateTag =
	| "DETAIL-PAGE:PRODUCT"
	| `PRODUCT:${Slug}`
	| `CMS:${Slug}`
	| "SEARCH"
	| "SEARCH:FACETS"
	| `SEARCH:${Slug}`
	| `CHECKOUT:${Id}`
	| "USER:CURRENT";

declare global {
	type RevalidateTag = RevalidateTag;
}

interface NextFetchRequestConfig {
	tags?: RevalidateTag[];
}
