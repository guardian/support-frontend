import ophan from 'ophan';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as abTest from 'helpers/abTests/abtest';
import { Country, CountryGroup } from 'helpers/internationalisation';
import { renderPage } from 'helpers/rendering/render';
import { trackAbTests } from 'helpers/tracking/ophan';
import { i18nIds } from 'pages/i18nConfig';
import { Events } from './events';

const countryId = Country.detect();
const countryGroupId = CountryGroup.detect();
const participations = abTest.init({
	countryId,
	countryGroupId,
});
ophan.init();
trackAbTests(participations);

const router = createBrowserRouter(
	i18nIds.flatMap((i18nId) => [
		{
			path: `/${i18nId}/events`,
			element: <Events />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
