import { Checkbox } from '@guardian/source/react-components';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';

export function SimilarProductsConsent() {
	return (
		<Checkbox
			name="similarProductsConsent"
			label="Receive information on our products and ways to support and enjoy our journalism. Untick to opt out."
			checked={true}
			onClick={(event) => {
				const checked = event.currentTarget.checked;
				trackComponentClick(
					'similar-products-consent-checkbox',
					checked.toString(),
				);
			}}
		/>
	);
}
