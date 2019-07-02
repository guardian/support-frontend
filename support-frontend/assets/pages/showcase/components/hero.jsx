// @flow

import React from 'react';

import { GBPCountries, AUDCountries, Canada, EURCountries, International, NZDCountries, UnitedStates } from 'helpers/internationalisation/countryGroup';
import GridImage from 'components/gridImage/gridImage';
import { regionalContent } from './regionalContent';
import HeroImg from './hero.svg';
import './hero.scss';

const Caption = (props: { className: string, captionTitle: String, captionText: String }) => (
  <div className={props.className}>
    <figcaption className="showcase-hero__caption">
      <strong>{props.captionTitle}</strong>
      <p>{props.captionText}</p>
    </figcaption>
  </div>
);

const getCountrySelector = (country: String) => {
  switch (country) {
    case GBPCountries:
    case EURCountries:
    case International:
    case Canada:
    case NZDCountries:
      return 'ukContent';
    case UnitedStates:
      return 'usContent';
    case AUDCountries:
      return 'auContent';
    default:
      return 'ukContent';
  }
};

export default function Hero(props: { country: String }) {
  const countrySelector = getCountrySelector(props.country);

  return (
    <div className="showcase-hero">
      <figure className="showcase-hero-wrapper">
        <div className="showcase-hero-heading">
          <h1 className="accessibility-hint">Support the guardian</h1>
          <h2 className="accessibility-hint">Help us support investigative independent journalism</h2>
          <HeroImg />
        </div>
        <div className="showcase-hero--left">
          <div className="showcase-hero__image showcase-hero__image--first">
            <Caption
              className="showcase-hero__caption--desktop"
              captionTitle={regionalContent[countrySelector].title}
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
