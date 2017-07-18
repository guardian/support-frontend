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
  return copy.map(para => <p>{para}</p>);
}


// ----- Component ----- //

export default function IntroductionText(props: PropTypes) {

  const messages = props.messages.map((message: Message) => (
    <div className="component-introduction-text__content gu-content-margin">
      <h1 className="component-introduction-text__heading">{message.heading}</h1>
      {messageCopy(message.copy)}
    </div>
  ));

  return (
    <section className="component-introduction-text">
      {messages}
    </section>
  );

}
