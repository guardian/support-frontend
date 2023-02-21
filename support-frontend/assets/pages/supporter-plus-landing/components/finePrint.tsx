import { css } from '@emotion/react';
import { neutral, textSans, until } from '@guardian/source-foundations';

const textStyles = (theme: FinePrintTheme) => css`
	${textSans.xxsmall({ lineHeight: 'regular' })};
	color: #606060;

	${until.tablet} {
		color: ${theme === 'dark' ? '#606060' : neutral[100]};
	}
`;

export type FinePrintTheme = 'dark' | 'light';

type FinePrintProps = {
	mobileTheme: FinePrintTheme;
	children: React.ReactNode;
};

export function FinePrint({
	mobileTheme,
	children,
}: FinePrintProps): JSX.Element {
	return <div css={textStyles(mobileTheme)}>{children}</div>;
}
