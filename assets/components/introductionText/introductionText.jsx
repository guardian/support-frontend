// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

export type Message = {
  heading: string,
  copy: string[],
};

/* eslint-enable react/no-unused-prop-types */

type PropTypes = {
  messages: Message[],
};


// ----- Functions ----- //

function messageCopy(copy: string[]) {
  return copy.map(paragraph => <h2>{paragraph}</h2>);
}


// ----- Component ----- //

export default function IntroductionText(props: PropTypes) {

  const messages = props.messages.map((message: Message) => (
    <div>
      <h1 className="component-introduction-text__heading">{message.heading}</h1>
      {messageCopy(message.copy)}
    </div>
  ));

  return (
    <section className="component-introduction-text">
      <div className="component-introduction-text__content gu-content-margin">
        {messages}
      </div>
    </section>
  );

}
