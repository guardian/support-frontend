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
import HeroContainer from 'components/page/hero';
import {
	heroParagraph,
	heroTitle,
	printHeroCssOverrides,
} from './HeroHeaderStyles';

export default function HeroHeader({
	title,
	description,
	roundel,
	heroImage,
	ctaText,
	ctaLink,
	onClick,
	cssOverrides,
}: {
	title: JSX.Element | string;
	description?: JSX.Element | string;
	ctaText: string;
	ctaLink: string;
	onClick: () => void;
	heroImage: ReactElement<GridImg> | ReactElement<GridPictureProp>;
	roundel?: JSX.Element | string;
	cssOverrides?: SerializedStyles;
}) {
	return (
		<CentredContainer cssOverrides={cssOverrides}>
			{roundel}
			<HeroContainer
				imageSlot={heroImage}
				contentSlot={
					<section>
						<h2 css={heroTitle}>{title}</h2>
						{description && <p css={heroParagraph}>{description}</p>}
						<LinkButton
							onClick={() => {
								onClick();
								scrollTo({
									top: document.querySelector(ctaLink)?.getBoundingClientRect()
										.top,
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
				}
				cssOverrides={[printHeroCssOverrides]}
			/>
		</CentredContainer>
	);
}
