import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { PageScaffold } from 'components/page/pageScaffold';

export function SupporterPlusLandingPage(): JSX.Element {
	return (
		<PageScaffold id="supporter-plus-landing">
			<CheckoutHeading heading="Thank you for your support">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
					ex justo, varius ut porttitor tristique, rhoncus quis dolor.
				</p>
			</CheckoutHeading>
		</PageScaffold>
	);
}
