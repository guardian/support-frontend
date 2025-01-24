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

const Checkout = lazy(() => {
	return import(/* webpackChunkName: "checkout" */ './checkout').then((mod) => {
		return { default: mod.Checkout };
	});
});
const OneTimeCheckout = lazy(() => {
	return import(
		/* webpackChunkName: "oneTimeCheckout" */ './oneTimeCheckout'
	).then((mod) => {
		return { default: mod.OneTimeCheckout };
	});
});
const ThankYou = lazy(() => {
	return import(/* webpackChunkName: "ThankYou" */ './thankYou').then((mod) => {
		return { default: mod.ThankYou };
	});
});
const GuardianAdLiteLanding = lazy(() => {
	return import(
		/* webpackChunkName: "GuardianAdLiteLanding" */ './guardianAdLiteLanding/guardianAdLiteLanding'
	).then((mod) => {
		return { default: mod.GuardianAdLiteLanding };
	});
});

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
