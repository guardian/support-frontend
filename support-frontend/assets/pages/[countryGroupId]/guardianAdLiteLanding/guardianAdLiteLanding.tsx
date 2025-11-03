import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { getFeatureFlags } from 'helpers/featureFlags';
import { getUser } from 'helpers/user/user';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import {
	getReturnAddress,
	setReturnAddress,
} from '../checkout/helpers/sessionStorage';
import { AccordionFAQ } from '../components/accordionFAQ';
import { LandingPageLayout } from '../components/landingPageLayout';
import { HeaderCards } from './components/headerCards';
import { PosterComponent } from './components/posterComponent';
import { adLiteFAQs } from './helpers/adLiteFAQs';

type GuardianAdLiteLandingProps = {
	supportRegionId: SupportRegionId;
};

export function GuardianAdLiteLanding({
	supportRegionId,
}: GuardianAdLiteLandingProps): JSX.Element {
	const user = getUser();
	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries],
		selectedCountryGroup: countryGroupId,
		subPath: '/guardian-ad-lite',
	}; // hidden initially, will display with more regions

	/* Return Address loading order:-
	 * 1. URLSearchParams (SessionStorage write)
	 * 2. SessionStorage load
	 * 3. Default https://www.theguardian.com
	 */
	const featureFlags = getFeatureFlags();
	const urlSearchParams = new URLSearchParams(window.location.search);
	const urlSearchParamsReturn = urlSearchParams.get('returnAddress');
	if (urlSearchParamsReturn) {
		setReturnAddress({ link: urlSearchParamsReturn });
	}
	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			<HeaderCards
				supportRegionId={supportRegionId}
				returnLink={getReturnAddress()} // defaults to urlSearchParamsReturn if available
				isSignedIn={user.isSignedIn}
				featureFlags={featureFlags}
			/>
			<PosterComponent />
			<AccordionFAQ faqItems={adLiteFAQs} />
		</LandingPageLayout>
	);
}
