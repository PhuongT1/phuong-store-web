type LoginForm = {
	email: string;
	password: string;
};

type ErrorForm = {
	field: keyof LoginForm;
	message: string;
}[];

export { type LoginForm, type ErrorForm };
