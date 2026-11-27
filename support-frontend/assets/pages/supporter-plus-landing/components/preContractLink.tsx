import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import { isObserverSubdomain } from 'helpers/globalsAndSwitches/observer';
import { observerLinks, preContractLinks } from 'helpers/legal';
import type { ActiveProductKey } from 'helpers/productCatalog';

const preContractLinkStyle = css`
	border-top: 1px solid ${neutral[73]};
	padding-top: ${space[2]}px;
`;

const preContractLinkByProduct = {
	SupporterPlus: preContractLinks.ALL_ACCESS_DIGITAL,
	DigitalSubscription: preContractLinks.DIGITAL_PLUS,
	GuardianAdLite: preContractLinks.GUARDIAN_AD_LITE,
	HomeDelivery: preContractLinks.NEWSPAPER,
	NationalDelivery: preContractLinks.NEWSPAPER,
	SubscriptionCard: preContractLinks.NEWSPAPER,
	GuardianWeeklyDomestic: preContractLinks.GUARDIAN_WEEKLY,
	GuardianWeeklyRestOfWorld: preContractLinks.GUARDIAN_WEEKLY,
	Contribution: undefined,
	OneTimeContribution: undefined,
} satisfies Record<ActiveProductKey, string | undefined>;

export function getPreContractLinkByProduct(
	productKey: ActiveProductKey,
	isObserver: boolean,
): string | undefined {
	if (isObserver) {
		return observerLinks.PRE_CONTRACT;
	}
	return preContractLinkByProduct[productKey];
}

interface PreContractLinkProps {
	productKey: ActiveProductKey;
}

export default function PreContractLink({
	productKey,
}: PreContractLinkProps): JSX.Element | null {
	const isObserver = isObserverSubdomain();
	const preContractLink = getPreContractLinkByProduct(productKey, isObserver);

	if (!preContractLink) {
		return null;
	}

	const link = (
		<a href={preContractLink} target="_blank" rel="noopener noreferrer">
			here
		</a>
	);

	return (
		<p css={preContractLinkStyle}>
			{isObserver ? (
				<>
					For more important information about your subscription click {link}.
				</>
			) : (
				<>
					See more details about your subscription in your full pre-contract
					information {link}.
				</>
			)}
		</p>
	);
}
