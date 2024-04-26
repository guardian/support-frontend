import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { Checkout } from './checkout';

const router = createBrowserRouter(
	geoIds
		.map((geoId) => [
			{
				path: `/${geoId}/checkout`,
				element: <Checkout geoId={geoId} />,
			},
			{
				path: `/${geoId}/thank-you`,
				element: <div>Thanks!</div>,
			},
		])
		.flat(),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
