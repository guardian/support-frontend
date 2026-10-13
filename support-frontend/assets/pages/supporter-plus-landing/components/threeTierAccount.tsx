import { css } from '@emotion/react';
import { from, textSans17 } from '@guardian/source/foundations';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { BenefitPill } from 'components/checkoutBenefits/benefitPill';
import Tooltip from 'components/tooltip/Tooltip';
import { useAbParticipations } from 'contexts/AbParticipationsContext';
import type { CardTheme } from 'helpers/landingPage/cardTheme';
import { tooltipMultipleAccounts } from 'helpers/productCatalog';
import { ThreeTierAccountUser } from './therTierAccountUser';
import { ThreeTierAccountUsers } from './threeTierAccountUsers';

const accountTextItemCss = css`
	${textSans17};
	line-height: 1.15;
	& div {
		display: none;

		${from.desktop} {
			display: inline;
			margin-left: 1px;
		}
	}
`;

type ThreeTierAccountProps = {
	productKey: ProductKey;
	cardTheme: CardTheme;
};
export function ThreeTierAccount({
	productKey,
	cardTheme,
}: ThreeTierAccountProps): JSX.Element | null {
	const abParticipations = useAbParticipations();
	const abVariant = abParticipations.multipleAccounts ?? '';

	// constrain to v1 and v2 for DigitalSubscription, v2 for SupporterPlus
	const isValidDigitalSubscription =
		productKey === 'DigitalSubscription' && ['v1', 'v2'].includes(abVariant);
	const isValidSupporterPlus =
		productKey === 'SupporterPlus' && ['v2'].includes(abVariant);
	if (!isValidDigitalSubscription && !isValidSupporterPlus) {
		return null;
	}

	const productVersionsCopy = {
		DigitalSubscription: {
			v1: '3 extra accounts to share',
			v2: '4 accounts',
		},
		SupporterPlus: {
			v1: undefined,
			v2: '1 account',
		},
	};
	const accountCopy = productVersionsCopy[productKey][abVariant as 'v1' | 'v2'];

	const accountTooltip =
		isValidDigitalSubscription && abVariant === 'v2' ? (
			<>
				<p>
					<strong>Extra accounts</strong>
				</p>
				<p>{tooltipMultipleAccounts}</p>
			</>
		) : null;

	return accountCopy ? (
		<span css={accountTextItemCss}>
			{isValidDigitalSubscription && (
				<BenefitPill copy={'New'} pillColor={cardTheme.benefitPillColor} />
			)}
			{isValidDigitalSubscription ? (
				<ThreeTierAccountUsers />
			) : (
				<ThreeTierAccountUser />
			)}
			{accountCopy}
			{accountTooltip && (
				<Tooltip
					children={accountTooltip}
					xAxisOffset={108}
					yAxisOffset={12}
					placement="bottom"
					desktopOnly={true}
				></Tooltip>
			)}
		</span>
	) : null;
}
