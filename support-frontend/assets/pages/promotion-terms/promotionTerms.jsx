// @flow

import { renderPage } from 'helpers/render';
import React from 'react';
import { statelessInit } from 'helpers/page/page';
import './promotionTerms.scss';

statelessInit();

// ----- Render ----- //

const content = (
  <div>Hello</div>
);

renderPage(content, 'promotion-terms');

