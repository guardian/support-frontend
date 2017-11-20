// @flow

// ----- Imports ----- //

import React from 'react';

import CtaCircle from 'components/ctaCircle/ctaCircle';
import GridImage from 'components/gridImage/gridImage';

import type { ImageId } from 'helpers/theGrid';


// ----- Props ----- //

type PropTypes = {
  heading: string,
  copy: string,
  ctaText: string,
  gridImg: ImageId,
  imgAlt: ?string,
};


// ----- Component ----- //

export default function OtherWaysCard(props: PropTypes) {

  return (
    <div className="other-ways-card-new-design gu-content-filler">
      <div className="other-ways-card-new-design__image">
        <GridImage
          gridId={props.gridImg}
          srcSizes={[1000, 500, 140]}
          sizes="(max-width: 480px) 90vw, (max-width: 660px) 400px, 270px"
          altText={props.imgAlt}
        />
      </div>
      <div className="other-ways-card-new-design__description">
        <h1 className="other-ways-card-new-design__heading">{props.heading}</h1>
        <p className="other-ways-card-new-design__copy">{props.copy}</p>
        <CtaCircle text={props.ctaText} />
      </div>
    </div>
  );

}
