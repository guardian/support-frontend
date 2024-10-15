import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral, textSans12, until } from '@guardian/source/foundations';

const textStyles = (theme: FinePrintTheme) => css`
	${textSans12};
	color: #606060;

	${until.tablet} {
		color: ${theme === 'dark' ? '#606060' : neutral[100]};
	}
`;

export type FinePrintTheme = 'dark' | 'light';

type FinePrintProps = {
	mobileTheme: FinePrintTheme;
	cssOverrides?: SerializedStyles;
	children: React.ReactNode;
};

export function FinePrint({
	mobileTheme,
	cssOverrides,
	children,
}: FinePrintProps): JSX.Element {
	return <div css={[textStyles(mobileTheme), cssOverrides]}>{children}</div>;
}
