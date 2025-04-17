import { isCode, isProd } from 'helpers/urls/url';

const shouldShowObserverCard = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const enableObserver = searchParams.get('enableObserver') === 'true';

	return enableObserver || isCode() || isProd();
};

export default shouldShowObserverCard;
