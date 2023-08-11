import { List } from 'components/list/list';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import BenefitsContainer from './benefitsContainer';
import BenefitsHeading from './benefitsHeading';

const coreBenefits = [
	{
		content: `Every issue delivered with up to 35% off the cover price`,
	},
	{
		content: "Access to the magazine's digital archive",
	},
	{
		content: 'A weekly email newsletter from the editor',
	},
	{
		content: "The very best of the Guardian's puzzles",
	},
];

function getBenefits(countryGroupId: CountryGroupId) {
	const discount = getDiscountGW(countryGroupId);
	return [
		{
			content: `Every issue delivered with up to ${discount}% off the cover price`,
		},
		...coreBenefits,
	];
}

function getDiscountGW(countryGroupId: CountryGroupId): number {
	switch (countryGroupId) {
		case 'Canada':
		case 'UnitedStates':
			return 50;
		default:
			return 20;
	}
}

function Benefits({
	countryGroupId,
}: {
	countryGroupId: CountryGroupId;
}): JSX.Element {
	return (
		<BenefitsContainer
			sections={[
				{
					id: 'benefits',
					content: (
						<>
							<BenefitsHeading text="As a subscriber you’ll enjoy" />
							<List items={getBenefits(countryGroupId)} />
						</>
					),
				},
			]}
		/>
	);
}

export default Benefits;
