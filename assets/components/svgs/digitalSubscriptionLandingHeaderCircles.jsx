// @flow

// ----- Imports ----- //

import React from 'react';


// ----- SVG ----- //

export function CirclesLeft() {
    return (
        <div>
            <svg
                className="svg-title-circles-left-mobile"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 144 158"
                preserveAspectRatio="xMinYMid"
            >
                <circle cx="96" cy="48" r="48" fill="#ffe501" />
                <circle cx="28" cy="82" r="28" fill="#dcdcdc" />
                <circle cx="71" cy="125" r="33" fill="#00b2ff" />
            </svg>
            <svg
                className="svg-title-circles-left-tablet"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 356 417"
                preserveAspectRatio="xMinYMid"
            >
                <circle cx="48" cy="221" r="35" fill="#ffe501" />
                <circle cx="211" cy="146" r="145" fill="#ff7f0f" />
                <circle cx="83" cy="334" r="83" fill="#ffabdb" />
            </svg>
        </div>
    );
}

export function CirclesRight() {
    return (
        <div>
            <svg
                className="svg-title-circles-right-mobile"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 74 144"
                preserveAspectRatio="xMinYMid"
            >
                <circle cx="50" cy="38" r="18" fill="#ffe501" />
                <circle cx="5" cy="28" r="28" fill="#dcdcdc" />
                <circle cx="28" cy="98" r="46" fill="#ffabdb" />
            </svg>
            <svg
                className="svg-title-circles-right-tablet"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 167 234"
                preserveAspectRatio="xMinYMid"
            >
                <circle cx="58" cy="35" r="35" fill="#00b2ff" />
                <circle cx="83" cy="150" r="83" fill="#ffef01" />
            </svg>
        </div>
    );
}