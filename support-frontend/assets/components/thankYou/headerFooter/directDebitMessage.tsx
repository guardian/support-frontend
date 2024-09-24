import { css } from '@emotion/react';

const directDebitSetupText = css`
	font-weight: bold;
`;

function DirectDebitMessage(): JSX.Element {
	return (
		<>
			<span css={directDebitSetupText}>
				Your Direct Debit has been set up.{' '}
			</span>
			Look out for an email within three business days confirming your recurring
			payment. This will appear as &apos;Guardian Media Group&apos; on your bank
			statements.
			<br />
			<br />
		</>
	);
}

export default DirectDebitMessage;
