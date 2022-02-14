import { css } from '@emotion/react';
import { headline } from '@guardian/source-foundations';
import { useEffect } from 'preact/hooks';
import type { ContributionType } from 'helpers/contributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { setOneOffContributionCookie } from 'helpers/storage/contributionsCookies';
import { formatAmountLabel } from './helpers';

// ---- Component ---- //

interface ContributionsCheckoutThankYouProps {
	currency: IsoCurrency;
	contributionType: ContributionType;
	amount: number;
}

export function ContributionsCheckoutThankYou({
	currency,
	contributionType,
	amount,
}: ContributionsCheckoutThankYouProps): JSX.Element {
	useEffect(() => {
		if (contributionType === 'ONE_OFF') {
			setOneOffContributionCookie();
		}
	}, []);

	return (
		<div css={styles.container}>
			Thank you for contributing{' '}
			{formatAmountLabel(amount, contributionType, currency)}! ❤️
		</div>
	);
}

// ---- Styles ---- //
const styles = {
	container: css`
		${headline.xsmall({ fontWeight: 'bold' })}
	`,
};
