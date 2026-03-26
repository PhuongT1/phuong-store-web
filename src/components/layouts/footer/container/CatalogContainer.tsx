const CatalogContainer = ({ children }: React.PropsWithChildren) => {
	return <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:gap-12">{children}</div>;
};

export { CatalogContainer };
