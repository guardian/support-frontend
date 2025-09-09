import { messageBold, messageMargin } from './MessageStyles';

function DirectDebitMessage({
	mediaGroup,
}: {
	mediaGroup: string;
}): JSX.Element {
	return (
		<div css={messageMargin}>
			<strong css={messageBold}>Your Direct Debit has been set up. </strong>
			You will receive an email within three business days confirming your
			recurring payment. This will appear as '{mediaGroup}' on your bank
			statements.
		</div>
	);
}

export default DirectDebitMessage;
