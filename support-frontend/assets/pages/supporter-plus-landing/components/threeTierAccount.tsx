import { css } from '@emotion/react';
import { from, palette, space, textSans15 } from '@guardian/source/foundations';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { BenefitPill } from 'components/checkoutBenefits/benefitPill';
import Tooltip from 'components/tooltip/Tooltip';
import type { CardTheme } from 'helpers/landingPage/cardTheme';
import { tooltipMultipleAccounts } from 'helpers/productCatalog';
import { ThreeTierAccountUser } from './threeTierAccountUser';
import { ThreeTierAccountUsers } from './threeTierAccountUsers';

const accountBorder = (paddingBottom: number) => css`
	padding-bottom: ${paddingBottom}px;
	border-bottom: 1px solid ${palette.neutral[86]};
	margin-bottom: ${space[4]}px;
`;

const accountItems = (justify: 'center' | 'flex-start') => css`
	display: flex;
	flex-direction: row;
	justify-content: ${justify};
	align-items: center;
	column-gap: ${space[2]}px;

	${textSans15};
`;

const accountTooltip = css`
	& div {
		display: none;

		${from.desktop} {
			display: inline;
			margin-left: 1px;
		}
	}
`;

const accountUpright = css`
	border-left: 1px solid ${palette.neutral[86]};
	height: ${space[5]}px;
`;

type ThreeTierAccountProps = {
	productKey: ProductKey;
	cardTheme: CardTheme;
	multipleAccountsVariant?: string;
};
export function ThreeTierAccount({
	productKey,
	cardTheme,
	multipleAccountsVariant,
}: ThreeTierAccountProps): JSX.Element | null {
	const isDigitalSubscriptionV1 =
		productKey === 'DigitalSubscription' && multipleAccountsVariant === 'v1';
	const isDigitalSubscriptionV2 =
		productKey === 'DigitalSubscription' && multipleAccountsVariant === 'v2';
	const isSupporterPlusV2 =
		productKey === 'SupporterPlus' && multipleAccountsVariant === 'v2';
	const isV2 = isDigitalSubscriptionV2 || isSupporterPlusV2;
	const showThreeTierAccount =
		isDigitalSubscriptionV1 || isDigitalSubscriptionV2 || isSupporterPlusV2;

	const accountCopy = isSupporterPlusV2
		? '1 account'
		: isDigitalSubscriptionV2
		? '4 accounts'
		: '3 extra accounts to share';

	return multipleAccountsVariant && multipleAccountsVariant !== 'control' ? (
		<section css={accountBorder(showThreeTierAccount ? space[4] : space[9])}>
			{showThreeTierAccount ? (
				<span css={accountItems(isV2 ? 'center' : 'flex-start')}>
					{productKey === 'DigitalSubscription' ? (
						<>
							<BenefitPill
								copy={'New'}
								pillColor={cardTheme.benefitPillColor}
							/>
							{!isV2 && <div css={accountUpright} />}
							<ThreeTierAccountUsers />
						</>
					) : (
						<ThreeTierAccountUser />
					)}
					<span css={accountTooltip}>
						{accountCopy}
						{isDigitalSubscriptionV2 && (
							<Tooltip
								children={
									<>
										<p
											css={css`
												margin-bottom: ${space[2]}px;
											`}
										>
											<strong>Extra accounts</strong>
										</p>
										<p>{tooltipMultipleAccounts}</p>
									</>
								}
								xAxisOffset={108}
								yAxisOffset={12}
								placement="bottom"
								desktopOnly={true}
							></Tooltip>
						)}
					</span>
				</span>
			) : null}
		</section>
	) : null;
}
