import * as ophan from 'ophan';
import { Navigate } from 'react-router-dom';
import type { Participations } from 'helpers/abTests/abtest';
import { getAbsoluteURL } from 'helpers/urls/url';
import { pageView, setReferrerDataInLocalStorage, trackAbTests } from './ophan';

type NavigateWithPageViewProps = {
	destination: string;
	participations?: Participations;
};

function NavigateWithPageView({
	destination,
	participations,
}: NavigateWithPageViewProps) {
	const refererData = {
		referrerUrl: document.location.href,
		referrerPageviewId: ophan.viewId,
	};

	// store referer data to be read and transmitted on manual pageView
	setReferrerDataInLocalStorage(refererData);

	// manual pageView
	pageView(document.location.href, getAbsoluteURL(destination));

	if (participations) {
		trackAbTests(participations);
	}

	return <Navigate to={destination} replace />;
}

export { NavigateWithPageView };
