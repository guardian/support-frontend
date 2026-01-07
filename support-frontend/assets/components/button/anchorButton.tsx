import type {
	ButtonPriority,
	Size,
	ThemeButton,
} from '@guardian/source/react-components';
import {
	Button,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import { anchorButtonStyle } from './anchorButtonStyles';

export default function AnchorButton({
	link,
	ctaButtonText,
	size,
	ariaLabel,
	priority,
	theme,
	onClick,
}: {
	link: string;
	ctaButtonText: string;
	size?: Size;
	ariaLabel?: string;
	priority?: ButtonPriority;
	theme?: Partial<ThemeButton>;
	onClick?: () => void;
}): JSX.Element {
	return (
		<a href={link}>
			<Button
				onClick={onClick}
				aria-label={ariaLabel}
				icon={<SvgArrowRightStraight size="small" />}
				iconSide="right"
				priority={priority}
				theme={theme}
				cssOverrides={anchorButtonStyle}
				size={size}
			>
				{ctaButtonText}
			</Button>
		</a>
	);
}
