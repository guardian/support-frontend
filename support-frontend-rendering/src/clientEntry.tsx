import React from 'react';
import ReactDOM from 'react-dom';

import Error from './pages/error';
declare global {
    interface Window {
        __STATE__: any;
    }
}

window.__STATE__ = window.__STATE__ || {};

const pageProps = window.__STATE__?.page;
delete window.__STATE__;

ReactDOM.render(<Error {...pageProps} />, document.getElementById('root'));
