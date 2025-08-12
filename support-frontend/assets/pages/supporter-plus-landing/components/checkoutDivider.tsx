import { css } from '@emotion/react';
import { palette, space, until } from '@guardian/source/foundations';
import { Divider } from '@guardian/source-development-kitchen/react-components';
import type { FinePrintTheme } from './finePrint';

const looseSpacing = css`
	margin: ${space[8]}px 0 ${space[6]}px;
`;

const tightSpacing = css`
	margin: ${space[4]}px 0;
`;

const lightColour = css`
	${until.tablet} {
		background-color: ${palette.brand[600]};
	}
`;

const divider = (spacing: DividerSpacing, theme: FinePrintTheme) => css`
	max-width: 100%;
	${spacing === 'tight' ? tightSpacing : looseSpacing};
	${theme === 'light' ? lightColour : ''};
`;

type DividerSpacing = 'loose' | 'tight';

type CheckoutDividerProps = {
	spacing: DividerSpacing;
	mobileTheme?: FinePrintTheme;
};

export function CheckoutDivider({
	spacing,
	mobileTheme = 'dark',
}: CheckoutDividerProps): JSX.Element {
	return <Divider size="full" cssOverrides={divider(spacing, mobileTheme)} />;
}
