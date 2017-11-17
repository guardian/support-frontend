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
    <div className="other-ways-new-design gu-content-filler">
      <div>
        <GridImage
          gridId={props.gridImg}
          srcSizes={[1000, 500, 140]}
          sizes="(max-width: 480px) 100vw, (max-width: 740px) 210px, (max-width: 980px) 220px, 300px"
          altText={props.imgAlt}
        />
      </div>
      <div>
        <h1 className="other-ways-card-new-design__heading">{props.heading}</h1>
        <p className="other-ways-card-new-design__copy">{props.copy}</p>
        <CtaCircle text={props.ctaText} />
      </div>
    </div>
  );

}
