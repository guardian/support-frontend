import { List } from 'components/list/list';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import BenefitsContainer from './benefitsContainer';
import BenefitsHeading from './benefitsHeading';

const coreBenefits = [
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

function getBenefits(countryId: IsoCountry, countryGroupId: CountryGroupId) {
	if (countryId === 'AU') {
		return [
			{
				content: 'Every issue delivered with up to 35% off the cover price',
			},
			...coreBenefits,
			{
				content:
					'A free Guardian Weekly tote bag with every 12 for 12 subscription',
			},
		];
	}
	const discount = countryGroupId === 'EURCountries' ? '87' : '35';
	return [
		{
			content: `Every issue delivered with up to ${discount}% off the cover price`,
		},
		...coreBenefits,
	];
}

function Benefits({
	countryId,
	countryGroupId,
}: {
	countryId: IsoCountry;
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
							<List items={getBenefits(countryId, countryGroupId)} />
						</>
					),
				},
			]}
		/>
	);
}

export default Benefits;
