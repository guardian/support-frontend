/** @jsx jsx */
import { jsx } from '@emotion/react';
import FullWidthContainer from '../../components/containers/fullWidthContainer';
import Block from '../../components/page/block';
import Header from '../../components/Header';
import SupportFooter from '../../components/Footer';
import { Container } from '@guardian/src-layout';

// import GiftNonGiftCta from 'components/product/giftNonGiftCta';

// import 'stylesheets/skeleton/skeleton.scss';

// import { WeeklyHero } from './components/hero/hero';
// import Benefits from './components/content/benefits';
// import GiftBenefits from './components/content/giftBenefits';

// import WeeklyPrices from './components/weeklyProductPrices';
// import reducer from './weeklySubscriptionLandingReducer';

// import './weeklySubscriptionLanding.scss';
// import { promoQueryParam, getPromotionCopy } from 'helpers/productPrice/promotions';
// import { promotionTermsUrl } from 'helpers/routes';
// import { getQueryParameter } from 'helpers/url';

// const path = orderIsAGift ? routes.guardianWeeklySubscriptionLandingGift : routes.guardianWeeklySubscriptionLanding;
// const giftNonGiftLink = orderIsAGift ?
//   routes.guardianWeeklySubscriptionLanding : routes.guardianWeeklySubscriptionLandingGift;

// const Header = headerWithCountrySwitcherContainer({
//   path,
//   countryGroupId,
//   listOfCountryGroups: [
//     GBPCountries,
//     UnitedStates,
//     AUDCountries,
//     EURCountries,
//     Canada,
//     NZDCountries,
//     International,
//   ],
//   trackProduct: 'GuardianWeekly',
// });

// ----- Render ----- //

// const { promotionCopy } = store.getState().page;
// const sanitisedPromoCopy = getPromotionCopy(promotionCopy);
// const defaultPromo = orderIsAGift ? 'GW20GIFT1Y' : '10ANNUAL';
// const promoTermsLink = promotionTermsUrl(getQueryParameter(promoQueryParam) || defaultPromo);

// // ID for Selenium tests
// const pageQaId = `qa-guardian-weekly${orderIsAGift ? '-gift' : ''}`;

export default function WeeklyLandingPage(): React.ReactElement {
    return (
        <div>
            <Header />
            <FullWidthContainer>
                <Container>
                    <Block>beep</Block>
                </Container>
            </FullWidthContainer>
            <FullWidthContainer theme="dark" hasOverlap>
                <Container>meep</Container>
            </FullWidthContainer>
            <FullWidthContainer theme="white">
                <Container>hello</Container>
            </FullWidthContainer>
            <SupportFooter />
        </div>
    );
}
