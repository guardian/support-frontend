import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HoldingContent } from 'components/serverSideRendered/holdingContent';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);
const appConfig = parseAppConfig(window.guardian);

const Checkout = lazy(
	() => import(/* webpackChunkName: "checkout" */ './checkout'),
);
const OneTimeCheckout = lazy(
	() => import(/* webpackChunkName: "oneTimeCheckout" */ './oneTimeCheckout'),
);
const ThankYou = lazy(
	() => import(/* webpackChunkName: "ThankYou" */ './thankYou'),
);
const GuardianAdLiteLanding = lazy(
	() =>
		import(
			/* webpackChunkName: "GuardianAdLiteLanding" */ './guardianAdLiteLanding/guardianAdLiteLanding'
		),
);

const router = createBrowserRouter(
	geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/checkout`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<Checkout
						geoId={geoId}
						appConfig={appConfig}
						abParticipations={abParticipations}
					/>
				</Suspense>
			),
		},
		{
			path: `/${geoId}/one-time-checkout`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<OneTimeCheckout
						geoId={geoId}
						appConfig={appConfig}
						abParticipations={abParticipations}
					/>
				</Suspense>
			),
		},
		{
			path: `/${geoId}/thank-you`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<ThankYou
						geoId={geoId}
						appConfig={appConfig}
						abParticipations={abParticipations}
					/>
				</Suspense>
			),
		},
		{
			path: `/${geoId}/guardian-ad-lite`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<GuardianAdLiteLanding geoId={geoId} />
				</Suspense>
			),
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
