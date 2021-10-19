import React from 'react';
import GridImage from 'components/gridImage/gridImage';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import HeroImg from './hero.svg';
import { regionalContent } from './regionalContent';
import './hero.scss';

const Caption = (props: { className: string; captionText: string }) => (
	<div className={props.className}>
		<figcaption className="showcase-hero__caption">
			<p>{props.captionText}</p>
		</figcaption>
	</div>
);

const getCountrySelector = (countryGroupId: CountryGroupId) => {
	switch (countryGroupId) {
		case GBPCountries:
		case EURCountries:
		case International:
		case Canada:
		case NZDCountries:
			return GBPCountries;

		case UnitedStates:
			return UnitedStates;

		case AUDCountries:
			return AUDCountries;

		default:
			return GBPCountries;
	}
};

export default function Hero(props: { countryGroupId: CountryGroupId }) {
	const countrySelector = getCountrySelector(props.countryGroupId);
	return (
		<div className="showcase-hero">
			<figure className="showcase-hero-wrapper">
				<div className="showcase-hero-heading">
					<h1 className="visually-hidden">Support the guardian</h1>
					<h2 className="visually-hidden">
						Help us support investigative independent journalism
					</h2>
					<div className="showcase-hero-heading__image-wrapper">
						<HeroImg />
					</div>
				</div>
				<div className="showcase-hero--left">
					<div className="showcase-hero__image showcase-hero__image--first">
						<Caption
							className="showcase-hero__caption--desktop"
							captionText={regionalContent[countrySelector].caption}
						/>
						<div>
							<GridImage
								gridId={regionalContent[countrySelector].images.first}
								srcSizes={[1000, 500]}
								sizes="(max-width: 740px) 100vw, 400px"
								imgType="jpg"
							/>
						</div>
					</div>
					<div className="showcase-hero__image showcase-hero__image--second">
						<GridImage
							gridId={regionalContent[countrySelector].images.second}
							srcSizes={[1000, 500]}
							sizes="(max-width: 740px) 100vw, 400px"
							imgType="jpg"
						/>
					</div>
				</div>
				<div className="showcase-hero--right">
					<div className="showcase-hero__image showcase-hero__image--third">
						<GridImage
							gridId={regionalContent[countrySelector].images.third}
							srcSizes={[1000, 500]}
							sizes="(max-width: 740px) 100vw, 400px"
							imgType="jpg"
						/>
					</div>
					<div className="showcase-hero__image showcase-hero__image--fourth">
						<GridImage
							gridId={regionalContent[countrySelector].images.fourth}
							srcSizes={[1000, 500]}
							sizes="(max-width: 740px) 100vw, 600px"
							imgType="jpg"
						/>
					</div>
				</div>
				<Caption
					className="showcase-hero__caption--mobile"
					captionTitle={regionalContent[countrySelector].title}
					captionText={regionalContent[countrySelector].caption}
				/>
			</figure>
		</div>
	);
}
