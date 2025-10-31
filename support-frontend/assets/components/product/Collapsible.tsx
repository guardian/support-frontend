import { css } from '@emotion/react';
import { palette, space, textSansBold14 } from '@guardian/source/foundations';
import { SvgChevronDownSingle } from '@guardian/source/react-components';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

const toggleButton = css`
	${textSansBold14}
	display: flex;
	justify-content: center;
	color: ${palette.neutral[38]};
	width: 100%;
	border: none;
	margin-top: ${space[3]}px;

	svg {
		fill: ${palette.neutral[38]};
		margin-left: ${space[1]}px;
	}
`;

const toggleButtonOpen = css`
	svg {
		transform: rotate(180deg);
	}
`;

const content = (height: number) => css`
	display: flex;
	flex-direction: column;
	max-height: ${height}px;
	overflow: hidden;
	transition: max-height 0.5s ease;
`;

export default function Collapsible({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [height, setHeight] = useState(0);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && contentRef.current) {
			setHeight(contentRef.current.scrollHeight);
		} else {
			setHeight(0);
		}
	}, [isOpen]);

	return (
		<>
			<div ref={contentRef} css={content(height)} aria-hidden={!isOpen}>
				{children}
			</div>
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				css={[toggleButton, isOpen && toggleButtonOpen]}
			>
				{isOpen ? 'Hide details' : 'View details'}
				<SvgChevronDownSingle isAnnouncedByScreenReader size="xsmall" />
			</button>
		</>
	);
}
