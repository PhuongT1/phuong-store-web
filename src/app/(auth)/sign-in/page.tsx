import { SignIn } from "./SignIn";

const LoginPage = () => {
	return (
		<section className="flex flex-1 items-center justify-center p-4 sm:p-8">
			<SignIn />
		</section>
	);
};

export { LoginPage as default };
