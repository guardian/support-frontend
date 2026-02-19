import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { ObserverHoldingContent } from 'components/serverSideRendered/observerHoldingContent';
import { WithCoreWebVitals } from 'helpers/coreWebVitals/withCoreWebVitals';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { isObserverSubdomain } from 'helpers/globalsAndSwitches/observer';
import type { OneTimeCheckoutVariant } from 'helpers/globalsAndSwitches/oneTimeCheckoutSettings';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { getCheckoutNudgeParticipations } from '../../helpers/abTests/checkoutNudgeAbTests';
import { getLandingPageTestConfig } from '../../helpers/abTests/landingPageAbTests';
import type { Participations } from '../../helpers/abTests/models';
import { getOneTimeCheckoutTestConfig } from '../../helpers/abTests/oneTimeCheckoutAbTests';
import {
	getPageParticipations,
	type PageParticipationsResult,
} from '../../helpers/abTests/pageParticipations';

const checkoutNudgeSettings = getCheckoutNudgeParticipations();
const abParticipations = getAbParticipations();
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

function GuardianOrObserverHoldingContent() {
	if (isObserverSubdomain()) {
		return <ObserverHoldingContent />;
	}

	return <GuardianHoldingContent />;
}

function buildRouter(
	abParticipations: Participations,
	landingPageSettings: LandingPageVariant,
	oneTimeCheckoutVariant: OneTimeCheckoutVariant,
) {
	return createBrowserRouter([
		...Object.values(SupportRegionId).flatMap((supportRegionId) => [
			{
				path: `/${supportRegionId}/contribute/:campaignCode?`,
				element: (
					<Suspense fallback={<GuardianHoldingContent />}>
						<LandingPage
							supportRegionId={supportRegionId}
							abParticipations={abParticipations}
							landingPageSettings={landingPageSettings}
						/>
					</Suspense>
				),
			},
			{
				path: `/${supportRegionId}/checkout`,
				element: (
					<Suspense fallback={<GuardianOrObserverHoldingContent />}>
						<Checkout
							supportRegionId={supportRegionId}
							appConfig={appConfig}
							abParticipations={abParticipations}
							landingPageSettings={landingPageSettings}
							nudgeSettings={checkoutNudgeSettings}
						/>
					</Suspense>
				),
			},
			{
				path: `/${supportRegionId}/one-time-checkout`,
				element: (
					<Suspense fallback={<GuardianHoldingContent />}>
						<OneTimeCheckout
							supportRegionId={supportRegionId}
							appConfig={appConfig}
							abParticipations={abParticipations}
							nudgeSettings={checkoutNudgeSettings}
							landingPageSettings={landingPageSettings}
							oneTimeCheckoutSettings={oneTimeCheckoutVariant}
						/>
					</Suspense>
				),
			},
			{
				path: `/${supportRegionId}/thank-you`,
				element: (
					<Suspense fallback={<GuardianOrObserverHoldingContent />}>
						<ThankYou
							supportRegionId={supportRegionId}
							appConfig={appConfig}
							abParticipations={abParticipations}
							landingPageSettings={landingPageSettings}
						/>
					</Suspense>
				),
			},
			{
				path: `/${supportRegionId}/guardian-ad-lite`,
				element: (
					<Suspense fallback={<GuardianHoldingContent />}>
						<GuardianAdLiteLanding supportRegionId={supportRegionId} />
					</Suspense>
				),
			},
			{
				path: `/${supportRegionId}/student`,
				element: (
					<Suspense fallback={<GuardianHoldingContent />}>
						<StudentLandingPageGlobalContainer
							supportRegionId={supportRegionId}
							landingPageVariant={landingPageSettings}
						/>
					</Suspense>
				),
			},
		]),
		{
			path: '/au/student/UTS',
			element: (
				<Suspense fallback={<GuardianHoldingContent />}>
					<StudentLandingPageUTSContainer
						landingPageVariant={landingPageSettings}
					/>
				</Suspense>
			),
		},
	]);
}

/**
 * Top-level component that resolves page participations (including mParticle audience
 * checks) before finalizing test participations and tracking.
 *
 * This ensures:
 * 1. Tracking fires with the correct participations (after audience check)
 * 2. All routes receive the same resolved variant
 */
function AppWithAudienceCheck() {
	const hasTracked = useRef(false);

	const [landingPageResult, setLandingPageResult] =
		useState<PageParticipationsResult<LandingPageVariant> | null>(null);
	const [oneTimeCheckoutResult, setOneTimeCheckoutResult] =
		useState<PageParticipationsResult<OneTimeCheckoutVariant> | null>(null);

	useEffect(() => {
		void Promise.all([
			getPageParticipations<LandingPageVariant>(getLandingPageTestConfig()),
			getPageParticipations<OneTimeCheckoutVariant>(
				getOneTimeCheckoutTestConfig(),
			),
		]).then(([landing, oneTime]) => {
			setLandingPageResult(landing);
			setOneTimeCheckoutResult(oneTime);
		});
	}, []);

	if (!landingPageResult || !oneTimeCheckoutResult) {
		return <GuardianHoldingContent />;
	}

	const finalAbParticipations = useMemo<Participations>(
		() => ({
			...abParticipations,
			...landingPageResult.participations,
			...checkoutNudgeSettings?.participations,
			...oneTimeCheckoutResult.participations,
		}),
		[landingPageResult.participations, oneTimeCheckoutResult.participations],
	);

	// Track once with the correct participations
	if (!hasTracked.current) {
		hasTracked.current = true;
		setUpTrackingAndConsents(finalAbParticipations);
	}

	const router = useMemo(
		() =>
			buildRouter(
				finalAbParticipations,
				landingPageResult.variant,
				oneTimeCheckoutResult.variant,
			),
		[
			finalAbParticipations,
			landingPageResult.variant,
			oneTimeCheckoutResult.variant,
		],
	);

	return <RouterProvider router={router} />;
}

function Router() {
	return (
		<WithCoreWebVitals>
			<AppWithAudienceCheck />
		</WithCoreWebVitals>
	);
}

export default renderPage(<Router />);
