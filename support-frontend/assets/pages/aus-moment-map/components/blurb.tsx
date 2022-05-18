// ----- Imports ----- //
import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';
import { SocialLinks } from 'pages/aus-moment-map/components/socialLinks';

const mobileTabletOnly = css`
	display: block;
	${from.desktop} {
		display: none;
	}
`;

const desktopOnly = css`
	display: none;
	${from.desktop} {
		display: block;
	}
`;

type PropTypes = {
	slim?: boolean;
};

function getCopyParagraph(desktop = false) {
	return `${
		desktop ? 'Click on the map to read' : 'Read'
	} messages from Guardian supporters across Australia,
	explaining why they were motivated to support our journalism. The
	supporters whose voices are captured here are a sample of the
	hundreds of thousands who now power our work, keeping us fiercely
	independent and open to all. We hope you'll join them in the fight
	for progress.`;
}

// ----- Render ----- //
export function Blurb(props: PropTypes): JSX.Element {
	return (
		<div className="blurb-wrapper">
			<div>
				<h2 className={`blurb ${props.slim ? 'blurb-slim' : ''}`}>
					Our supporters are putting independent journalism on the map
				</h2>
				{!props.slim && (
					<div>
						<p className="blurb" css={mobileTabletOnly}>
							{getCopyParagraph()}
						</p>
						<p className="blurb" css={desktopOnly}>
							{getCopyParagraph(true)}
						</p>
					</div>
				)}
			</div>
			<SocialLinks />
		</div>
	);
}

Blurb.defaultProps = {
	slim: false,
};
