// @flow

// ----- Imports ----- //
import React from 'react';
import useSupportersCount from '../hooks/useSupportersCount';

// ----- Render ----- //
export const Testimonials = () => {
  const supportersCount = useSupportersCount();

  return (
    <div>
      <div className="testimonials">
        <h2 className="blurb">Hear from Guardian supporters across Australia</h2>
        <p className="blurb">
          Our supporters are doing something powerful. As our readership grows, more people are supporting Guardian
          journalism than ever before. But what drives this support? We asked readers across every state to share their
          reasons with us – and here is a selection. You can become a supporter this winter and add to the conversation.
        </p>
        <p className="supporters-total">{supportersCount.toLocaleString()}</p>
        <p className="supporters-total-caption">Total supporters in Australia</p>
      </div>
    </div>
  );
};
