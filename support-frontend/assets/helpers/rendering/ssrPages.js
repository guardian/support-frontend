// @flow
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { content as showcase } from 'pages/showcase/showcase';
import { EmptyContributionsLandingPage } from 'pages/contributions-landing/EmptyContributionsLandingPage';

import createCache from "@emotion/cache";
import { CacheProvider, css } from "@emotion/react";
import React from "react";

const render = content => renderToString(content);

const key = "foo";
const cache = createCache({ key });
let cssText = "";
cache.sheet.insert = (rule) => {
  console.log("INSERT", rule)
  cssText += rule;
};

const markup = renderToString(
  <CacheProvider value={cache}>
    {/*{EmptyContributionsLandingPage()}*/}
    <div
      css={css`
                  color: hotpink;
                `}
    >
      Content
    </div>
  </CacheProvider>
)
console.log("cssText", cssText)
console.log("sheet", cache.sheet)

export const pages = [
  // {
  //   filename: 'showcase.html',
  //   html: render(showcase),
  // },
  {
    filename: 'contributions-landing.html',
    // html: renderToStaticMarkup(EmptyContributionsLandingPage()),
    html: markup,
  },
];
