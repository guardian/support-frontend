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
import OfferStrapline from 'components/page/offerStrapline';
import {
	heroCopy,
	heroCssOverrides,
	heroParagraph,
	heroTitle,
} from './HeroHeaderStyles';

export default function HeroHeader({
	heroImage,
	title,
	description,
	roundel,
	ctaText,
	onClick,
}: {
	heroImage: ReactElement<GridImg> | ReactElement<GridPictureProp>;
	roundel?: string;
	title: JSX.Element;
	description: JSX.Element | null;
	ctaText: string;
	onClick: () => void;
}) {
	return (
		<CentredContainer>
			{roundel && <OfferStrapline copy={roundel} size="small" />}
			<Hero
				image={heroImage}
				hideRoundelBelow="mobileMedium"
				cssOverrides={heroCssOverrides}
			>
				<section css={heroCopy}>
					<h2 css={heroTitle}>{title}</h2>
					<p css={heroParagraph}>{description}</p>
					<LinkButton
						onClick={onClick}
						priority="tertiary"
						iconSide="right"
						icon={<SvgArrowDownStraight />}
						href="#HomeDelivery"
						theme={themeButtonBrandAlt}
					>
						{ctaText}
					</LinkButton>
				</section>
			</Hero>
		</CentredContainer>
	);
}
