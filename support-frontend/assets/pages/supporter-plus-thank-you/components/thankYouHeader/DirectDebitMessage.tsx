import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';

const bold = css`
	font-weight: bold;
`;

const directDebitMessage = css`
	margin-bottom: ${space[2]}px;
`;

function DirectDebitMessage({
	mediaGroup,
}: {
	mediaGroup: string;
}): JSX.Element {
	return (
		<div css={directDebitMessage}>
			<strong css={bold}>Your Direct Debit has been set up. </strong>
			You will receive an email within three business days confirming your
			recurring payment. This will appear as '{mediaGroup}' on your bank
			statements.
		</div>
	);
}

export default DirectDebitMessage;
