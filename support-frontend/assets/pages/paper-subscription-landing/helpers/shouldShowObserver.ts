import { isProd } from 'helpers/urls/url';

const shouldShowObserverCard = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const enableObserver = searchParams.get('enableObserver');

	return enableObserver && !isProd();
};

export default shouldShowObserverCard;
