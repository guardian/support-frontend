import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import { i18nIds } from 'pages/i18nConfig';
import { Checkout } from './checkout';
import { ThankYou } from './thank-you';

setUpTrackingAndConsents();

const router = createBrowserRouter(
	i18nIds.flatMap((i18nId) => [
		{
			path: `/${i18nId}/checkout`,
			element: <Checkout i18nId={i18nId} />,
		},
		{
			path: `/${i18nId}/thank-you`,
			element: <ThankYou i18nId={i18nId} />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
