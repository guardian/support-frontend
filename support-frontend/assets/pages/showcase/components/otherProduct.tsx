import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import AnchorButton from 'components/button/anchorButton';
import Heading from 'components/heading/heading';
import ArrowRightStraight from 'components/svgs/arrowRightStraight';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { classNameWithModifiers } from 'helpers/utilities/utilities';

type PropTypes = {
	title: string;
	description: string;
	destination: string;
	modifierClass: string;
	trackingId: string;
};
export default function OtherProduct(props: PropTypes): EmotionJSX.Element {
	return (
		<div
			className={classNameWithModifiers('other-product', [props.modifierClass])}
		>
			<Heading size={3} className="product-title">
				{props.title}
			</Heading>
			<div>{props.description}</div>
			<AnchorButton
				icon={<ArrowRightStraight />}
				appearance="greyHollow"
				href={props.destination}
				onClick={() => {
					sendTrackingEventsOnClick({
						id: props.trackingId,
						componentType: 'ACQUISITIONS_BUTTON',
					})();
				}}
			>
				Find out more
			</AnchorButton>
		</div>
	);
}
OtherProduct.defaultProps = {
	modifierClass: '',
};
