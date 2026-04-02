import type { SerializedStyles } from '@emotion/react';
import {
	LinkButton,
	SvgArrowDownStraight,
	themeButtonBrandAlt,
} from '@guardian/source/react-components';
import type { ReactElement } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import type { GridImg } from 'components/gridImage/gridImage';
import type { GridPictureProp } from 'components/gridPicture/gridPicture';
import Hero from 'components/page/hero';
import {
	heroCopy,
	heroParagraph,
	heroSubTitle,
	heroTitle,
	printHeroCssOverrides,
} from './HeroHeaderStyles';

export default function HeroHeader({
	title,
	subTitle,
	description,
	roundel,
	heroImage,
	ctaText,
	ctaLink,
	ctaIcon = <SvgArrowDownStraight />,
	onClick,
	cssOverrides,
}: {
	title: JSX.Element | string;
	subTitle?: JSX.Element | string;
	description?: JSX.Element | string;
	ctaText: string;
	ctaLink: string;
	ctaIcon?: JSX.Element;
	onClick: () => void;
	heroImage: ReactElement<GridImg> | ReactElement<GridPictureProp>;
	roundel?: JSX.Element | string;
	cssOverrides?: SerializedStyles;
}) {
	const containsHashSelector = ctaLink.includes('#');
	return (
		<CentredContainer cssOverrides={cssOverrides}>
			{roundel}
			<Hero
				image={heroImage}
				hideRoundelBelow="mobileMedium"
				cssOverrides={[printHeroCssOverrides]}
			>
				<section css={heroCopy}>
					<h2 css={heroTitle(!!subTitle)}>{title}</h2>
					{subTitle && <p css={heroSubTitle}>{subTitle}</p>}
					{description && <p css={heroParagraph}>{description}</p>}
					<LinkButton
						onClick={() => {
							onClick();
							if (containsHashSelector) {
								scrollTo({
									top: document.querySelector(ctaLink)?.getBoundingClientRect()
										.top,
									behavior: 'smooth',
								});
							}
						}}
						priority="tertiary"
						iconSide="right"
						icon={ctaIcon}
						href={ctaLink}
						theme={themeButtonBrandAlt}
					>
						{ctaText}
					</LinkButton>
				</section>
			</Hero>
		</CentredContainer>
	);
}
