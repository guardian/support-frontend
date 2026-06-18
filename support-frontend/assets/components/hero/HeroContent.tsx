import type { SerializedStyles } from '@emotion/react';
import {
	LinkButton,
	SvgArrowDownStraight,
	themeButtonBrandAlt,
} from '@guardian/source/react-components';
import { heroParagraph, heroTitle } from './HeroContentStyles';

export default function HeroContent({
	title,
	description,
	ctaText,
	ctaLink,
	onClick,
}: {
	title: JSX.Element | string;
	description?: JSX.Element | string;
	ctaText: string;
	ctaLink: string;
	onClick: () => void;
	roundel?: JSX.Element | string;
	cssOverrides?: SerializedStyles;
}) {
	return (
		<section>
			<h2 css={heroTitle}>{title}</h2>
			{description && <p css={heroParagraph}>{description}</p>}
			<LinkButton
				onClick={() => {
					onClick();
					scrollTo({
						top: document.querySelector(ctaLink)?.getBoundingClientRect().top,
						behavior: 'smooth',
					});
				}}
				priority="tertiary"
				iconSide="right"
				icon={<SvgArrowDownStraight />}
				theme={themeButtonBrandAlt}
			>
				{ctaText}
			</LinkButton>
		</section>
	);
}
