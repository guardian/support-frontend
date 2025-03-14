import cx from 'classnames';
import type { ReactNode } from 'react';
import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import 'helpers/types/option';
import type { ProductBenefit } from 'helpers/productCatalog';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';

type PropTypes = {
	title: string;
	subtitle: string;
	description: string;
	buttons: ProductButton[];
	productImage: ReactNode;
	offer?: string;
	isFeature?: boolean;
	classModifier: string[];
	benefits?: ProductBenefit[];
};

function SubscriptionsProduct({
	classModifier,
	productImage,
	isFeature,
	benefits,
	...props
}: PropTypes): JSX.Element {
	return (
		<div
			className={cx(
				'subscriptions__product',
				{
					'subscriptions__product--feature': isFeature,
				},
				classModifier,
			)}
		>
			<div
				className={cx('subscriptions__image-container', {
					'subscriptions__product--feature': isFeature,
				})}
			>
				<div
					className={
						isFeature
							? 'subscriptions__feature-image-wrapper'
							: 'subscriptions-packshot'
					}
				>
					{productImage}
				</div>
			</div>

			<div
				className={cx('subscriptions__copy-container', {
					'subscriptions__product--feature': isFeature,
				})}
			>
				<div className="subscriptions__copy-wrapper">
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
