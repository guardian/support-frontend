import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';

const directDebitSetupText = css`
	font-weight: bold;
`;

const directDebitMessage = css`
	margin-bottom: ${space[6]}px;
`;

function DirectDebitMessage({
	isObserverPrint = false,
}: {
	isObserverPrint?: boolean;
}): JSX.Element {
	const mediaGroup = isObserverPrint ? 'The Observer' : 'Guardian Media Group';
	return (
		<div css={directDebitMessage}>
			<span css={directDebitSetupText}>
				Your Direct Debit has been set up.{' '}
			</span>
			Look out for an email within three business days confirming your recurring
			payment. This will appear as '{mediaGroup}' on your bank statements.
		</div>
	);
}

export default DirectDebitMessage;
