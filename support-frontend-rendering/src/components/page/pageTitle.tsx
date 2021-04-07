/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/react';
import { from } from '@guardian/src-foundations/mq';
import { brand, brandAlt, neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { titlepiece } from '@guardian/src-foundations/typography';
import { Container } from '@guardian/src-layout';

const guardianWeeklyBlue = '#66c2e9';
const paperSubscriptionsBlue = '#90DCFF';

type ThemeType = 'showcase' | 'digital' | 'weekly' | 'paper';

type PropTypes = {
    title: string;
    theme: ThemeType;
    cssOverrides?: string;
    children: React.ReactChild;
};

const themeColors: { [key in ThemeType]: string } = {
    weekly: guardianWeeklyBlue,
    digital: brand[300],
    showcase: brandAlt[400],
    paper: paperSubscriptionsBlue,
};

const headerThemes: { [key in ThemeType]: SerializedStyles } = {
    weekly: css`
        :before {
            background-color: ${themeColors.weekly};
        }
    `,
    digital: css`
        color: ${neutral[97]};
        :before {
            background-color: ${themeColors.digital};
        }
    `,
    showcase: css`
        :before {
            background-color: ${themeColors.showcase};
        }
    `,
    paper: css`
        :before {
            background-color: ${themeColors.paper};
        }
    `,
};

const header = css`
    color: ${neutral[7]};
    position: relative;
    background-color: ${neutral[93]};
    display: flex;
    flex-direction: column;

    :before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
    }

    ${from.desktop} {
        :before {
            height: 370px;
        }
    }
`;

export const pageTitle = css`
    position: relative;
    ${titlepiece.small({ fontWeight: 'bold' })};
    z-index: 10;
    padding: ${space[9]}px ${space[4]}px;
    width: 100%;

    ${from.phablet} {
        width: 100%;
        align-self: center;
    }

    ${from.desktop} {
        ${titlepiece.large({ fontWeight: 'bold' })}
        margin: 0 auto;
        max-width: 1290px;
    }
`;

function PageTitle({ title, theme, cssOverrides, children }: PropTypes): React.ReactElement {
    return (
        <div css={[header, headerThemes[theme], cssOverrides]}>
            <Container>
                <h1 css={pageTitle}>{title}</h1>
            </Container>
            {children}
        </div>
    );
}

PageTitle.defaultProps = {
    cssOverrides: '',
};

export default PageTitle;
