// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';

import DoubleHeading from 'shared-components/doubleHeading';


// ----- Render ----- //

const content = (
  <DoubleHeading
    heading="£11.99/month"
    subheading="Become a digital subscriber"
  />
);

ReactDOM.render(content, document.getElementById('app'));
