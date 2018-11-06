import React from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';

const HEADINGS = [
  'Support',
  'independent',
  'investigative',
  'journalism'
];

const BLOCK_CLASS = "component-plain-introduction";

export default function PlainIntroduction() {
  return (
    <section className={BLOCK_CLASS}>
      <div className={`${BLOCK_CLASS}__content`}>
        <Heading size={1} className={`${BLOCK_CLASS}__heading`}>
          {HEADINGS.map(heading => <span className={`${BLOCK_CLASS}__heading-line`}>{heading}</span>)}
        </Heading>
      </div>
    </section>
  );
}
