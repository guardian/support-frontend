import type { SerializedStyles } from '@emotion/react';
import type { ReactNode } from 'react';
import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import 'helpers/types/option';
import type { ProductBenefit } from 'helpers/productCatalog';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';
import {
	subscriptionsDescription,
	subscriptionsDescriptionContainer,
	subscriptionsDescriptionContainerFeature,
	subscriptionsDescriptionFeature,
	subscriptionsImage,
	subscriptionsImageContainer,
	subscriptionsImageContainerFeature,
	subscriptionsImageFeature,
	subscriptionsProductContainer,
	subscriptionsProductContainerFeature,
} from './subscriptionsProductStyles';

type SubscriptionsProductProps = {
	title: string;
	subtitle: string;
	description: string;
	buttons: ProductButton[];
	productImage: ReactNode;
	offer?: string;
	isFeature?: boolean;
	benefits?: ProductBenefit[];
	cssOverrides?: SerializedStyles;
};

function SubscriptionsProduct({
	productImage,
	isFeature,
	benefits,
	cssOverrides,
	...props
}: SubscriptionsProductProps): JSX.Element {
	return (
		<div
			css={[
				subscriptionsProductContainer,
				isFeature && subscriptionsProductContainerFeature,
				cssOverrides,
			]}
		>
			<div
				css={[
					subscriptionsImageContainer,
					isFeature && subscriptionsImageContainerFeature,
				]}
			>
				<div css={isFeature ? subscriptionsImageFeature : subscriptionsImage}>
					{productImage}
				</div>
			</div>
			<div
				css={[
					subscriptionsDescriptionContainer,
					isFeature && subscriptionsDescriptionContainerFeature,
				]}
			>
				<div
					css={[
						subscriptionsDescription,
						isFeature && subscriptionsDescriptionFeature,
					]}
				>
					<SubscriptionsProductDescription
						{...props}
						isFeature={isFeature}
						benefits={benefits}
					/>
				</div>
			</div>
		</div>
	);
}

SubscriptionsProduct.defaultProps = {
	offer: null,
	isFeature: false,
};
export default SubscriptionsProduct;
