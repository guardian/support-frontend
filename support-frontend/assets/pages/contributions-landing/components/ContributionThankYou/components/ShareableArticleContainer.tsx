import { css } from '@emotion/core';
import { LinkButton } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { until } from '@guardian/src-foundations/mq';
import { neutral, news } from '@guardian/src-foundations/palette';
import { headline } from '@guardian/src-foundations/typography';
import { SvgEnvelope, SvgFacebook, SvgTwitter } from '@guardian/src-icons';
import React from 'react';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import {
	OPHAN_COMPONENT_ID_SOCIAL_EMAIL,
	OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK,
	OPHAN_COMPONENT_ID_SOCIAL_TWITTER,
} from '../utils/ophan';
// Styles ///////////////////////////////////////////////////////////
const outerContainer = css`
	display: flex;
	flex-direction: column;
	margin-top: ${space[6]}px;
`;
const innerContainer = css`
	display: flex;
	flex-direction: row;
	border-top: 1px solid ${news[400]};
	background-color: ${neutral[97]};
`;
const genericButtonContainer = css`
	margin-top: ${space[4]}px;
	margin-left: ${space[2]}px;

	& > * {
		margin-bottom: ${space[2]}px;
		margin-right: ${space[2]}px;
	}
`;
const wideButtonsContainer = css`
	${genericButtonContainer}
	display: block;

	${until.phablet} {
		display: none;
	}
`;
const narrowButtonsContainer = css`
	${genericButtonContainer}
	display: none;

	${until.phablet} {
		display: block;
	}
`;
const headlineText = css`
	text-decoration: none;
	cursor: pointer;
	display: inline-block;
	color: ${neutral[7]};
	${headline.xxxsmall({
		lineHeight: 'tight',
	})};
	font-weight: 600 !important;
`;
const button = css`
	border: 1px solid ${neutral[86]};
	color: ${news[400]};
`;
const imageContainer = css`
	max-width: 45%;
	padding: ${space[2]}px;

	${until.phablet} {
		padding: ${space[1]}px;
	}
`;
const image = css`
	width: 100% !important;
	width: 100% !important;
`;
const headlineAndButtonsContainer = css`
	padding: ${space[2]}px ${space[2]}px ${space[2]}px 0;

	${until.phablet} {
		padding: ${space[1]}px ${space[1]}px ${space[1]}px 0;
	}
`;
// Helpers //////////////////////////////////////////////////////////
const INTCMP = 'enviro_moment_2020_thankyou_share';

const appendIntcmpAndEncodeUrl = (
	unencodedUrl: string,
	platform: 'facebook' | 'email' | 'twitter',
) => encodeURI(`${unencodedUrl}?INTCMP=${INTCMP}_${platform}`);

const facebookShareLink = (articleUrl: string) =>
	`https://www.facebook.com/sharer/sharer.php?u=${appendIntcmpAndEncodeUrl(
		articleUrl,
		'facebook',
	)}`;

const twitterShareLink = (articleUrl: string) =>
	`https://twitter.com/intent/tweet?url=${appendIntcmpAndEncodeUrl(
		articleUrl,
		'twitter',
	)}`;

const emailShareLink = (articleUrl: string) =>
	`mailto:?body=${appendIntcmpAndEncodeUrl(articleUrl, 'email')}`;

const shareButtonsContainer = (styles: string, articleUrl: string) => (
	<div css={styles}>
		<LinkButton
			href={facebookShareLink(articleUrl)}
			onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK)}
			target="_blank"
			rel="noopener noreferrer"
			priority="tertiary"
			size="default"
			icon={<SvgFacebook />}
			css={button}
			hideLabel
		/>
		<LinkButton
			href={twitterShareLink(articleUrl)}
			onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_TWITTER)}
			target="_blank"
			rel="noopener noreferrer"
			priority="tertiary"
			size="default"
			icon={<SvgTwitter />}
			css={button}
			hideLabel
		/>
		<LinkButton
			href={emailShareLink(articleUrl)}
			onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_EMAIL)}
			target="_blank"
			rel="noopener noreferrer"
			priority="tertiary"
			size="default"
			icon={<SvgEnvelope />}
			css={button}
			hideLabel
		/>
	</div>
);

// Types ////////////////////////////////////////////////////////////
type PropTypes = {
	articleUrl: string;
	headline: string;
	imageUrl: string;
	imageAltText: string;
};

// Component ////////////////////////////////////////////////////////
const ShareableArticleContainer = (props: PropTypes) => (
	<div css={outerContainer}>
		<div css={innerContainer}>
			<div css={imageContainer}>
				<a href={props.articleUrl} target="_blank" rel="noopener noreferrer">
					<img css={image} src={props.imageUrl} alt={props.imageAltText} />
				</a>
			</div>
			<div css={headlineAndButtonsContainer}>
				<a
					href={props.articleUrl}
					css={headlineText}
					target="_blank"
					rel="noopener noreferrer"
				>
					{props.headline}
				</a>
				{shareButtonsContainer(wideButtonsContainer, props.articleUrl)}
			</div>
		</div>
		{shareButtonsContainer(narrowButtonsContainer, props.articleUrl)}
	</div>
);

export default ShareableArticleContainer;
