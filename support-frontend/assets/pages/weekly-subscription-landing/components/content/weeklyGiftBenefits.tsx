import { List } from 'components/list/list';
import BenefitsContainer from './benefitsContainer';
import BenefitsHeading from './benefitsHeading';

function WeeklyGiftBenefits() {
	return (
		<BenefitsContainer
			sections={[
				{
					id: 'gift-benefits-them',
					content: (
						<>
							<BenefitsHeading text="What they'll get" />
							<List
								items={[
									{
										content: 'The Guardian Weekly delivered to their door',
									},
									{
										content:
											"The Guardian's global journalism to keep them informed",
									},
								]}
							/>
						</>
					),
				},
				{
					id: 'gift-benefits-you',
					content: (
						<>
							<BenefitsHeading text="What you'll get" />
							<List
								items={[
									{
										content:
											"Your gift supports the Guardian's independent journalism",
									},
									{
										content: "Access to the magazine's digital archive",
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

export default WeeklyGiftBenefits;
