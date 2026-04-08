import type { SerializedStyles } from '@emotion/react';
import type { ReactElement, ReactNode } from 'react';
import {
	containerStyles,
	contentSlotStyles,
	imageSlotStyles,
} from './heroStyles';

function HeroContainer({
	contentSlot,
	imageSlot,
	cssOverrides,
	heroDirection = 'default',
	imagePosition = 'float',
}: {
	imageSlot: ReactNode;
	contentSlot: ReactNode;
	cssOverrides?: SerializedStyles | SerializedStyles[];
	heroDirection?: 'reverse' | 'default';
	imagePosition?: 'float' | 'bottom';
}): ReactElement {
	return (
		<div css={[containerStyles(heroDirection), cssOverrides]}>
			<div css={contentSlotStyles}>{contentSlot}</div>
			<div css={[imageSlotStyles(imagePosition)]}>{imageSlot}</div>
		</div>
	);
}

export default HeroContainer;
