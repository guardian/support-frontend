import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	space,
	textSans,
} from '@guardian/source-foundations';
import type { CheckListData } from './checkoutBenefitsListData';

const container = css`
	${textSans.small({ lineHeight: 'tight' })};
`;

const heading = css`
	${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })};
	max-width: 300px;
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
`;

export type CheckoutBenefitsListProps = {
	title: string;
	checkListData: CheckListData[];
	buttonCopy: string | null;
	handleButtonClick: () => void;
};

export function CheckoutBenefitsList({
	title,
	checkListData,
}: CheckoutBenefitsListProps): JSX.Element {
	return (
		<div css={container}>
			<h3 css={heading}>{title}</h3>
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
			{/* <UpsellButton
				buttonCopy={buttonCopy}
				handleButtonClick={handleButtonClick}
			/> */}
			<hr css={hr(`${space[5]}px 0 ${space[4]}px`)} />
			<p css={para}>Cancel anytime</p>
		</div>
	);
}
