// ----- Imports ----- //
import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';
import * as React from 'preact/compat';
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

const enableSupporterCount = true as boolean;

const useSupportersCount = () => {
	const [supportersCount, setSupportersCount] = React.useState(0);
	const supportersCountEndpoint = '/supporters-ticker.json';

	React.useEffect(() => {
		if (enableSupporterCount) {
			void fetch(supportersCountEndpoint)
				.then((response) => response.json())
				.then((data: { total: number }) => setSupportersCount(data.total));
		}
	}, []);
	return supportersCount;
};

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
	const supportersCount = useSupportersCount();
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
						{enableSupporterCount && (
							<>
								<p className="supporters-total">
									{supportersCount.toLocaleString()}
								</p>
								<p className="supporters-total-caption">
									Total supporters in Australia
								</p>
							</>
						)}
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
