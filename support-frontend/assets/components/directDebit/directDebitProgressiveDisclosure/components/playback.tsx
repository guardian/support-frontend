// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	space,
	textSans15,
	textSans17,
	textSansBold17,
} from '@guardian/source/foundations';
import {
	Button,
	SvgArrowRightStraight,
	themeButtonReaderRevenueBrand,
	themeButtonReaderRevenueBrandAlt,
} from '@guardian/source/react-components';
import { useEffect, useRef } from 'react';
import type * as React from 'react';
import { RecaptchaField } from 'components/recaptcha/recaptchaField';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';

const directDebitForm = css`
	clear: left;
	margin-top: 20px;
	margin-left: 0;
`;

const fieldLabel = css`
	display: block;
	${textSansBold17};
	margin: 8px 0 6px;
`;

const fieldData = css`
	${textSans17};
`;

const fieldInfo = css`
	${textSans15};
`;

const fieldInfoWithMargin = css`
	${textSans15};
	margin: ${space[2]}px 0 ${space[5]}px;
`;

const recaptchaContainer = css`
	margin-bottom: 20px;
`;

const ctaContainer = css`
	display: inline-flex;
	justify-content: space-between;
	width: 100%;
`;

const recaptchaId = 'robot_checkbox';

function Playback(props: {
	editDirectDebitClicked: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
	accountHolderName: string;
	accountNumber: string;
	sortCode: string;
	buttonText: string;
	allErrors: Array<Record<string, string>>;
	setRecaptchaToken: (token: string) => void;
	expireRecaptchaToken?: () => void;
	recaptchaError: string;
}): JSX.Element {
	const subscribeButtonRef = useRef<HTMLDivElement>(null);

	// Actively moving focus to the buttons prevents a screenreader 'losing its place' in the document
	// after we switch to this component, and means the user can more easily edit or confirm
	useEffect(() => {
		subscribeButtonRef.current?.focus();
	}, [subscribeButtonRef]);

	return (
		<div css={directDebitForm}>
			<div aria-live="polite">
				<label htmlFor="account-holder-name-input" css={fieldLabel}>
					Account name
				</label>
				<span css={fieldData}>{props.accountHolderName}</span>

				<label htmlFor="sort-code-input" css={fieldLabel}>
					Sort Code
				</label>
				<span css={fieldData}>{props.sortCode}</span>

				<label htmlFor="account-number-input" css={fieldLabel}>
					Account number
				</label>
				<span css={fieldData}>{props.accountNumber}</span>

				<label htmlFor="confirmation-text__locked" css={fieldLabel}>
					Declaration
				</label>
				<p id="confirmation-text__locked" css={fieldInfo}>
					I have confirmed that I am the account holder and that I am solely
					able to authorise debit from the account
				</p>
				<p css={fieldInfoWithMargin}>
					If the details above are correct, press confirm to set up your direct
					debit, otherwise press back to make changes
				</p>
			</div>

			<div css={recaptchaContainer}>
				<RecaptchaField
					label="Security check"
					id={recaptchaId}
					error={props.recaptchaError}
					onRecaptchaCompleted={props.setRecaptchaToken}
					onRecaptchaExpired={props.expireRecaptchaToken}
				/>
			</div>

			<div css={ctaContainer} ref={subscribeButtonRef} tabIndex={-1}>
				<Button
					onClick={props.editDirectDebitClicked}
					theme={themeButtonReaderRevenueBrandAlt}
				>
					Edit
				</Button>
				<Button
					id="qa-submit-button-2"
					onClick={props.onSubmit}
					icon={<SvgArrowRightStraight />}
					iconSide="right"
					theme={themeButtonReaderRevenueBrand}
				>
					{props.buttonText}
				</Button>
			</div>

			{props.allErrors.length > 0 && (
				<ErrorSummary errors={[...props.allErrors]} />
			)}
		</div>
	);
}

export default Playback;
