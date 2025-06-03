import { isCode } from 'helpers/urls/url';

export const displayPaperProductTabs = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const enableObserver = searchParams.get('paperProductTabs') === 'true';
	return enableObserver || isCode();
};
