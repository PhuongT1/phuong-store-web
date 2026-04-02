type LoginForm = {
	email: string;
	password?: string;
};

type ErrorForm = {
	field: string;
	message: string;
}[];

export { type LoginForm, type ErrorForm };
