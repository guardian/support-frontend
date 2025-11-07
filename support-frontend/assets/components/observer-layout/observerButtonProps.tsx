import {
	type ButtonProps,
	type LinkButtonProps,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';

export function getObserverButtonProps(): ButtonProps & LinkButtonProps {
	return {
		icon: <SvgArrowRightStraight />,
		iconSide: 'right',
		priority: 'primary',
	};
}
