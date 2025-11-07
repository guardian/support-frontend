import {
	type ButtonProps,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';

export function getObserverButtonProps(): ButtonProps {
	return {
		icon: <SvgArrowRightStraight />,
		iconSide: 'right',
	};
}
