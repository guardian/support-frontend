/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Container } from '@guardian/src-layout';
import FullWidthContainer from '../../components/containers/fullWidthContainer';
import Block from '../../components/page/block';
import Header from '../../components/Header';
import SupportFooter from '../../components/Footer';

import WeeklyHero, { WeeklyHeroProps } from './components/WeeklyHero';
import Benefits from './components/content/benefits';

export type WeeklyLandingProps = {
    hero: WeeklyHeroProps;
};

export default function WeeklyLandingPage(props: WeeklyLandingProps): React.ReactElement {
    return (
        <div>
            <Header />
            <WeeklyHero {...props.hero} />
            <FullWidthContainer>
                <Container>
                    <Block>
                        <Benefits />
                    </Block>
                </Container>
            </FullWidthContainer>
            <FullWidthContainer theme="dark" hasOverlap>
                <Container>how are you?</Container>
            </FullWidthContainer>
            <FullWidthContainer theme="white">
                <Container>i&apos;m fine</Container>
            </FullWidthContainer>
            <SupportFooter />
        </div>
    );
}
