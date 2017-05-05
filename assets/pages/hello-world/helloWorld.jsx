import React from 'react';
import ReactDOM from 'react-dom';

import GridImage from 'components/gridImage/gridImage';

const app = document.getElementById('app');

const page = (
  <div>
    <h1>Hello World!!!</h1>
    <GridImage
      gridId="137d6b217a27acddf85512657d04f6490b9e0bb1/1638_0_3571_2009"
      altText="the Guardian and the Observer"
      srcSizes={[1000, 500, 140]}
      sizes="(min-width: 800px) 50vw, 100vw"
    />
  </div>
);

ReactDOM.render(page, app);
