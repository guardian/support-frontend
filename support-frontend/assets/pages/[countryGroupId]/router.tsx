import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HoldingContent } from 'components/serverSideRendered/holdingContent';
import { WithCoreWebVitals } from 'helpers/coreWebVitals/withCoreWebVitals';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { geoIds } from 'pages/geoIdConfig';
import { getLandingPageParticipations } from '../../helpers/abTests/landingPageAbTests';

const landingPageParticipations = getLandingPageParticipations();
const abParticipations = {
	...getAbParticipations(),
	...landingPageParticipations.participations,
};
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

const LandingPage = lazy(() => {
	return import(/* webpackChunkName: "LandingPage" */ './landingPage').then(
		(mod) => {
			return { default: mod.LandingPage };
		},
	);
});
const StudentLandingPage = lazy(() => {
	return import(
		/* webpackChunkName: "StudentLandingPage" */ './student/StudentLandingPage'
	).then((mod) => {
		return { default: mod.StudentLandingPage };
	});
});

const router = createBrowserRouter([
	...geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/contribute/:campaignCode?`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<LandingPage
						geoId={geoId}
						abParticipations={abParticipations}
						landingPageSettings={landingPageParticipations.variant}
					/>
				</Suspense>
			),
		},
		{
			path: `/${geoId}/checkout`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<Checkout
						geoId={geoId}
						appConfig={appConfig}
						abParticipations={abParticipations}
						landingPageSettings={landingPageParticipations.variant}
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
						landingPageSettings={landingPageParticipations.variant}
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
		{
			path: `/${geoId}/student`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<StudentLandingPage
						geoId={geoId}
						landingPageVariant={landingPageParticipations.variant}
						global
					/>
				</Suspense>
			),
		},
	]),
	{
		path: '/au/student/UTS',
		element: (
			<Suspense fallback={<HoldingContent />}>
				<StudentLandingPage
					geoId={'au'}
					landingPageVariant={landingPageParticipations.variant}
				/>
			</Suspense>
		),
	},
]);

function Router() {
	return (
		<WithCoreWebVitals>
			<RouterProvider router={router} />
		</WithCoreWebVitals>
	);
}

export default renderPage(<Router />);
