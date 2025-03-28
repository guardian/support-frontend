import { isCode } from 'helpers/urls/url';

const shouldShowObserverCard = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const enableObserver = searchParams.get('enableObserver');

	return enableObserver ?? isCode();
};

export default shouldShowObserverCard;
