import React from 'react';
import { css } from '@emotion/react';
import { from } from '@guardian/src-foundations/mq';
import { IconRedEarth } from './IconRedEarth';
import { IconBlueEarth } from './IconBlueEarth';

const container = css`
    position: absolute;
    width: 640px;
    height: 640px;
    right: -320px;
    top: -400px;
    img {
        width: 100%;
        display: block;
    }
    clip-path: circle(49%);
	${from.phablet} {
	    width: 720px;
	    height: 720px;
	    right: -360px;
	}
`;

const blueEarthContainer = css`
    @keyframes blue-earth-rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    animation-name: blue-earth-rotate;
    animation-duration: 180s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
`;

const redEarthContainer = css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    mix-blend-mode: screen;
    img {
        opacity: 0.8;
    }
    @keyframes red-earth-rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes red-earth-opacity {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    animation-name: red-earth-rotate, red-earth-opacity;
    animation-duration: 120s, 12s;
    animation-timing-function: linear, linear;
    animation-iteration-count: infinite, infinite;
    animation-direction: normal, alternate;
`;

export const IconEarthContainer: React.FC = () => (
    <div css={container}>
        <div css={blueEarthContainer}>
            <IconBlueEarth />
        </div>
        <div css={redEarthContainer}>
            <IconRedEarth />
        </div>
    </div>
);