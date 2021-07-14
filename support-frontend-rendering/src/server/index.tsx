import React from 'react';
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import { renderToString } from 'react-dom/server';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import Page from '../pages/Page';
import Error, { ErrorProps } from '../pages/error';
import WeeklyLandingPage from '../pages/weekly';
import htmlTemplate from '../html';

const port = 3000;
const server = express();

const key = 'support';
const cache = createCache({ key });
const { extractCritical } = createEmotionServer(cache);

server.use(
    '/',
    expressStaticGzip('dist', {
        enableBrotli: false,
    }),
);
server.use(express.json());

server.post('/error', (req, res) => {
    const props = req.body.page as ErrorProps;

    const { html, css, ids } = extractCritical(
        renderToString(
            <CacheProvider value={cache}>
                <Page />
                <Error {...props} />
            </CacheProvider>,
        ),
    );
    res.send(
        htmlTemplate({
            html,
            title: `Error ${props.errorCode}`,
            key,
            css,
            ids,
        }),
    );
});

server.post('/weekly', (req, res) => {
    const props = req.body.page;
    props.prices = JSON.parse(props.prices);

    const { html, css, ids } = extractCritical(
        renderToString(
            <CacheProvider value={cache}>
                <Page />
                <WeeklyLandingPage {...props} />
            </CacheProvider>,
        ),
    );
    res.send(
        htmlTemplate({
            html,
            title: 'The Guardian Weekly',
            key,
            css,
            ids,
        }),
    );
});

server.listen(port, () => console.log('Server listening on port 3000!'));
