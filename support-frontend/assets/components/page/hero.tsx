import type { SerializedStyles } from '@emotion/react';
import type { ReactElement, ReactNode } from 'react';
import { contentStyles, hero, ImageStyles } from './heroStyles';

function HeroSkeleton({
	contentSlot,
	imageSlot,
	cssOverrides,
	heroDirection,
}: {
	imageSlot: ReactNode;
	contentSlot: ReactNode;
	cssOverrides?: SerializedStyles | SerializedStyles[];
	heroDirection?: 'row-reverse';
}): ReactElement {
	return (
		<div css={[hero(heroDirection), cssOverrides]}>
			<div css={contentStyles}>{contentSlot}</div>
			<div css={ImageStyles}>{imageSlot}</div>
		</div>
	);
}

export default HeroSkeleton;
