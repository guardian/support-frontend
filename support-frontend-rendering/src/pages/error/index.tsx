/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Container } from '@guardian/src-layout';
import { Footer } from '@guardian/src-footer';
import { css } from '@emotion/react';
import { brand } from '@guardian/src-foundations';

export type ErrorProps = {
    errorCode: string;
    subHeading: string;
    copy: string;
    reportLink?: boolean;
};

// ----- Component ----- //

export default function ErrorPage({ errorCode, subHeading, copy }: ErrorProps): React.ReactElement {
    return (
        <div>
            <Container>
                <h1>Error {errorCode}</h1>
                <h2>{subHeading}</h2>
                <p>{copy}</p>
            </Container>

            <section
                css={css`
                    background-color: ${brand[400]};
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
