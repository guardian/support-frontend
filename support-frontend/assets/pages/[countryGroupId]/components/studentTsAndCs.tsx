import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';

interface StudentTsAndCsProps {
	product: ActiveProductKey;
	countryGroupId: CountryGroupId;
}
export function StudentTsAndCs({
	product,
	countryGroupId,
}: StudentTsAndCsProps): JSX.Element {
	return (
		<div>
			Student Ts&Cs Component
			{product}
			{countryGroupId}
		</div>
	);
}
