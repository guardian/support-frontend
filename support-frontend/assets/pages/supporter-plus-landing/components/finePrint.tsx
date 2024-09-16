import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral, textSans14, until } from '@guardian/source/foundations';

//TODO check this file as some logic has changed

const textStyles = (theme: FinePrintTheme) => css`
	${textSans14};
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
