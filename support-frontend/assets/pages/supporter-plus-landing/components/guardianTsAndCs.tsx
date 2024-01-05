import { css } from '@emotion/react';
import { from, space } from '@guardian/source-foundations';
import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';

const guardianTsAndCsStyles = css`
	margin-bottom: ${space[6]}px;
	${from.tablet} {
		margin-bottom: 64px;
	}
`;

export function GuardianTsAndCs({
	mobileTheme = 'dark',
}: {
	mobileTheme?: FinePrintTheme;
}): JSX.Element {
	return (
		<FinePrint mobileTheme={mobileTheme} cssOverrides={guardianTsAndCsStyles}>
			<p>
				The ultimate owner of the Guardian is The Scott Trust Limited, whose
				role it is to secure the editorial and financial independence of the
				Guardian in perpetuity. Reader payments support the Guardian’s
				journalism. Please note that your support does not constitute a
				charitable donation, so it is not eligible for Gift Aid in the UK nor a
				tax-deduction elsewhere.
			</p>
		</FinePrint>
	);
}
