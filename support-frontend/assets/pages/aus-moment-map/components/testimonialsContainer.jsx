// @flow

import React from 'react';
import { TestimonialsCollection } from 'pages/aus-moment-map/types/testimonials';
import { Testimonial } from '../types/testimonials';

const TestimonialCta = () => (
  <div className="testimonial-cta">
    <h3>Are you a supporter?</h3>
    <p>
    If you’re a contributor or subscriber, we would love to hear from you
    </p>
    <a href="#" target="_blank" rel="noopener noreferrer">
      <div className="button button-cta">Add your message</div>
    </a>
  </div>
);

type TestimonialComponentProps = {
  testimonial: Testimonial
}

const TestimonialComponent = (props: TestimonialComponentProps) => (
  <div className="testimonial-component">
    <div>
      &#8220;{props.testimonial.body}&#8221;
    </div>
    <div className="testimonial-component-details">
      {props.testimonial.name}{', '}
      {props.testimonial.city}
    </div>
  </div>
);

type TestimonialsForTerritoryProps = {
  territory: string,
  testimonials: Array<Testimonial>
}

const TestimonialsForTerritory = (props: TestimonialsForTerritoryProps) => {
  const midPointIndex = Math.ceil(props.testimonials.length / 2) - 1;

  const secondColumn = props.testimonials.slice(midPointIndex + 1).map(testimonial => (
    <TestimonialComponent testimonial={testimonial} />
  ));

  const ctaIndex = secondColumn.length < 5 ? secondColumn.length : 3;

  secondColumn.splice(ctaIndex, 0, <TestimonialCta />);

  return (
    <div className="testimonials-for-territory">
      <div className="testimonials-first-column">
        {props.testimonials.slice(0, midPointIndex + 1).map(testimonial => (
          <TestimonialComponent testimonial={testimonial} />
        ))}
      </div>
      <div className="testimonials-second-column">
        {secondColumn}
      </div>
    </div>
  );

};

type Props = {
  testimonialsCollection: TestimonialsCollection,
  selectedTerritory: string | null,
}

export const TestimonialsContainer = (props: Props) => {
  if (props.selectedTerritory) {
    return (
      <>
        <h2 className="blurb">
          <span className="selected-territory">{props.selectedTerritory}</span>
          <br />
          Why do you support Guardian&nbsp;Australia?
        </h2>
        { Object.keys(props.testimonialsCollection).map(territory => (
          <TestimonialsForTerritory testimonials={props.testimonialsCollection[territory]} territory={territory} />
        ))}
      </>
    );
  }
  return null;
};
