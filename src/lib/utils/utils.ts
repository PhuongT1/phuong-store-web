const isServer = () => {
	return typeof window === "undefined";
};

const isNotNil = <T>(v: T | null | undefined): v is T => v !== null && v !== undefined;

export { isServer, isNotNil };
