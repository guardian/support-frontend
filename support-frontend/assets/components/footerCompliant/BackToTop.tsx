import { css } from '@emotion/react';
import {
	brandAlt,
	palette,
	textSansBold15,
} from '@guardian/source/foundations';

const iconHeight = '42px';
const iconContainer = css`
	position: relative;
	float: right;
	border-radius: 100%;
	background-color: ${palette.neutral[100]};
	cursor: pointer;
	height: ${iconHeight};
	min-width: ${iconHeight};
`;
const icon = css`
	:before {
		position: absolute;
		top: 6px;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		border: 2px solid ${palette.brand[400]};
		border-bottom: 0;
		border-right: 0;
		content: '';
		height: 12px;
		width: 12px;
		transform: rotate(45deg);
	}
`;
const link = css`
	text-decoration: none;
	color: ${palette.brand[100]};
	font-weight: bold;
	line-height: ${iconHeight};
	:hover {
		color: ${brandAlt[400]};
		text-decoration: none;
		& .css-${iconContainer.name} {
			background-color: ${brandAlt[400]};
		}
	}
`;
const textStyles = css`
	${textSansBold15};
	padding-right: 5px;
`;
export function BackToTop(): JSX.Element {
	return (
		<a css={link} href="#top">
			<span css={textStyles}>Back to top</span>
			<span css={iconContainer}>
				<i css={icon} />
			</span>
		</a>
	);
}
