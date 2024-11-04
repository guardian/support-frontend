import { css } from '@emotion/react';
import {
	from,
	headlineBold20,
	headlineBold24,
	neutral,
	palette,
	space,
	textSans15,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { NewBenefitPill } from 'components/checkoutBenefits/newBenefitPill';

const container = css`
	display: flex;
	flex: 1 1;
	background-color: #1e3e72;
	background-image: linear-gradient(
		to bottom,
		#1e3e72 0%,
		#1e3e72 5%,
		${palette.neutral[60]} 5%,
		${palette.neutral[60]} 95%,
		#1e3e72 95%,
		#1e3e72 5%
	); /* creates a partial border line with gap */
	gap: 1px;

	${until.desktop} {
		margin: ${space[9]}px -10px 0;
		padding-bottom: 0;
	}
	${from.desktop} {
		margin-top: ${space[8]}px;
		border-radius: ${space[3]}px;
	}
`;

const containerLandingPageBanner = (orientation: RowLocation) => css`
	flex-basis: 100%; /* Share width & height of the banner with other components */
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	background-color: #1e3e72;
	padding: ${space[4]}px ${space[4]}px 0px ${space[4]}px;
	text-align: left;
	border-radius: 0px;

	${from.desktop} {
		flex-direction: column;
		border-radius: ${orientation === 'right'
			? `0 ${space[3]}px ${space[3]}px 0`
			: `${space[3]}px 0 0 ${space[3]}px`};
	}
`;

const headlineAndParagraph = css`
	margin-bottom: auto;
`;

const headlineText = css`
	color: ${neutral[100]};
	margin-bottom: ${space[3]}px;

	${headlineBold20};
	${from.desktop} {
		${headlineBold24};
	}

	& div {
		display: none;
		${from.desktop} {
			display: inline;
			margin-left: 1px;
		}
	}
`;

const paragraphText = css`
	${textSans15};
	${from.desktop} {
		${textSans17};
	}
	color: ${neutral[100]};
`;

const image = css`
	width: 100%;
	object-fit: contain;
	align-items: bottom;
`;

type RowLocation = 'left' | 'right';

type LandingPageBannerProps = {
	header: string;
	paragraph: string;
	imageUrl: string;
	orientation: RowLocation;
};

function LandingPageBanner({
	header,
	paragraph,
	imageUrl,
	orientation,
}: LandingPageBannerProps): JSX.Element {
	return (
		<div css={containerLandingPageBanner(orientation)}>
			<div css={headlineAndParagraph}>
				<h2 css={headlineText}>
					<>
						<NewBenefitPill />{' '}
					</>
					{header}
				</h2>
				<p css={paragraphText}>{paragraph}</p>
			</div>
			<img css={image} alt="" src={imageUrl} />
		</div>
	);
}

function NewspaperArchiveBanner() {
	return (
		<LandingPageBanner
			header="The Guardian newspaper archive: explore more than 200 years of journalism"
			paragraph="Since 1821, the world's major events have been documented in the pages of the Guardian. Today, you can search through and view that record of history with access to the Guardian archives."
			imageUrl="https://i.guim.co.uk/img/media/6a10c564d225dc23d3a24098a033464769740f01/0_0_1781_868/1000.png?width=1000&quality=75&s=16aec938fdd59f7a23f14fa7131fe554"
			orientation="right"
		/>
	);
}

function FeastBanner() {
	return (
		<LandingPageBanner
			header="Unlimited access to the Guardian Feast App"
			paragraph="Make a feast out of anything with the Guardian’s new recipe app. Feast
					has thousands of recipes including quick and budget-friendly weeknight
					dinners, and showstopping weekend dishes – plus smart app features to
					make mealtimes inspiring."
			imageUrl="https://i.guim.co.uk/img/media/0229069c0c821b8be5675ab7d28e145732a85d8d/0_0_1529_645/1000.png?width=1000&quality=75&s=d2881465ddca62054b9b8ba65682fff6"
			orientation="left"
		/>
	);
}

export function LandingPageBanners() {
	return (
		<div css={container}>
			<FeastBanner />
			<NewspaperArchiveBanner />
		</div>
	);
}
