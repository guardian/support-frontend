import { Checkbox } from '@guardian/source/react-components';
import { useState } from 'react';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';

export function SimilarProductsConsent() {
	const [similarProductsConsent, setSimilarProductsConsent] =
		useState<boolean>(true);

	return (
		<>
			<Checkbox
				name="similarProductsConsentCheckbox"
				label="Receive information on our products and ways to support and enjoy our journalism. Untick to opt out."
				checked={similarProductsConsent}
				onChange={(event) => {
					const checked = event.currentTarget.checked;
					setSimilarProductsConsent(checked);
					trackComponentClick(
						'similar-products-consent-checkbox',
						checked.toString(),
					);
				}}
			/>
			<input
				type="hidden"
				name="similarProductsConsent"
				value={similarProductsConsent.toString()}
			/>
		</>
	);
}
