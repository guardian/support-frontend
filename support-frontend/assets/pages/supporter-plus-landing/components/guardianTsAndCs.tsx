import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';

export function GuardianTsAndCs({
	theme = 'dark',
}: {
	theme?: FinePrintTheme;
}): JSX.Element {
	return (
		<FinePrint theme={theme}>
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
