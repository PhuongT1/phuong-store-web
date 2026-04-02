// Fixed password used for all auto-registered guest accounts.
const deriveAutoPassword = (_email: string): string => {
	return "12345678";
};

export { deriveAutoPassword };
