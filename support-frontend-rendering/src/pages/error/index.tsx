import React from 'react';

export type ErrorProps = {
    errorCode: string;
    subHeading: string;
    copy: string;
    reportLink?: boolean;
};

// ----- Component ----- //

export default function ErrorPage({ errorCode, subHeading, copy }: ErrorProps): React.ReactElement {
    return (
        <section>
            <h1>Error {errorCode}</h1>
            <h2>{subHeading}</h2>
            <p>{copy}</p>
        </section>
    );
}

ErrorPage.defaultProps = {
    reportLink: false,
};
