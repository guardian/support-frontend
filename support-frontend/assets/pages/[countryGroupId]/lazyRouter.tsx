import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HoldingContent } from 'components/serverSideRendered/holdingContent';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';

setUpTrackingAndConsents();
const appConfig = parseAppConfig(window.guardian);

const Checkout = lazy(() => import('./checkout'));
const OneTimeCheckout = lazy(() => import('./oneTimeCheckout'));
const ThankYou = lazy(() => import('./thankYou'));
const GuardianLightLanding = lazy(
	() => import('./guardianLightLanding/guardianLightLanding'),
);
console.log('LazyRouter');

const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/checkout`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<Checkout geoId={geoId} appConfig={appConfig} />
				</Suspense>
			),
		},
		{
			path: `/${geoId}/one-time-checkout`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<OneTimeCheckout geoId={geoId} appConfig={appConfig} />
				</Suspense>
			),
		},
		{
			path: `/${geoId}/thank-you`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<ThankYou geoId={geoId} appConfig={appConfig} />
				</Suspense>
			),
		},
		{
			path: `/${geoId}/guardian-light`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<GuardianLightLanding geoId={geoId} />
				</Suspense>
			),
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
