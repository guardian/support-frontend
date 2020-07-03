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

const TestimonialComponent = (props: TestimonialComponentProps) => {
  const city = props.testimonial.city ? `, ${props.testimonial.city}` : '';
  return (
    <div className="testimonial-component">
      <div>
      &#8220;{props.testimonial.body}&#8221;
      </div>
      <div className="testimonial-component-details">
        {props.testimonial.name}
        {city}
      </div>
    </div>
  );
};

const TERRITORY_CODE_TO_FULL_NAME = {
  QLD: 'Queensland',
  NSW: 'New South Wales',
  NT: 'Northern Territory',
  SA: 'South Australia',
  TAS: 'Tasmania',
  VIC: 'Victoria',
  WA: 'Western Australia',
  ACT: 'Australian Capital Territory',
};

type TestimonialsForTerritoryProps = {
  territory: string,
  testimonials: Array<Testimonial>,
  selectedTerritory: string,
}

const TestimonialsForTerritory = (props: TestimonialsForTerritoryProps) => {
  const midPointIndex = Math.ceil(props.testimonials.length / 2) - 1;

  const secondColumn = props.testimonials.slice(midPointIndex + 1).map(testimonial => (
    <TestimonialComponent testimonial={testimonial} />
  ));

  const ctaIndex = secondColumn.length < 5 ? secondColumn.length : 3;

  secondColumn.splice(ctaIndex, 0, <TestimonialCta />);

  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current && props.selectedTerritory === props.territory) {
      // ref.current.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'start',
      // });
    }
  }, [props.selectedTerritory]);


  return (
    <div className="testimonials-for-territory" ref={ref}>
      <h2 className="blurb">
        <span className="selected-territory">{TERRITORY_CODE_TO_FULL_NAME[props.territory]}</span>
        <br />
          Why do you support Guardian&nbsp;Australia?
      </h2>
      <div className="testimonials-columns-container">
        <div className="testimonials-first-column">
          {props.testimonials.slice(0, midPointIndex + 1).map(testimonial => (
            <TestimonialComponent testimonial={testimonial} />
        ))}
        </div>
        <div className="testimonials-second-column">
          {secondColumn}
        </div>
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
      <div className="testimonials-container">
        { Object.keys(props.testimonialsCollection).map(territory => (
          <TestimonialsForTerritory testimonials={props.testimonialsCollection[territory]} territory={territory} selectedTerritory={props.selectedTerritory} />
        ))}
      </div>
    );
  }
  return null;
};
