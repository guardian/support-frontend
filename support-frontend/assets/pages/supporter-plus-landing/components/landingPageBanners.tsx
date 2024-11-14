import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold20,
	neutral,
	space,
	textSans15,
	textSans17,
} from '@guardian/source/foundations';
import { NewBenefitPill } from 'components/checkoutBenefits/newBenefitPill';

const container = css`
	display: flex;
	flex-direction: column;
	flex: 1 1;
	background-color: #798baa;
	border-radius: ${space[3]}px;
	margin: ${space[8]}px auto ${space[4]}px;
	gap: 1px;
	${between.tablet.and.desktop} {
		max-width: 340px;
	}
	${from.desktop} {
		background-image: linear-gradient(
			to bottom,
			#1e3e72 0%,
			#1e3e72 5%,
			#798baa 5%,
			#798baa 95%,
			#1e3e72 95%,
			#1e3e72 5%
		); /* creates a partial border line with gap */
		flex-direction: row;
		margin-bottom: 0px;
	}
`;

const containerLandingPageBanner = (orientation: RowLocation) => css`
	flex-basis: 100%; /* Share width & height of the banner with other components */
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background-color: #1e3e72;
	padding: ${orientation === 'right'
		? `${space[6]}px ${space[3]}px 0px ${space[3]}px`
		: `${space[4]}px ${space[3]}px 0px ${space[3]}px`};
	border-radius: ${orientation === 'right'
		? `0px 0px ${space[3]}px ${space[3]}px`
		: `${space[3]}px ${space[3]}px 0px 0px`};
	text-align: left;
	${from.desktop} {
		padding: ${orientation === 'right'
			? `${space[6]}px ${space[6]}px 0px ${space[8]}px`
			: `${space[6]}px ${space[8]}px 0px ${space[6]}px`};
		border-radius: ${orientation === 'right'
			? `0 ${space[3]}px ${space[3]}px 0`
			: `${space[3]}px 0 0 ${space[3]}px`};
	}
`;

const headlineAndParagraph = css`
	margin-bottom: ${space[5]}px;
`;

const headlineText = css`
	color: ${neutral[100]};
	margin-bottom: ${space[2]}px;
	${headlineBold20};
	${from.desktop} {
		margin-bottom: ${space[3]}px;
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
			paragraph="Since 1821, the world’s major events have been documented in the pages of the Guardian’s UK newspaper. Today, you can journey through the archive and search records of world history from wherever you are."
			imageUrl="https://i.guim.co.uk/img/media/2da23eb25095975a62497d19ef9b59dc9fb90eed/0_148_1715_721/1715.png?width=1000&quality=75&s=a435f6c543dbadd3b0bd12ae196a6c7c"
			orientation="right"
		/>
	);
}

function FeastBanner() {
	return (
		<LandingPageBanner
			header="The Guardian Feast app: make a feast out of anything"
			paragraph="With smart features such as cook mode, the ability to search by ingredient, dietary requirement and your favourite Feast cook, the Guardian’s new Feast app makes inspiring mealtimes easy."
			imageUrl="https://i.guim.co.uk/img/media/0229069c0c821b8be5675ab7d28e145732a85d8d/0_0_1454_645/1454.png?width=1000&quality=75&s=a4561f38ab0c025d16efaba8a309d35b"
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
