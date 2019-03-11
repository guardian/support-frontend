// @flow

import React from 'react';

import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';

import './hero.scss';

export default function BreakingHeadlines() {
  return (
    <div className="showcase-hero">
      <HeroWrapper appearance="custom">
        <div className="showcase-hero-heading">
          <h1 className="accessibility-hint">Support the guardian</h1>
          <h2 className="__accessibility-hint">Help us support investigative independent journalism</h2>
        </div>
        <figure className="showcase-hero__figure">
          <div className="showcase-hero__image" />
          <div className="showcase-hero__image" />
          <div className="showcase-hero__image" />
          <div className="showcase-hero__image" />
          <figcaption className="showcase-hero__caption">
            <strong>Windrush scandal</strong>
            <p>sadsadgy gyuugyf ghugyftg hgftg hgyuftg hugiyft guhigy huhiyhu fygu igyfgi uyf giyft yg </p>
          </figcaption>
        </figure>
      </HeroWrapper>
    </div>
  );
}
