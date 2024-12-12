import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

console.log('ghLazyRouter');

const router = () => {
	return (
		<BrowserRouter>
			<Suspense fallback={<HoldingContent />}>
				<Routes>
					{geoIds.map((geoId) => (
						<>
							<Route
								path={`/${geoId}/checkout`}
								element={<Checkout geoId={geoId} appConfig={appConfig} />}
							/>
							<Route
								path={`/${geoId}/one-time-checkout`}
								element={
									<OneTimeCheckout geoId={geoId} appConfig={appConfig} />
								}
							/>
							<Route
								path={`/${geoId}/thank-you`}
								element={<ThankYou geoId={geoId} appConfig={appConfig} />}
							/>
							<Route
								path={`/${geoId}/guardian-light`}
								element={<GuardianLightLanding geoId={geoId} />}
							/>
						</>
					))}
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
};

renderPage(router());
