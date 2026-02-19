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
	heroCssOverrides,
	heroParagraph,
	heroTitle,
} from './HeroHeaderStyles';

export default function HeroHeader({
	title,
	description,
	roundel,
	heroImage,
	ctaText,
	ctaLink,
	onClick,
}: {
	title: JSX.Element | string;
	ctaText: string;
	ctaLink: string;
	onClick: () => void;
	heroImage: ReactElement<GridImg> | ReactElement<GridPictureProp>;
	roundel?: JSX.Element;
	description?: JSX.Element | string;
}) {
	return (
		<CentredContainer>
			{roundel && roundel}
			<Hero
				image={heroImage}
				hideRoundelBelow="mobileMedium"
				cssOverrides={heroCssOverrides}
			>
				<section css={heroCopy}>
					<h2 css={heroTitle}>{title}</h2>
					{description && <p css={heroParagraph}>{description}</p>}
					<LinkButton
						onClick={onClick}
						priority="tertiary"
						iconSide="right"
						icon={<SvgArrowDownStraight />}
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
