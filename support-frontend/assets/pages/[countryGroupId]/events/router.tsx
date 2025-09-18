import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { Events } from './events';

setUpTrackingAndConsents(getAbParticipations());
const router = createBrowserRouter(
	Object.values(SupportRegionId).flatMap((supportRegionId) => [
		{
			path: `/${supportRegionId}/events/:eventId`,
			element: <Events supportRegionId={supportRegionId} />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
