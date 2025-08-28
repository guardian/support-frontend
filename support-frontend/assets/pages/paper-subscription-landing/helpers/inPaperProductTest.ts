export const inPaperProductTest = () => {
	const searchParams = new URLSearchParams(window.location.search);
	return searchParams.get('paperProductTabs') === 'true';
};
