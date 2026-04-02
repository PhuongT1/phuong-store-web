import { Loading } from "@components/ui";
import { useGlobalSWRLoading } from "@store/useLoadingStore";

const GlobalLoading = () => {
	const { count, isLoadingVisible } = useGlobalSWRLoading();

	const isLoading = isLoadingVisible || count > 0;

	if (!isLoading) return null;

	return <Loading />;
};

export { GlobalLoading };
