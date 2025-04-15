// ----- Imports ----- //

import { useState } from 'react';
import type { MediaGroup } from 'helpers/legal';
import * as styles from './directDebitGuaranteeStyles';

type Props = {
	preText: string;
	mediaGroup: MediaGroup;
};

function DirectDebitGuarantee({ preText, mediaGroup }: Props): JSX.Element {
	const [guaranteeOpen, setGuaranteeOpen] = useState(false);

	const onClick = () => setGuaranteeOpen((state) => !state);

	return (
		<div css={styles.guarantee}>
			<p>
				{preText}
				<span css={styles.guaranteeListOpenLink} onClick={onClick}>
					Direct Debit guarantee.
				</span>
				<ul
					css={[
						styles.guaranteeList,
						guaranteeOpen && styles.guaranteeListOpen,
					]}
				>
					<li>
						The Guarantee is offered by all banks and building societies that
						accept instructions to pay Direct Debits.
					</li>
					<li>
						If there are any changes to the amount, date or frequency of your
						Direct Debit {mediaGroup} will notify you at least three working
						days in advance of your account being debited or as otherwise
						agreed.
					</li>
					<li>
						If you ask {mediaGroup} to collect a payment, confirmation of the
						amount and date will be given to you at the time of the request.
					</li>
					<li>
						If an error is made in the payment of your Direct Debit by
						{mediaGroup} or your bank or building society, you are entitled to a
						full and immediate refund of the amount paid from your bank or
						building society.
					</li>
					<li>
						If you receive a refund you are not entitled to, you must pay it
						back when {mediaGroup} asks you to.
					</li>
					<li>
						You can cancel a Direct Debit at any time by contacting your bank or
						building society. Written confirmation may be required. Please also
						notify us.
					</li>
				</ul>
			</p>
		</div>
	);
}

export default DirectDebitGuarantee;
