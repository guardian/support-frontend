/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Container } from '@guardian/src-layout';
import FullWidthContainer from '../../components/containers/fullWidthContainer';
import Block from '../../components/page/block';
import Header from '../../components/Header';
import SupportFooter from '../../components/Footer';
import GiftNonGiftCta from '../../components/product/giftNonGiftCta';

import WeeklyHero, { WeeklyHeroProps } from './components/WeeklyHero';
import Benefits from './components/content/benefits';
import Prices from './components/content/prices';
import { CountryCode } from './helpers/internationalisation';
import getProductPrices, { ProductPrices } from './helpers/getProductPrices';

export type WeeklyLandingProps = {
    hero: WeeklyHeroProps;
    prices: ProductPrices;
    countryCode: CountryCode;
};

export default function WeeklyLandingPage({
    hero,
    prices,
    countryCode,
}: WeeklyLandingProps): React.ReactElement {
    return (
        <div>
            <Header />
            <WeeklyHero {...hero} />
            <FullWidthContainer>
                <Container>
                    <Block>
                        <Benefits />
                    </Block>
                </Container>
            </FullWidthContainer>
            <FullWidthContainer theme="dark" hasOverlap>
                <Container>
                    {countryCode && prices && (
                        <Prices products={getProductPrices(prices, countryCode)} />
                    )}
                </Container>
            </FullWidthContainer>
            <FullWidthContainer theme="white">
                <Container>
                    <GiftNonGiftCta product="Guardian Weekly" orderIsAGift={false} href="/" />
                </Container>
            </FullWidthContainer>
            <SupportFooter />
        </div>
    );
}
