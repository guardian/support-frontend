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

const chunks = {
	contribute: () =>
		import(/* webpackChunkName: "LandingPage" */ './landingPage'),
	oneTimeCheckout: () =>
		import(/* webpackChunkName: "oneTimeCheckout" */ './oneTimeCheckout'),
	checkout: () => import(/* webpackChunkName: "checkout" */ './checkout'),
	thankYou: () => import(/* webpackChunkName: "ThankYou" */ './thankYou'),
	guardianAdLite: () =>
		import(
			/* webpackChunkName: "GuardianAdLiteLanding" */ './guardianAdLiteLanding/guardianAdLiteLanding'
		),
	studentUTS: () =>
		import(
			/* webpackChunkName: "StudentLandingPageUTSContainer" */ './student/StudentLandingPageUTSContainer'
		),
	student: () =>
		import(
			/* webpackChunkName: "StudentLandingPageGlobalContainer" */ './student/StudentLandingPageGlobalContainer'
		),
};

const Checkout = lazy(() =>
	chunks.checkout().then((mod) => ({ default: mod.Checkout })),
);
const OneTimeCheckout = lazy(() =>
	chunks.oneTimeCheckout().then((mod) => ({ default: mod.OneTimeCheckout })),
);
const ThankYou = lazy(() =>
	chunks.thankYou().then((mod) => ({ default: mod.ThankYou })),
);
const GuardianAdLiteLanding = lazy(() =>
	chunks
		.guardianAdLite()
		.then((mod) => ({ default: mod.GuardianAdLiteLanding })),
);
const LandingPage = lazy(() =>
	chunks.contribute().then((mod) => ({ default: mod.LandingPage })),
);
const StudentLandingPageUTSContainer = lazy(() =>
	chunks
		.studentUTS()
		.then((mod) => ({ default: mod.StudentLandingPageUTSContainer })),
);
const StudentLandingPageGlobalContainer = lazy(() =>
	chunks
		.student()
		.then((mod) => ({ default: mod.StudentLandingPageGlobalContainer })),
);
const paths = {
	contribute: '/contribute',
	checkout: '/checkout',
	oneTimeCheckout: '/one-time-checkout',
	thankYou: '/thank-you',
	guardianAdLite: '/guardian-ad-lite',
	student: '/student',
	studentUTS: '/student/UTS',
} as const;

// Most specific paths must come first so e.g. /student/UTS matches before /student
const PRELOAD_CHUNKS: Array<[string, () => Promise<unknown>]> = [
	[paths.studentUTS, chunks.studentUTS],
	[paths.student, chunks.student],
	[paths.contribute, chunks.contribute],
	[paths.oneTimeCheckout, chunks.oneTimeCheckout],
	[paths.checkout, chunks.checkout],
	[paths.thankYou, chunks.thankYou],
	[paths.guardianAdLite, chunks.guardianAdLite],
];

function preloadCurrentPageChunk(): void {
	const path = window.location.pathname;
	const match = PRELOAD_CHUNKS.find(([segment]) => path.includes(segment));
	if (match) {
		const [, chunk] = match;
		void chunk();
	}
}

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
				path: `/${supportRegionId}${paths.contribute}/:campaignCode?`,
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
				path: `/${supportRegionId}${paths.checkout}`,
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
				path: `/${supportRegionId}${paths.oneTimeCheckout}`,
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
				path: `/${supportRegionId}${paths.thankYou}`,
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
				path: `/${supportRegionId}${paths.guardianAdLite}`,
				element: (
					<Suspense fallback={<GuardianHoldingContent />}>
						<GuardianAdLiteLanding supportRegionId={supportRegionId} />
					</Suspense>
				),
			},
			{
				path: `/${supportRegionId}${paths.student}`,
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
			path: `/au${paths.studentUTS}`,
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
		preloadCurrentPageChunk();
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
