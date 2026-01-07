import type { SerializedStyles } from '@emotion/utils';
import type { ReactNode } from 'react';

export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;
type PropTypes = {
	size: HeadingSize;
	cssOverrides: SerializedStyles;
	children: ReactNode;
};

export default function Heading({
	size,
	cssOverrides,
	children,
}: PropTypes): JSX.Element {
	switch (size) {
		case 1:
			return <h1 css={cssOverrides}>{children}</h1>;

		case 2:
			return <h2 css={cssOverrides}>{children}</h2>;

		case 3:
			return <h3 css={cssOverrides}>{children}</h3>;

		case 4:
			return <h4 css={cssOverrides}>{children}</h4>;

		case 5:
			return <h5 css={cssOverrides}>{children}</h5>;

		case 6:
		default:
			return <h6 css={cssOverrides}>{children}</h6>;
	}
}
