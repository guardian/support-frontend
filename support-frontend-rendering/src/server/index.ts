import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import Error, { ErrorProps } from '../pages/error';
import Counter from '../components/Counter';
import html from '../html';

const port = 3000;
const server = express();

server.use(express.static('dist'));
server.use(express.json());

server.post('/error', (req, res) => {
    const props = req.body.page as ErrorProps;

    const body = renderToString(React.createElement(Error, props));
    res.send(
        html({
            body,
        }),
    );
});

server.get('/', (req, res) => {
    const body = renderToString(React.createElement(Counter));

    res.send(
        html({
            body,
            jsPath: 'js/client.js',
        }),
    );
});

server.listen(port, () => console.log('Example app listening on port 3000!'));
