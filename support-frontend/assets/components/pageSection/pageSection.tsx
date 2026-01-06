import type { SerializedStyles } from '@emotion/react';
import type { ReactNode } from 'react';
import {
	bodyStyles,
	headerStyles,
	headingStyles,
	sectionStyles,
} from './pageSectionStyles';

export default function PageSection({
	heading,
	children,
	cssOverrides,
}: {
	heading?: string;
	children?: ReactNode;
	cssOverrides?: SerializedStyles;
}): JSX.Element {
	return (
		<section css={sectionStyles}>
			<div css={cssOverrides}>
				<div css={headerStyles}>
					{heading && <h2 css={headingStyles}>{heading}</h2>}
				</div>
				<div css={bodyStyles}>{children}</div>
			</div>
		</section>
	);
}
