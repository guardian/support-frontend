/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { Footer } from '@guardian/src-footer';
import { brand, space } from '@guardian/src-foundations';
import { Container } from '@guardian/src-layout';

export default function SupportFooter(): React.ReactElement {
    return (
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
    );
}
