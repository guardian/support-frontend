// ----- Imports ----- //
import {
	guarantee,
	guaranteeList,
	guaranteeListClosed,
	guaranteeListOpenLink,
} from './directDebitFormStyles';

type PropTypes = {
	isDDGuaranteeOpen: boolean;
	openDirectDebitGuarantee: () => void;
	closeDirectDebitGuarantee: () => void;
};

function DirectDebitGuarantee(props: PropTypes): JSX.Element {
	const onClick = props.isDDGuaranteeOpen
		? props.closeDirectDebitGuarantee
		: props.openDirectDebitGuarantee;
	return (
		<div css={guarantee}>
			<p>
				<span>
					Your payments are protected by the&nbsp;
					<button css={guaranteeListOpenLink} onClick={onClick}>
						Direct Debit guarantee
					</button>
					.
				</span>
				<div>
					<ul
						css={[
							guaranteeList,
							!props.isDDGuaranteeOpen && guaranteeListClosed,
						]}
					>
						<li>
							The Guarantee is offered by all banks and building societies that
							accept instructions to pay Direct Debits
						</li>
						<li>
							If there are any changes to the amount, date or frequency of your
							Direct Debit Guardian News & Media Ltd will notify you at least
							three working days in advance of your account being debited or as
							otherwise agreed.
						</li>
						<li>
							If you ask Guardian News & Media Ltd to collect a payment,
							confirmation of the amount and date will be given to you at the
							time of the request.
						</li>
						<li>
							If an error is made in the payment of your Direct Debit by
							Guardian News & Media Ltd or your bank or building society, you
							are entitled to a full and immediate refund of the amount paid
							from your bank or building society.
						</li>
						<li>
							If you receive a refund you are not entitled to, you must pay it
							back when Guardian News & Media Ltd asks you to.
						</li>
						<li>
							You can cancel a Direct Debit at any time by contacting your bank
							or building society. Written confirmation may be required. Please
							also notify us.
						</li>
					</ul>
				</div>
			</p>
		</div>
	);
}

export default DirectDebitGuarantee;
