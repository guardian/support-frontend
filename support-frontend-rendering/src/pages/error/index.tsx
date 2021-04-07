/** @jsx jsx */
import { jsx, css, ThemeProvider } from '@emotion/react';
import parse from 'html-react-parser';
import { Container } from '@guardian/src-layout';
import { Footer } from '@guardian/src-footer';
import { LinkButton, buttonReaderRevenue } from '@guardian/src-button';
import { brand, brandAlt, neutral, space } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';
import SvgSquares from './components/SvgSquares';
import { SvgArrowRightStraight } from '@guardian/src-icons';

export type ErrorProps = {
    errorCode: string;
    subHeading: string;
    copy: string;
    reportLink?: boolean;
};

const squaresIntro = css`
    position: relative;
    background-color: ${neutral[97]};
`;

const headingsSection = css`
    position: relative;
    padding-bottom: 12%;
    padding-top: ${space[4]}px;
    z-index: 2;
    margin-left: 10%;
`;

const headingStyles = css`
    ${headline.xlarge({ fontWeight: 'bold' })};
    background-color: ${brandAlt[400]};
    display: inline-block;
    margin: 0;
    margin-bottom: ${space[5]}px;
`;

const subHeadingStyles = css`
    max-width: 400px;
    ${headline.large({ fontWeight: 'bold' })};
    margin: 0;
`;

const copySection = css`
    position: relative;
    z-index: 3;
    background-color: ${neutral[100]};
    padding: ${space[5]}px;
`;

const copyStyles = css`
    margin: 0;
    margin-left: 10%;
    margin-bottom: ${space[4]}px;
    ${headline.xsmall()};

    a {
        color: inherit;
    }
`;

const buttons = css`
    margin-left: 10%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    a {
        margin-bottom: ${space[4]}px;
    }
`;

export default function ErrorPage({ errorCode, subHeading, copy }: ErrorProps): React.ReactElement {
    return (
        <div>
            <div
                css={css`
                    background-color: ${brand[400]};
                    height: 200px;
                `}
            ></div>
            <div css={squaresIntro}>
                <SvgSquares />
                <Container>
                    <section css={headingsSection}>
                        <h1 css={headingStyles}>Error {errorCode}</h1>
                        <h2 css={subHeadingStyles}>{subHeading}</h2>
                    </section>
                </Container>
            </div>
            <div css={copySection}>
                <Container>
                    <p css={copyStyles}>{parse(copy)}</p>
                    <div css={buttons}>
                        <ThemeProvider theme={buttonReaderRevenue}>
                            <LinkButton
                                iconSide="right"
                                priority="primary"
                                size="default"
                                icon={<SvgArrowRightStraight />}
                                nudgeIcon={true}
                                href="https://support.thegulocal.com"
                            >
                                Support The Guardian
                            </LinkButton>
                            <LinkButton
                                iconSide="right"
                                priority="tertiary"
                                size="default"
                                icon={<SvgArrowRightStraight />}
                                nudgeIcon={true}
                                href="https://theguardian.com"
                            >
                                Go to The Guardian homepage
                            </LinkButton>
                        </ThemeProvider>
                    </div>
                </Container>
            </div>
            <section
                css={css`
                    position: relative;
                    z-index: 4;
                    background-color: ${brand[400]};
                    padding-top: ${space[4]}px;
                `}
            >
                <Container>
                    <Footer showBackToTop />
                </Container>
            </section>
        </div>
    );
}

ErrorPage.defaultProps = {
    reportLink: false,
};
