import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	useRouteLoaderData,
} from 'react-router-dom';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { WithCoreWebVitals } from 'helpers/coreWebVitals/withCoreWebVitals';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
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
const appConfig = parseAppConfig(window.guardian);

const paths = {
	contribute: '/contribute',
	checkout: '/checkout',
	oneTimeCheckout: '/one-time-checkout',
	thankYou: '/thank-you',
	guardianAdLite: '/guardian-ad-lite',
	student: '/student',
	studentUTS: '/student/UTS',
} as const;

interface LoaderData {
	finalParticipations: Participations;
	landing: PageParticipationsResult<LandingPageVariant>;
	oneTime: PageParticipationsResult<OneTimeCheckoutVariant>;
}

async function rootLoader(): Promise<LoaderData> {
	const [landing, oneTime] = await Promise.all([
		getPageParticipations<LandingPageVariant>(getLandingPageTestConfig()),
		getPageParticipations<OneTimeCheckoutVariant>(
			getOneTimeCheckoutTestConfig(),
		),
	]);
	const finalParticipations: Participations = {
		...getAbParticipations(),
		...landing.participations,
		...checkoutNudgeSettings?.participations,
		...oneTime.participations,
	};
	setUpTrackingAndConsents(finalParticipations);
	return { landing, oneTime, finalParticipations };
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
		children: [
			...Object.values(SupportRegionId).flatMap((supportRegionId) => [
				{
					path: `/${supportRegionId}${paths.contribute}/:campaignCode?`,
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
					path: `/${supportRegionId}${paths.checkout}`,
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
					path: `/${supportRegionId}${paths.oneTimeCheckout}`,
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
					path: `/${supportRegionId}${paths.thankYou}`,
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
					path: `/${supportRegionId}${paths.guardianAdLite}`,
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
					path: `/${supportRegionId}${paths.student}`,
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
			]),
			{
				path: `/au${paths.studentUTS}`,
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

function Router() {
	return (
		<RouterProvider
			router={router}
			fallbackElement={<GuardianHoldingContent />}
		/>
	);
}

export default renderPage(<Router />);
