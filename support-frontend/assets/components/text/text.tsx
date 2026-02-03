import type { ReactNode } from 'react';
import {
	largeParagraphStyle,
	sansParagraphStyle,
	textContainer,
	titleContainer,
} from './textStyles';

type ChildrenProp = { children: ReactNode };
export default function Text({ children }: ChildrenProp): JSX.Element {
	return <div css={textContainer}>{children}</div>;
}
export function Title({ children }: ChildrenProp): JSX.Element {
	return <h1 css={titleContainer}>{children}</h1>;
}
export function LargeParagraph({ children }: ChildrenProp): JSX.Element {
	return <p css={largeParagraphStyle}>{children}</p>;
}
export function SansParagraph({ children }: ChildrenProp): JSX.Element {
	return <p css={sansParagraphStyle}>{children}</p>;
}
