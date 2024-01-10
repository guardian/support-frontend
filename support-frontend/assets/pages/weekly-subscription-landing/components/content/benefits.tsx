import { List } from 'components/list/list';
import BenefitsContainer from './benefitsContainer';
import BenefitsHeading from './benefitsHeading';

const coreBenefits = [
	{
		content:
			'The Guardian Weekly magazine delivered every week to your door, wherever you live in the world',
	},
	{
		content:
			'64 pages of carefully curated news, features and opinion from the Guardian',
	},
	{
		content: 'A selection of puzzles, crosswords and a weekly recipe',
	},
	{
		content: 'Access to a digital version of the magazine',
	},
	{
		content: `Become part of our global community of supporters who collectively power the Guardian's fiercely independent journalism`,
	},
	{
		content: 'A weekly newsletter from the editor',
	},
];

function Benefits(): JSX.Element {
	return (
		<BenefitsContainer
			sections={[
				{
					id: 'benefits',
					content: (
						<>
							<BenefitsHeading text="What do you get with a Guardian Weekly subscription?" />
							<List items={coreBenefits} />
						</>
					),
				},
			]}
		/>
	);
}

export default Benefits;
