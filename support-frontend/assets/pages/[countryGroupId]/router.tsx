import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';

setUpTrackingAndConsents();

const LazyCheckout = lazy(() => import('./checkout'));
const LazyThankYou = lazy(() => import('./thank-you'));
function Loading() {
	return <div>Loading...</div>;
}

const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/checkout`,
			element: <LazyCheckout geoId={geoId} />,
		},
		{
			path: `/${geoId}/thank-you`,
			element: <LazyThankYou geoId={geoId} />,
		},
	]),
);

function Router() {
	return (
		<Suspense fallback={<Loading />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}

export default renderPage(<Router />);
