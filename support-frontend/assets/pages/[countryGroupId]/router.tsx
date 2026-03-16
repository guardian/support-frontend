import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	useRouteLoaderData,
} from 'react-router-dom';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { ObserverHoldingContent } from 'components/serverSideRendered/observerHoldingContent';
import { getStudentLandingPageTestConfig } from 'helpers/abTests/studentLandingPageAbTests';
import { WithCoreWebVitals } from 'helpers/coreWebVitals/withCoreWebVitals';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { isObserverSubdomain } from 'helpers/globalsAndSwitches/observer';
import type { OneTimeCheckoutVariant } from 'helpers/globalsAndSwitches/oneTimeCheckoutSettings';
import type { StudentLandingPageVariant } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import { parseAppConfig } from 'helpers/globalsAndSwitches/window';
import {
	getAbParticipations,
	setUpConsent,
	setUpTracking,
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
const appConfig = parseAppConfig(window.guardian);

interface LoaderData {
	finalParticipations: Participations;
	landing: PageParticipationsResult<LandingPageVariant>;
	oneTime: PageParticipationsResult<OneTimeCheckoutVariant>;
	studentLanding: PageParticipationsResult<StudentLandingPageVariant>;
}

async function rootLoader(): Promise<LoaderData> {
	void setUpConsent();

	const [landing, oneTime, studentLanding] = await Promise.all([
		getPageParticipations<LandingPageVariant>(getLandingPageTestConfig()),
		getPageParticipations<OneTimeCheckoutVariant>(
			getOneTimeCheckoutTestConfig(),
		),
		getPageParticipations<StudentLandingPageVariant>(
			getStudentLandingPageTestConfig(),
		),
	]);
	const finalParticipations: Participations = {
		...getAbParticipations(),
		...landing.participations,
		...checkoutNudgeSettings?.participations,
		...oneTime.participations,
		...studentLanding.participations,
	};
	// Setup tracking (non-blocking)
	setUpTracking(finalParticipations);
	return { landing, oneTime, studentLanding, finalParticipations };
}

function useRootLoaderData(): LoaderData {
	return useRouteLoaderData('root') as LoaderData;
}

function RootLayout() {
	return (
		<WithCoreWebVitals>
			<Outlet />
		</WithCoreWebVitals>
	);
}

const router = createBrowserRouter([
	{
		id: 'root',
		loader: rootLoader,
		element: <RootLayout />,
		HydrateFallback: GuardianOrObserverHoldingContent,
		children: [
			...Object.values(SupportRegionId).flatMap((supportRegionId) => [
				{
					path: `/${supportRegionId}/contribute/:campaignCode?`,
					lazy: async () => {
						const { LandingPage } = await import(
							/* webpackChunkName: "LandingPage" */ './landingPage'
						);
						return {
							Component: function LandingPageRoute() {
								const { finalParticipations, landing } = useRootLoaderData();
								return (
									<LandingPage
										supportRegionId={supportRegionId}
										abParticipations={finalParticipations}
										landingPageSettings={landing.variant}
									/>
								);
							},
						};
					},
				},
				{
					path: `/${supportRegionId}/checkout`,
					lazy: async () => {
						const { Checkout } = await import(
							/* webpackChunkName: "checkout" */ './checkout'
						);
						return {
							Component: function CheckoutRoute() {
								const { finalParticipations, landing } = useRootLoaderData();
								return (
									<Checkout
										supportRegionId={supportRegionId}
										appConfig={appConfig}
										abParticipations={finalParticipations}
										landingPageSettings={landing.variant}
										nudgeSettings={checkoutNudgeSettings}
									/>
								);
							},
						};
					},
				},
				{
					path: `/${supportRegionId}/one-time-checkout`,
					lazy: async () => {
						const { OneTimeCheckout } = await import(
							/* webpackChunkName: "oneTimeCheckout" */ './oneTimeCheckout'
						);
						return {
							Component: function OneTimeCheckoutRoute() {
								const { finalParticipations, landing, oneTime } =
									useRootLoaderData();
								return (
									<OneTimeCheckout
										supportRegionId={supportRegionId}
										appConfig={appConfig}
										abParticipations={finalParticipations}
										nudgeSettings={checkoutNudgeSettings}
										landingPageSettings={landing.variant}
										oneTimeCheckoutSettings={oneTime.variant}
									/>
								);
							},
						};
					},
				},
				{
					path: `/${supportRegionId}/thank-you`,
					lazy: async () => {
						const { ThankYou } = await import(
							/* webpackChunkName: "ThankYou" */ './thankYou'
						);
						return {
							Component: function ThankYouRoute() {
								const { finalParticipations, landing } = useRootLoaderData();
								return (
									<ThankYou
										supportRegionId={supportRegionId}
										appConfig={appConfig}
										abParticipations={finalParticipations}
										landingPageSettings={landing.variant}
									/>
								);
							},
						};
					},
				},
				{
					path: `/${supportRegionId}/guardian-ad-lite`,
					lazy: async () => {
						const { GuardianAdLiteLanding } = await import(
							/* webpackChunkName: "GuardianAdLiteLanding" */ './guardianAdLiteLanding/guardianAdLiteLanding'
						);
						return {
							Component: function GuardianAdLiteRoute() {
								return (
									<GuardianAdLiteLanding supportRegionId={supportRegionId} />
								);
							},
						};
					},
				},
				{
					path: `/${supportRegionId}/student`,
					lazy: async () => {
						const { StudentLandingPageGlobalContainer } = await import(
							/* webpackChunkName: "StudentLandingPageGlobalContainer" */ './student/StudentLandingPageGlobalContainer'
						);
						return {
							Component: function StudentRoute() {
								const { landing } = useRootLoaderData();
								return (
									<StudentLandingPageGlobalContainer
										supportRegionId={supportRegionId}
										landingPageVariant={landing.variant}
									/>
								);
							},
						};
					},
				},
				{
					path: `/${supportRegionId}/student/:institution`,
					lazy: async () => {
						const { StudentLandingPageInstitutionContainer } = await import(
							/* webpackChunkName: "StudentLandingPageInstitutionContainer" */ './student/StudentLandingPageInstitutionContainer'
						);
						return {
							Component: function StudentRoute() {
								const { landing, studentLanding } = useRootLoaderData();
								console.log(studentLanding.variant.institution.acronym);
								return (
									<StudentLandingPageInstitutionContainer
										supportRegionId={supportRegionId}
										landingPageVariant={landing.variant}
										studentLandingPageVariant={studentLanding.variant}
									/>
								);
							},
						};
					},
				},
			]),
			{
				path: `/au/student/UTS`,
				lazy: async () => {
					const { StudentLandingPageUTSContainer } = await import(
						/* webpackChunkName: "StudentLandingPageUTSContainer" */ './student/StudentLandingPageUTSContainer'
					);
					return {
						Component: function StudentUTSRoute() {
							const { landing } = useRootLoaderData();
							return (
								<StudentLandingPageUTSContainer
									landingPageVariant={landing.variant}
								/>
							);
						},
					};
				},
			},
		],
	},
]);

function GuardianOrObserverHoldingContent() {
	if (isObserverSubdomain()) {
		return <ObserverHoldingContent />;
	}

	return <GuardianHoldingContent />;
}

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
