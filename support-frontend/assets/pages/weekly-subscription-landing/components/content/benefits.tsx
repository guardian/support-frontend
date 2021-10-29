import React from 'react';
import { List } from 'components/list/list';
import type { Participations } from 'helpers/abTests/abtest';
import BenefitsContainer from './benefitsContainer';
import BenefitsHeading from './benefitsHeading';

type BenefitsPropTypes = {
	participations: Participations;
};

function Benefits({ participations }: BenefitsPropTypes) {
	return (
		<BenefitsContainer
			sections={[
				{
					id: 'benefits',
					content: (
						<>
							<BenefitsHeading text="As a subscriber you’ll enjoy" />
							<List
								items={[
									{
										content:
											participations.sixForSixSuppression === 'variant'
												? 'Every issue delivered with up to 34% off the cover price'
												: 'Every issue delivered with up to 35% off the cover price',
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
								]}
							/>
						</>
					),
				},
			]}
		/>
	);
}

export default Benefits;
