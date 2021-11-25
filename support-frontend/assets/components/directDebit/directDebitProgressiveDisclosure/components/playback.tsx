// ----- Imports ----- //
import { css } from '@emotion/core';
import {
	Button,
	buttonReaderRevenueBrand,
	buttonReaderRevenueBrandAlt,
} from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { textSans } from '@guardian/src-foundations/typography';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';

const directDebitForm = css`
	clear: left;
	margin-top: 20px;
	margin-left: 0;
`;
const fieldLabel = css`
	display: block;
	${textSans.medium({
		fontWeight: 'bold',
	})};
	margin: 8px 0 6px;
`;
const fieldData = css`
	${textSans.medium()};
`;
const fieldInfo = css`
	${textSans.small()};
`;
const fieldInfoWithMargin = css`
	${textSans.small()};
	margin: ${space[2]}px 0 ${space[5]}px;
`;
const ctaContainer = css`
	display: inline-flex;
	justify-content: space-between;
	width: 100%;
`;

function Playback(props: {
	editDirectDebitClicked: (...args: any[]) => any;
	onSubmit: (...args: any[]) => any;
	accountHolderName: string;
	accountNumber: string;
	sortCodeString: string;
	buttonText: string;
	allErrors: Array<Record<string, any>>;
}) {
	return (
		<div css={directDebitForm}>
			<label htmlFor="account-holder-name-input" css={fieldLabel}>
				Account name
			</label>
			<span css={fieldData}>{props.accountHolderName}</span>

			<label htmlFor="sort-code-input" css={fieldLabel}>
				Sort Code
			</label>
			<span css={fieldData}>{props.sortCodeString}</span>

			<label htmlFor="account-number-input" css={fieldLabel}>
				Account number
			</label>
			<span css={fieldData}>{props.accountNumber}</span>

			<label htmlFor="confirmation-text__locked" css={fieldLabel}>
				Declaration
			</label>
			<p id="confirmation-text__locked" css={fieldInfo}>
				I have confirmed that I am the account holder and that I am solely able
				to authorise debit from the account
			</p>
			<p css={fieldInfoWithMargin}>
				If the details above are correct, press confirm to set up your direct
				debit, otherwise press back to make changes
			</p>

			<div css={ctaContainer}>
				<ThemeProvider theme={buttonReaderRevenueBrandAlt}>
					<Button onClick={props.editDirectDebitClicked}>Edit</Button>
				</ThemeProvider>
				<ThemeProvider theme={buttonReaderRevenueBrand}>
					<Button
						id="qa-submit-button-2"
						onClick={props.onSubmit}
						icon={<SvgArrowRightStraight />}
						iconSide="right"
					>
						{props.buttonText}
					</Button>
				</ThemeProvider>
			</div>

			{props.allErrors.length > 0 && (
				<ErrorSummary errors={[...props.allErrors]} />
			)}
		</div>
	);
}

export default Playback;
