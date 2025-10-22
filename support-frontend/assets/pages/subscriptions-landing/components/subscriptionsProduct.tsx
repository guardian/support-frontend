import type { SerializedStyles } from '@emotion/react';
import type { ReactNode } from 'react';
import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import 'helpers/types/option';
import type { ProductBenefit } from 'helpers/productCatalog';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';
import {
	subscriptions__copy_container,
	subscriptions__copy_container_subscriptions__product__feature,
	subscriptions__copy_wrapper,
	subscriptions__feature_image_wrapper,
	subscriptions__image_container,
	subscriptions__image_container_subscriptions__product__feature,
	subscriptions__packshot,
	subscriptions__product,
	subscriptions__product__feature,
} from './subscriptionsProductStyles';

type PropTypes = {
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
}: PropTypes): JSX.Element {
	return (
		<div
			css={[
				subscriptions__product,
				isFeature ? subscriptions__product__feature : '',
				cssOverrides,
			]}
		>
			<div
				className={'subscriptions__image-container '}
				css={[
					subscriptions__image_container,
					isFeature
						? subscriptions__image_container_subscriptions__product__feature
						: '',
				]}
			>
				<div
					css={
						isFeature
							? subscriptions__feature_image_wrapper
							: subscriptions__packshot
					}
				>
					{productImage}
				</div>
			</div>
			<div
				css={[
					subscriptions__copy_container,
					isFeature
						? subscriptions__copy_container_subscriptions__product__feature
						: '',
				]}
			>
				<div
					className={'subscriptions__copy-wrapper'}
					css={subscriptions__copy_wrapper}
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
