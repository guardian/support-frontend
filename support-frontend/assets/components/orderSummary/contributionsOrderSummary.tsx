import { css } from '@emotion/react';
import {
	headline,
	palette,
	space,
	textSans,
} from '@guardian/source-foundations';
import {
	Button,
	SvgChevronDownSingle,
} from '@guardian/source-react-components';
import { useState } from 'react';

const componentStyles = css`
	${textSans.medium()}
`;

const summaryRow = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding-top: 4px;
`;

const rowSpacing = css`
	margin-bottom: 18px;
`;

const boldText = css`
	font-weight: 700;
`;

const heading = css`
	${headline.xsmall({ fontWeight: 'bold' })}
`;

const hrCss = css`
	border: none;
	height: 1px;
	background-color: ${palette.neutral[86]};
	margin: 0;
`;

const buttonOverrides = css`
	min-height: unset;
	height: unset;
	text-decoration: none;
	${textSans.xsmall()};
	color: ${palette.neutral[20]};
`;

const iconCss = (flip: boolean) => css`
	svg {
		max-width: ${space[3]}px;
		transition: transform 0.3s ease-in-out;

		${flip && 'transform: rotate(180deg);'}
	}
`;

const detailsSection = css`
	display: flex;
	flex-direction: column;
`;

export type ContributionsOrderSummaryProps = {
	headerButton?: React.ReactNode;
	tsAndCs?: React.ReactNode;
};

export function ContributionsOrderSummary({
	headerButton,
}: ContributionsOrderSummaryProps): JSX.Element {
	const [showDetails, setShowDetails] = useState(false);

	return (
		<div css={componentStyles}>
			<div css={[summaryRow, rowSpacing]}>
				<h2 css={heading}>Your support</h2>
				{headerButton}
			</div>
			<hr css={hrCss} />
			<div css={[detailsSection, rowSpacing]}>
				<div css={summaryRow}>
					<p>Monthly support</p>
					<Button
						priority="subdued"
						aria-expanded={showDetails ? 'true' : 'false'}
						onClick={() => setShowDetails(!showDetails)}
						icon={<SvgChevronDownSingle />}
						iconSide="right"
						cssOverrides={[buttonOverrides, iconCss(showDetails)]}
					>
						{showDetails ? 'Hide details' : 'View details'}
					</Button>
				</div>
				{showDetails && <div>hello</div>}
			</div>
			<hr css={hrCss} />
			<div css={[summaryRow, rowSpacing, boldText]}>
				<p>Total</p>
				<p>£10/month</p>
			</div>
		</div>
	);
}
