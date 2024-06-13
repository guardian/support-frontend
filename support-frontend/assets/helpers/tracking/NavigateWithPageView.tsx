import { Navigate } from 'react-router-dom';
import type { Participations } from 'helpers/abTests/abtest';
import {
	getPageViewId,
	pageView,
	setReferrerDataInLocalStorage,
	trackAbTests,
} from './ophan';

type NavigateWithPageViewProps = {
	destination: string;
	participations?: Participations;
};

function NavigateWithPageView({
	destination,
	participations,
}: NavigateWithPageViewProps) {
	const referrerUrl = document.location.href;

	const refererData = {
		referrerUrl,
		referrerPageviewId: getPageViewId(),
	};

	// store referer data to be read and transmitted on manual pageView
	setReferrerDataInLocalStorage(refererData);

	// manual pageView
	pageView(
		`${document.location.origin}${destination}}`,
		document.location.href,
	);

	if (participations) {
		trackAbTests(participations);
	}

	return <Navigate to={destination} replace />;
}

export { NavigateWithPageView };
