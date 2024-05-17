import ophan from 'ophan';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Events } from './events';

ophan.init();
const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/events`,
			element: <Events />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
