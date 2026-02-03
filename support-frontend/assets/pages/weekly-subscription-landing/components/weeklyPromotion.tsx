import Content from 'components/content/content';
import Divider from 'components/content/Divider';
import { Title } from 'components/text/text';

export function WeeklyPromotion(): JSX.Element {
	return (
		<Content>
			<Divider />
			<Title>Promotion terms and conditions</Title>
			<div>
				Offer subject to availability. Guardian News and Media Ltd ("GNM")
				reserves the right to withdraw this promotion at any time. Full
				promotion Terms and Conditions for our annual offer.
			</div>
		</Content>
	);
}
