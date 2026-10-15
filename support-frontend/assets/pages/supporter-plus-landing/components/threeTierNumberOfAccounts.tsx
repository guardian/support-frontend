import { css } from '@emotion/react';
import { from, palette, space, textSans15 } from '@guardian/source/foundations';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { BenefitPill } from 'components/checkoutBenefits/benefitPill';
import Tooltip from 'components/tooltip/Tooltip';
import type { CardTheme } from 'helpers/landingPage/cardTheme';
import { tooltipMultipleAccounts } from 'helpers/productCatalog';
import { ThreeTierAccountUser } from './threeTierAccountUser';
import { ThreeTierAccountUsers } from './threeTierAccountUsers';

const accountBorder = (showAccount: boolean) => css`
	border-bottom: 1px solid ${palette.neutral[86]};
	margin-bottom: ${showAccount ? space[4] : space[6]}px;
	padding: ${showAccount ? space[4] : 0}px 0
		${showAccount ? space[4] : space[6]}px;
	${from.desktop} {
		margin-bottom: ${space[4]}px;
		padding: ${space[4]}px 0 ${showAccount ? space[4] : space[9]}px;
	}
`;

const accountItems = (justify: 'center' | 'flex-start') => css`
	display: flex;
	flex-direction: row;
	justify-content: ${justify};
	align-items: center;

	${textSans15};
`;

const accountTooltip = css`
	margin-left: ${space[2]}px;
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
	margin-right: ${space[3]}px;
`;

type ThreeTierNumberOfAccountsProps = {
	productKey: ProductKey;
	cardTheme: CardTheme;
	multipleAccountsVariant?: string;
};
export function ThreeTierNumberOfAccounts({
	productKey,
	cardTheme,
	multipleAccountsVariant,
}: ThreeTierNumberOfAccountsProps): JSX.Element | null {
	const benefitPill = (
		<BenefitPill
			copy={'New'}
			pillColor={cardTheme.benefitPillColor}
			cssOverrides={css`
				margin-right: ${space[3]}px;
			`}
		/>
	);
	const toolTip = (
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
		/>
	);
	const getThreeTierNumberOfAccounts = () => {
		return (
			<>
				{multipleAccountsVariant === 'v1' &&
				productKey === 'DigitalSubscription' ? (
					<section css={accountBorder(true)}>
						<span css={accountItems('flex-start')}>
							<>
								{benefitPill}
								<div css={accountUpright} />
								<ThreeTierAccountUsers />
							</>
							<span css={accountTooltip}>3 extra accounts to share</span>
						</span>
					</section>
				) : multipleAccountsVariant === 'v2' &&
				  productKey === 'DigitalSubscription' ? (
					<section css={accountBorder(true)}>
						<span css={accountItems('center')}>
							<>
								{benefitPill}
								<ThreeTierAccountUsers />
							</>
							<span css={accountTooltip}>
								4 accounts
								{toolTip}
							</span>
						</span>
					</section>
				) : multipleAccountsVariant === 'v2' &&
				  productKey === 'SupporterPlus' ? (
					<section css={accountBorder(true)}>
						<span css={accountItems('center')}>
							<ThreeTierAccountUser />
							<span css={accountTooltip}>
								1 account
								{toolTip}
							</span>
						</span>
					</section>
				) : (
					<section css={accountBorder(false)} />
				)}
			</>
		);
	};

	const showThreeTierNumberOfAccountsContainer = ['v1', 'v2'].includes(
		multipleAccountsVariant ?? '',
	);

	return showThreeTierNumberOfAccountsContainer
		? getThreeTierNumberOfAccounts()
		: null;
}
