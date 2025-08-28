export const getPaperProductTestName = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const abTestName =
		searchParams.get('paperProductTabs') === 'true'
			? 'paperProductTabs'
			: undefined;
	return abTestName;
};
