// @flow

import React, { useState } from 'react';

const CsrBanner = () => {
  const [csrEmail, setCsrEmail] = useState("");
  window.addEventListener("message",
    (event) => {
      if (event.origin.startsWith("https://gnmtouchpoint")) {
        console.log(`event data=${JSON.stringify(event.data)} origin=${event.origin}`);
        setCsrEmail(event.data);
      }
    });

  if ( window.location !== window.parent.location ) {
    return <div>You are in customer support mode. Signed in as: {csrEmail}</div>
  } else {
    return null;
  }
}

export default CsrBanner;
