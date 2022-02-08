// ----- Imports ----- //
import Content from 'components/content/content';
import Footer from 'components/footerCompliant/Footer';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Heading from 'components/heading/heading';
import Page from 'components/page/page';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	detect,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import 'stylesheets/skeleton/skeleton.scss';
import BreakingHeadlines from './components/breakingHeadlines';
import CtaContribute from './components/ctaContribute';
import CtaSubscribe from './components/ctaSubscribe';
import Hero from './components/hero';
import NoOneEdits from './components/noOneEdits';
import OtherProducts from './components/otherProducts';
import WhySupportMatters from './components/whySupportMatters';
import './showcase.scss';
// ----- Internationalisation ----- //
const countryGroupId: CountryGroupId = detect();
const CountrySwitcherHeader = headerWithCountrySwitcherContainer({
	path: '/support',
	countryGroupId,
	listOfCountryGroups: [
		GBPCountries,
		UnitedStates,
		AUDCountries,
		EURCountries,
		NZDCountries,
		Canada,
		International,
	],
});

// ----- Render ----- //
const ShowcasePage = () => (
	<Page header={<CountrySwitcherHeader />} footer={<Footer />}>
		<Hero countryGroupId={countryGroupId} />
		<WhySupportMatters />
		<BreakingHeadlines />
		<NoOneEdits />
		<Content id="support">
			<Heading size={2} className="anchor">
				Ways you can support the Guardian
			</Heading>
		</Content>
		<CtaSubscribe />
		<CtaContribute />
		{countryGroupId === 'GBPCountries' && <OtherProducts />}
	</Page>
);

setUpTrackingAndConsents();
const content = <ShowcasePage />;
renderPage(content, 'showcase-landing-page');
export { content };
