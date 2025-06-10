export const displayPaperProductTabs = () => {
	const searchParams = new URLSearchParams(window.location.search);
	return searchParams.get('paperProductTabs') === 'true';
};
