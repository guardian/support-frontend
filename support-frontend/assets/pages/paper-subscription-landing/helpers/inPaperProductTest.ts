import { isCode } from 'helpers/urls/url';

export const inPaperProductTest = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const inPaperProductTabs = searchParams.get('paperProductTabs') === 'true';
	return inPaperProductTabs || isCode();
};
