import { List } from 'components/list/list';
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

function getBenefits(countryGroupId: CountryGroupId) {
	const discount = countryGroupId === 'EURCountries' ? '87' : '35';
	return [
		{
			content: `Every issue delivered with up to ${discount}% off the cover price`,
		},
		...coreBenefits,
	];
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
