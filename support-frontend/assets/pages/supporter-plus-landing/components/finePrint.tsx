import { css } from '@emotion/react';
import { neutral, textSans, until } from '@guardian/source-foundations';

const textStyles = (theme: FinePrintTheme, size: FinePrintSize) => css`
	${textSans[size]({ lineHeight: 'regular' })};
	color: #606060;

	${until.tablet} {
		color: ${theme === 'dark' ? '#606060' : neutral[100]};
	}
`;

export type FinePrintTheme = 'dark' | 'light';

type FinePrintSize = 'xsmall' | 'xxsmall';

type FinePrintProps = {
	mobileTheme: FinePrintTheme;
	size?: FinePrintSize;
	children: React.ReactNode;
};

export function FinePrint({
	mobileTheme,
	size = 'xxsmall',
	children,
}: FinePrintProps): JSX.Element {
	return <div css={textStyles(mobileTheme, size)}>{children}</div>;
}
