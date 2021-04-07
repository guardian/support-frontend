/** @jsx jsx */
import { jsx, css, ThemeProvider } from '@emotion/react';
import parse from 'html-react-parser';
import { LinkButton, buttonBrand } from '@guardian/src-button';
import { SvgArrowDownStraight } from '@guardian/src-icons';
import { Container } from '@guardian/src-layout';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, headline } from '@guardian/src-foundations/typography';

import PageTitle from '../../../components/page/pageTitle';
import Hero from '../../../components/page/hero';

const weeklyHeroCopy = css`
    padding: 0 ${space[3]}px ${space[3]}px;
`;

const weeklyHeroTitle = css`
    ${headline.medium({ fontWeight: 'bold' })};
    margin-top: 0;
    margin-bottom: ${space[3]}px;

    ${from.tablet} {
        ${headline.large({ fontWeight: 'bold' })};
    }
`;

const weeklyHeroParagraph = css`
    ${body.medium({ lineHeight: 'loose' })}

    p {
        margin-bottom: ${space[9]}px;
    }
`;

const roundelStyles = css`
    .center-line {
        ${headline.small({ fontWeight: 'bold' })}
        ${from.tablet} {
            ${headline.large({ fontWeight: 'bold' })}
        }
    }
`;

export type WeeklyHeroProps = {
    title: string;
    roundelText: string;
    subtitle: string;
    copy: string;
    buttonCopy: string;
};

export default function WeeklyHero({
    title,
    roundelText,
    subtitle,
    copy,
    buttonCopy,
}: WeeklyHeroProps): React.ReactElement {
    return (
        <PageTitle title={title} theme="weekly">
            <Container>
                <Hero
                    image={
                        <img
                            className="component-grid-image"
                            sizes="(max-width: 740px) 100%, (max-width: 1067px) 150%, 500px"
                            srcSet="https://media.guim.co.uk/d2baab9f40e198459a02c30d86c774e79096e43e/0_0_1158_954/140.png 140w, https://media.guim.co.uk/d2baab9f40e198459a02c30d86c774e79096e43e/0_0_1158_954/500.png 500w, https://media.guim.co.uk/d2baab9f40e198459a02c30d86c774e79096e43e/0_0_1158_954/1000.png 1000w"
                            src="https://media.guim.co.uk/d2baab9f40e198459a02c30d86c774e79096e43e/0_0_1158_954/500.png"
                            alt="A collection of Guardian Weekly magazines"
                        />
                    }
                    roundelText={
                        <div role="text" css={roundelStyles}>
                            {parse(roundelText)}
                        </div>
                    }
                >
                    <section css={weeklyHeroCopy}>
                        <h2 css={weeklyHeroTitle}>{parse(subtitle)}</h2>
                        <div css={weeklyHeroParagraph}>{parse(copy)}</div>
                        <ThemeProvider theme={buttonBrand}>
                            <LinkButton
                                priority="tertiary"
                                iconSide="right"
                                icon={<SvgArrowDownStraight />}
                                href="#subscribe"
                            >
                                {buttonCopy}
                            </LinkButton>
                        </ThemeProvider>
                    </section>
                </Hero>
            </Container>
        </PageTitle>
    );
}
