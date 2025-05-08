import { Checkbox } from '@guardian/source/react-components';
import { useState } from 'react';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';

const productConsents = {
	similarProductsConsent: 'similar-products-consent-checkbox',
	oneTimeContributionConsent: 'one-time-contribution-consent-checkbox',
} satisfies Record<string, string>;

export default function GenericCheckoutConsent({
	productConsent,
}: {
	productConsent: keyof typeof productConsents;
}) {
	const [consentValue, setConsentValue] = useState(true);
	return (
		<>
			<input type="hidden" name={productConsent} value={String(consentValue)} />
			<Checkbox
				name="genericConsentCheckbox"
				label="Receive information on our products and ways to support and enjoy our journalism. Untick to opt out."
				defaultChecked
				onClick={(event) => {
					const checked = event.currentTarget.checked;
					setConsentValue(checked);
					trackComponentClick(productConsents[productConsent], String(checked));
				}}
			/>
		</>
	);
}
