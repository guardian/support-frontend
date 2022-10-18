// ----- Imports ----- //
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import CsrBanner from 'components/csr/csrBanner';
import { SkipLink } from 'components/skipLink/skipLink';
import { classNameWithModifiers } from 'helpers/utilities/utilities';

// ----- Types ----- //
type PropTypes = {
	id?: string;
	header: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
	classModifiers: string[];
	backgroundImageSrc?: string;
}; // ----- Component ----- //

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
			<SkipLink id="maincontent" label="Skip to main content" />
			<CsrBanner />
			{props.header}
			<main role="main" id="maincontent" className="gu-content__main">
				{backgroundImage}
				{props.children}
			</main>
			{props.footer}
		</div>
	);
} // ----- Default Props ----- //

Page.defaultProps = {
	classModifiers: [],
};
