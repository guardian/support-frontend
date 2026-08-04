import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { getUser } from 'helpers/user/user';
import type { SupportRegionSwitcherProps } from '../../../components/supportRegionSwitcher/supportRegionSwitcher';
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
	const countrySwitcherProps: SupportRegionSwitcherProps = {
		supportRegionIds: ['uk'],
		selectedSupportRegion: supportRegionId,
		subPath: '/guardian-ad-lite',
	}; // hidden initially, will display with more regions

	/* Return Address loading order:-
	 * 1. URLSearchParams (SessionStorage write)
	 * 2. SessionStorage load
	 * 3. Default https://www.theguardian.com
	 */
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
			/>
			<PosterComponent />
			<AccordionFAQ faqItems={adLiteFAQs} />
		</LandingPageLayout>
	);
}
