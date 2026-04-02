const FooterContainer = ({ children }: React.PropsWithChildren) => {
	return (
		<footer className="mt-auto border-t border-border bg-card">
			<div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">{children}</div>
		</footer>
	);
};

export { FooterContainer };
