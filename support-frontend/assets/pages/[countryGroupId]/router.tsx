import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { lazy, Suspense, useMemo, useRef } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { ObserverHoldingContent } from 'components/serverSideRendered/observerHoldingContent';
import { WithCoreWebVitals } from 'helpers/coreWebVitals/withCoreWebVitals';
import { AnalyticsProfileCacheProvider } from 'helpers/customHooks/analyticsProfileCache';
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
import { getPageParticipations } from '../../helpers/abTests/pageParticipations';
import { useMparticleAudienceCheck } from '../../helpers/abTests/useMparticleAudienceCheck';

const syncLandingPageParticipations = getPageParticipations<LandingPageVariant>(
	getLandingPageTestConfig(),
);
const checkoutNudgeSettings = getCheckoutNudgeParticipations();
const oneTimeCheckoutSettings = getPageParticipations<OneTimeCheckoutVariant>(
	getOneTimeCheckoutTestConfig(),
);

const abParticipations = getAbParticipations();
const makeAbParticipations = (landingPageParticipations?: Participations) => ({
	...abParticipations,
	...(landingPageParticipations ??
		syncLandingPageParticipations.participations),
	...checkoutNudgeSettings?.participations,
	...oneTimeCheckoutSettings.participations,
});

const syncAbParticipations = makeAbParticipations();
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
							oneTimeCheckoutSettings={oneTimeCheckoutSettings.variant}
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
 * Top-level component that resolves mParticle audience checks
 * before finalizing test participations and tracking.
 *
 * This ensures:
 * 1. Tracking fires with the correct participations (after audience check)
 * 2. All routes receive the same resolved variant
 */
function AppWithAudienceCheck() {
	const hasTracked = useRef(false);

	// Find tests the user is participating in that have mParticleAudience
	const testsWithAudience = useMemo(
		() =>
			(window.guardian.settings.landingPageTests ?? []).filter(
				(test) =>
					syncLandingPageParticipations.participations[test.name] !==
						undefined && test.mParticleAudience !== undefined,
			),
		[],
	);

	// Async audience check — returns null while loading, undefined if no match, or the matched test
	const { matchedTest } = useMparticleAudienceCheck(testsWithAudience);

	// Still checking audiences — show loading
	if (matchedTest === null) {
		return <GuardianHoldingContent />;
	}

	// Resolve the final variant and participations based on audience check result
	let finalLandingPageSettings: LandingPageVariant =
		syncLandingPageParticipations.variant;
	let finalAbParticipations: Participations = syncAbParticipations;

	if (matchedTest !== undefined) {
		// User is in an audience — use the matched test's variant
		const matchedVariant = matchedTest.variants.find(
			(v) =>
				v.name ===
				syncLandingPageParticipations.participations[matchedTest.name],
		);
		finalLandingPageSettings =
			matchedVariant ?? syncLandingPageParticipations.variant;
		// Rebuild participations with only the matched test
		finalAbParticipations = makeAbParticipations({
			[matchedTest.name]:
				syncLandingPageParticipations.participations[matchedTest.name],
		});
	}

	// Track once with the correct participations
	if (!hasTracked.current) {
		hasTracked.current = true;
		setUpTrackingAndConsents(finalAbParticipations);
	}

	const router = useMemo(
		() => buildRouter(finalAbParticipations, finalLandingPageSettings),
		[finalAbParticipations, finalLandingPageSettings],
	);

	return <RouterProvider router={router} />;
}

function Router() {
	return (
		<WithCoreWebVitals>
			<AnalyticsProfileCacheProvider>
				<AppWithAudienceCheck />
			</AnalyticsProfileCacheProvider>
		</WithCoreWebVitals>
	);
}

export default renderPage(<Router />);
