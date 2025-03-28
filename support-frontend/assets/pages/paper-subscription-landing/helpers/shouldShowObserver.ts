import * as cookie from 'helpers/storage/cookie';
import { isCode } from 'helpers/urls/url';

const shouldShowObserverCard = () => {
	const isTestUser = !!cookie.get('_test_username');
	return isTestUser || isCode();
};

export default shouldShowObserverCard;
