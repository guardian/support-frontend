import ophan from 'ophan';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as abTest from 'helpers/abTests/abtest';
import { Country, CountryGroup } from 'helpers/internationalisation';
import { renderPage } from 'helpers/rendering/render';
import { trackAbTests } from 'helpers/tracking/ophan';
import { geoIds } from 'pages/geoIdConfig';
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
	geoIds.flatMap((geoId) => [
		{
			path: `/${geoId}/events`,
			element: <Events />,
		},
	]),
);

function Router() {
	return <RouterProvider router={router} />;
}

export default renderPage(<Router />);
