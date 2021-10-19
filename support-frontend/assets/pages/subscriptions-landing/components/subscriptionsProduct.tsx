import React from 'react';
import type { Node } from 'react';
import cx from 'classnames';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';
import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';
type PropTypes = {
	title: string;
	subtitle: string;
	description: string;
	buttons: ProductButton[];
	productImage: Node;
	offer?: Option<string>;
	isFeature?: Option<boolean>;
	classModifier: string[];
};

const SubscriptionsProduct = ({
	classModifier,
	productImage,
	isFeature,
	...props
}: PropTypes) => (
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
				<SubscriptionsProductDescription {...props} isFeature={isFeature} />
			</div>
		</div>
	</div>
);

SubscriptionsProduct.defaultProps = {
	offer: null,
	isFeature: false,
};
export default SubscriptionsProduct;
