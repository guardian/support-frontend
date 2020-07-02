// @flow

import React from 'react';
import { TestimonialsCollection } from 'pages/aus-moment-map/types/testimonials';

type Props = {
  testimonialsCollection: TestimonialsCollection,
  selectedTerritory: string | null,
}

export const Testimonials = (props: Props) => {
  if (props.selectedTerritory) {
    return (
      <>
        <h2 className="blurb">
          <span className="selected-territory">{props.selectedTerritory}</span>
          <br/>
          Why do you support Guardian&nbsp;Australia?
        </h2>
        <div className="testimonials-wrapper"/>
      </>
    )
  }
  return null;
};
