import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import {
	CheckoutNudge,
	nudgeData,
} from 'components/checkoutNudge/checkoutNudge';
import type { ContributionType } from 'helpers/contributions';
import type { CheckListData } from './checkoutBenefitsListData';

const container = css`
	${textSans.medium({ lineHeight: 'tight' })};
`;

const heading = css`
	${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })};
	max-width: 295px;
`;

const checkListIcon = css`
	vertical-align: top;
	padding-right: 10px;
	line-height: 0;

	svg {
		fill: ${brand[500]};
	}
`;

const iconContainer = css`
	margin-top: -2px;
`;

const checkListText = css`
	display: inline-block;

	& p {
		line-height: 1.35;
	}
`;

const table = css`
	padding-top: ${space[4]}px;

	& tr:not(:last-child) {
		border-bottom: 10px solid transparent;
	}

	${from.mobileLandscape} {
		& tr:not(:last-child) {
			border-bottom: ${space[3]}px solid transparent;
		}
	}
`;

const hr = (margin: string) => css`
	border: none;
	height: 1px;
	background-color: #dcdcdc;
	margin: ${margin};
`;

const para = css`
	font-weight: bold;

	${until.tablet} {
		margin-bottom: ${space[2]}px;
	}
`;

export type CheckoutBenefitsListProps = {
	title: string;
	checkListData: CheckListData[];
	contributionType: ContributionType;
	buttonCopy: string | null;
	handleButtonClick: () => void;
};

export function CheckoutBenefitsList({
	title,
	checkListData,
	contributionType,
}: CheckoutBenefitsListProps): JSX.Element {
	function handleButtonClick(): void {
		throw new Error('Function not implemented.');
	}
	return (
		<div css={container}>
			{contributionType === 'ONE_OFF' ? (
				<CheckoutNudge
					checkoutNudge={nudgeData}
					handleCloseButtonClick={handleButtonClick}
				/>
			) : (
				<>
					<h2 css={heading}>{title}</h2>
					<hr css={hr(`${space[4]}px 0`)} />
					<table css={table}>
						{checkListData.map((item) => (
							<tr>
								<td css={[checkListIcon, item.maybeGreyedOut]}>
									<div css={iconContainer}>{item.icon}</div>
								</td>
								<td css={[checkListText, item.maybeGreyedOut]}>{item.text}</td>
							</tr>
						))}
					</table>
					<hr css={hr(`${space[5]}px 0 ${space[4]}px`)} />
					<p css={para}>Cancel anytime</p>
				</>
			)}
			{/* <UpsellButton
				buttonCopy={buttonCopy}
				handleButtonClick={handleButtonClick}
			/> */}
		</div>
	);
}
