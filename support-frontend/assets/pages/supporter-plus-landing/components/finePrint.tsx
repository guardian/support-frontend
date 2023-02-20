import { css } from '@emotion/react';
import { neutral, textSans, until } from '@guardian/source-foundations';

const textStyles = (theme: FinePrintTheme) => css`
	${textSans.xxsmall({ lineHeight: 'regular' })};
	color: #606060;

	/* TODO: Added for A/B test supporterPlusMobileTest1, may be removable in future */
	${until.tablet} {
		color: ${theme === 'dark' ? '#606060' : neutral[100]};
	}
`;

export type FinePrintTheme = 'dark' | 'light';

type FinePrintProps = {
	theme: FinePrintTheme;
	children: React.ReactNode;
};

export function FinePrint({ theme, children }: FinePrintProps): JSX.Element {
	return <div css={textStyles(theme)}>{children}</div>;
}
