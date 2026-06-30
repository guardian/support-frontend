import { supportRegionIds } from '@modules/internationalisation/supportRegion';
import { createBrowserRouter, RouterProvider } from 'react-router';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { Events } from './events';

setUpTrackingAndConsents(getAbParticipations());
const router = createBrowserRouter(
	supportRegionIds.flatMap((supportRegionId) => [
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
