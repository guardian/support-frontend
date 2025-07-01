import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import DirectDebitGuarantee from 'components/directDebit/directDebitForm/directDebitGuarantee';
import { contributionsEmail, MediaGroup } from 'helpers/legal';
import * as styles from './legalNoticeStyles';

function LegalNotice(props: {
	countryGroupId: CountryGroupId;
	isSundayOnly?: boolean;
}) {
	if (props.isSundayOnly) {
		return (
			<div css={styles.legalNotice}>
				<p>
					<strong>Payments by GoCardless</strong>
					<br />
					Read the{' '}
					<a
						href="https://gocardless.com/privacy"
						target="_blank"
						rel="noopener noreferrer"
					>
						GoCardless privacy notice
					</a>
				</p>
				<p>
					<strong>Advance notice</strong>
					<br />
					The details of your Direct Debit instruction including payment
					schedule, due date, frequency and amount will be sent to you within
					three working days.{' '}
					<DirectDebitGuarantee
						preText="All the normal Direct Debit safeguards and
					guarantees apply, protected by the "
						mediaGroup={MediaGroup.TORTOISE}
					/>
				</p>
				<p>
					Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays,
					8am-6pm at weekends (GMT/BST){' '}
				</p>
			</div>
		);
	}

	return (
		<div css={styles.legalNotice}>
			<p>
				<strong>Payments by GoCardless</strong>
				<br />
				Read the{' '}
				<a
					href="https://gocardless.com/privacy"
					target="_blank"
					rel="noopener noreferrer"
				>
					GoCardless privacy notice
				</a>
			</p>
			<p>
				<strong>Advance notice</strong> The details of your Direct Debit
				instruction including payment schedule, due date, frequency and amount
				will be sent to you within three working days. All the normal Direct
				Debit safeguards and guarantees apply.
			</p>
			<p>
				<strong>Direct Debit</strong>
				<address>
					The Guardian, Mease Mill, Westminster Industrial Estate, Measham,
					Swadlincote, DE12 7DS
				</address>
				<br />
				Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays,
				9am-6pm at weekends (GMT/BST)
				<br />
				<a href={contributionsEmail[props.countryGroupId]}>
					{contributionsEmail[props.countryGroupId].replace('mailto:', '')}
				</a>
			</p>
			<br />
			<DirectDebitGuarantee
				preText="Your payments are protected by the "
				mediaGroup={MediaGroup.GUARDIAN}
			/>
		</div>
	);
}

export default LegalNotice;
