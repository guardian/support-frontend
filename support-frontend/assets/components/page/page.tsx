// ----- Imports ----- //
import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import CsrBanner from 'components/csr/csrBanner';
import { classNameWithModifiers } from 'helpers/utilities/utilities';

// ----- Types ----- //
type PropTypes = {
	id: string | undefined;
	header: ReactNode;
	footer: ReactNode | null;
	children: ReactNode;
	classModifiers: Array<string | null | undefined>;
	backgroundImageSrc: string | null | undefined;
};

// ----- Component ----- //
export default function Page(props: PropTypes): JSX.Element {
	const backgroundImage = props.backgroundImageSrc ? (
		<div className="background-image-container">
			<img
				className="background-image"
				alt="landing page background illustration"
				src={props.backgroundImageSrc}
			/>
		</div>
	) : null;
	useEffect(() => {
		requestAnimationFrame(() => {
			if (window.location.hash) {
				const hashElement = document.getElementById(
					window.location.hash.substr(1),
				);

				if (hashElement) {
					hashElement.scrollIntoView();
				}
			}
		});
	}, []);
	return (
		<div
			id={props.id}
			className={classNameWithModifiers('gu-content', props.classModifiers)}
		>
			<CsrBanner />
			{props.header}
			<main role="main" className="gu-content__main">
				{backgroundImage}
				{props.children}
			</main>
			{props.footer}
		</div>
	);
} // ----- Default Props ----- //

Page.defaultProps = {
	id: null,
	footer: null,
	classModifiers: [],
	backgroundImageSrc: null,
};
