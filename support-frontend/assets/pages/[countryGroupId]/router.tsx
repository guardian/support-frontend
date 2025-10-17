import { SupportRegionId } from '@modules/internationalisation/countryGroup';
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
import { getCheckoutNudgeParticipations } from '../../helpers/abTests/checkoutNudgeAbTests';
import { getLandingPageParticipations } from '../../helpers/abTests/landingPageAbTests';

const landingPageParticipations = getLandingPageParticipations();
const checkoutNudgeSettings = getCheckoutNudgeParticipations();
const abParticipations = {
	...getAbParticipations(),
	...landingPageParticipations.participations,
	...checkoutNudgeSettings?.participations,
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
const StudentLandingPageUTSContainer = lazy(() => {
	return import(
		/* webpackChunkName: "StudentLandingPageUTSContainer" */ './student/StudentLandingPageUTSContainer'
	).then((mod) => {
		return { default: mod.StudentLandingPageUTSContainer };
	});
});
const StudentLandingPageGlobalContainer = lazy(() => {
	return import(
		/* webpackChunkName: "StudentLandingPageGlobalContainer" */ './student/StudentLandingPageGlobalContainer'
	).then((mod) => {
		return { default: mod.StudentLandingPageGlobalContainer };
	});
});

const router = createBrowserRouter([
	...Object.values(SupportRegionId).flatMap((supportRegionId) => [
		{
			path: `/${supportRegionId}/contribute/:campaignCode?`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<LandingPage
						supportRegionId={supportRegionId}
						abParticipations={abParticipations}
						landingPageSettings={landingPageParticipations.variant}
					/>
				</Suspense>
			),
		},
		{
			path: `/${supportRegionId}/checkout`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<Checkout
						supportRegionId={supportRegionId}
						appConfig={appConfig}
						abParticipations={abParticipations}
						landingPageSettings={landingPageParticipations.variant}
						nudgeSettings={checkoutNudgeSettings}
					/>
				</Suspense>
			),
		},
		{
			path: `/${supportRegionId}/one-time-checkout`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<OneTimeCheckout
						supportRegionId={supportRegionId}
						appConfig={appConfig}
						abParticipations={abParticipations}
						nudgeSettings={checkoutNudgeSettings}
					/>
				</Suspense>
			),
		},
		{
			path: `/${supportRegionId}/thank-you`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<ThankYou
						supportRegionId={supportRegionId}
						appConfig={appConfig}
						abParticipations={abParticipations}
						landingPageSettings={landingPageParticipations.variant}
					/>
				</Suspense>
			),
		},
		{
			path: `/${supportRegionId}/guardian-ad-lite`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<GuardianAdLiteLanding supportRegionId={supportRegionId} />
				</Suspense>
			),
		},
		{
			path: `/${supportRegionId}/student`,
			element: (
				<Suspense fallback={<HoldingContent />}>
					<StudentLandingPageGlobalContainer
						supportRegionId={supportRegionId}
						landingPageVariant={landingPageParticipations.variant}
					/>
				</Suspense>
			),
		},
	]),
	{
		path: '/au/student/UTS',
		element: (
			<Suspense fallback={<HoldingContent />}>
				<StudentLandingPageUTSContainer
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
