import { css } from '@emotion/react';
import { textSans } from '@guardian/source-foundations';

const directDebitTerms = (isThreeTier?: true) => css`
	${isThreeTier ? textSans.xxsmall() : textSans.xsmall()};

	a,
	a:visited {
		color: ${isThreeTier ? '#606060' : 'inherit'};
	}
	p {
		margin-top: 10px;
		color: ${isThreeTier ? '#606060' : 'inherit'};
	}
`;

interface DirectDebitTermsProps {
	isThreeTier?: true;
}

function DirectDebitTerms({ isThreeTier }: DirectDebitTermsProps) {
	return (
		<div css={directDebitTerms(isThreeTier)}>
			<p>
				<strong>Payments by GoCardless</strong>
				<br />
				Read the{' '}
				<a href="https://gocardless.com/privacy">GoCardless privacy notice</a>
			</p>
			<p>
				Advance notice
				<br />
				The details of your Direct Debit instruction including payment schedule,
				due date, frequency and amount will be sent to you within three working
				days. All the normal Direct Debit safeguards and guarantees apply.
			</p>
			<p>
				Direct Debit
				<br />
				The Guardian, Unit 16, Coalfield Way, Ashby Park, Ashby-De-La-Zouch,
				LE65 1TJ United Kingdom
				<br />
				Tel: 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays,
				8am-6pm at weekends (GMT/BST){' '}
				<a
					className="component-customer-service__email"
					href="mailto:contribution.support@theguardian.com"
				>
					contribution.support@theguardian.com
				</a>
			</p>
		</div>
	);
}

export default DirectDebitTerms;
