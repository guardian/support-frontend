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
	const abVariant = abParticipations.multipleAccounts;

	const getAccountCopy = (productKey: ProductKey, abVariant?: string) => {
		if (abVariant && ['v1', 'v2'].includes(abVariant)) {
			switch (productKey) {
				case 'DigitalSubscription':
					return abVariant === 'v2'
						? '4 accounts'
						: '3 extra accounts to share';
				case 'SupporterPlus':
					return abVariant === 'v2' ? '1 account' : undefined;
				default:
					return undefined;
			}
		}
		return undefined;
	};
	const accountCopy = getAccountCopy(productKey, abVariant);

	const getAccountTooltip = (productKey: ProductKey, abVariant?: string) => {
		if (productKey === 'DigitalSubscription' && abVariant === 'v2') {
			return (
				<>
					<p>
						<strong>Extra accounts</strong>
					</p>
					<p>{tooltipMultipleAccounts}</p>
				</>
			);
		}
		return undefined;
	};
	const accountTooltip = getAccountTooltip(productKey, abVariant);

	const isDigitalSubscription = productKey === 'DigitalSubscription';

	const threeTierAccountUser = isDigitalSubscription ? (
		<ThreeTierAccountUsers />
	) : (
		<ThreeTierAccountUser />
	);

	return accountCopy ? (
		<span css={accountTextItemCss}>
			{isDigitalSubscription && (
				<BenefitPill copy={'New'} pillColor={cardTheme.benefitPillColor} />
			)}
			{threeTierAccountUser}
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
