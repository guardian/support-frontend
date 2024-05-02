import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Checkout } from './checkout';
import { ThankYou } from './thank-you';

const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/checkout`,
			element: <Checkout geoId={geoId} />,
		},
		{
			path: `/${geoId}/thank-you`,
			element: <ThankYou geoId={geoId} />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
