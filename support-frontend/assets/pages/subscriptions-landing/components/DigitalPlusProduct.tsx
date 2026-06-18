import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import 'helpers/types/option';
import type { ProductCopy } from 'pages/subscriptions-landing/copy/subscriptionCopy';
import {
	subscriptionsDescription,
	subscriptionsDescriptionContainer,
	subscriptionsImage,
	subscriptionsImageContainer,
	subscriptionsProductContainer,
} from './DigitalPlusProductStyles';

function DigitalPlusProduct({
	productImage,
	benefits,
	cssOverrides,
	...props
}: ProductCopy): JSX.Element {
	return (
		<div css={[subscriptionsProductContainer, cssOverrides]}>
			<div css={[subscriptionsImageContainer]}>
				<div css={subscriptionsImage}>{productImage}</div>
			</div>
			<div css={[subscriptionsDescriptionContainer]}>
				<div css={[subscriptionsDescription]}>
					<SubscriptionsProductDescription
						{...props}
						isFeature={true}
						benefits={benefits}
					/>
				</div>
			</div>
		</div>
	);
}

export default DigitalPlusProduct;
