/* eslint-disable no-unused-expressions */

/* eslint-disable react/require-default-props */
// --- Imports --- //
// @ts-expect-error - required for hooks
import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { Button, ButtonLink } from '@guardian/source-react-components';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { trackComponentClick } from 'helpers/tracking/behaviour';
// --- Styles --- //
const topContainerMobile = css`
	display: flex;
	flex-direction: column-reverse;

	${from.tablet} {
		display: none;
	}
`;
const topContainerDesktop = css`
	display: flex;
	flex-direction: column-reverse;
	${until.tablet} {
		display: none;
	}
`;
const articleCountAboveContainerStyles = css`
	${headline.xxsmall({
		fontWeight: 'bold',
	})};

	${from.tablet} {
		${headline.large({
			fontWeight: 'bold',
		})};
	}
`;
const articleCountHeaderContainerStyles = css`
	display: flex;
	justify-content: space-between;
	flex-direction: column-reverse;
	align-items: flex-start;
	padding-bottom: ${space[6]}px;

	${from.tablet} {
		flex-direction: column-reverse;
		align-items: baseline;
	}
`;
const articleCountWrapperStyles = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: ${space[2]}px;
	margin-bottom: ${space[2]}px;
	justify-content: start;

	${from.tablet} {
		justify-content: flex-end;
	}
`;
const articleCountTextStyles = css`
	${textSans.xsmall()};
	margin-right: ${space[1]}px;

	${from.tablet} {
		${textSans.small()};
	}
`;
const articleCountCtaStyles = css`
	${textSans.xsmall({
		fontWeight: 'bold',
	})};

	${from.tablet} {
		${textSans.small({
			fontWeight: 'bold',
		})};
	}
`;
const articleCountDescriptionTopContainerStyles = css`
	border-bottom: 1px solid ${palette.neutral[46]};
	position: relative;
	margin-bottom: ${space[3]}px;

	${from.tablet} {
		margin-top: ${space[4]}px;
		border-bottom: 1px solid ${palette.neutral[0]};
	}
`;
const articleCountDescriptionContainer = css`
	align-items: center;
	display: flex;
	flex-direction: column;
	padding: ${space[1]}px ${space[1]}px 0;

	${from.tablet} {
		padding: ${space[1]}px 0;
		align-items: start;
		margin-top: ${space[1]}px;
	}
`;
const articleCountBodyTextStyles = css`
	${textSans.small()};
	width: 100%;
	line-height: 20.25px;

	${from.tablet} {
		width: 96%;
	}
`;
const articleCountCtasContainerStyles = css`
	display: flex;
	align-self: start;
	margin-top: ${space[4]}px;
	> * + * {
		margin-left: ${space[3]}px;
	}

	${from.tablet} {
		flex-direction: row;
		justify-content: space-between;
		width: 80%;
		> * + * {
			margin-left: 0;
		}
	}
`;
const articleCountOptInCtaStyles = css`
	background-color: ${palette.neutral[0]};
	padding: 0 ${space[4]}px;
`;
const articleCountDefaultCtaStyles = css`
	background-color: ${brand[400]};
	padding: auto ${space[4]}px;
`;
const articleCountOptOutCtaStyles = css`
	color: ${palette.neutral[0]};
	border: 1px solid ${palette.neutral[0]};
	${from.tablet} {
		margin: 0;
	}
`;
const trackingSettingsContainerStyles = css`
	margin: ${space[4]}px auto ${space[3]}px;
	${textSans.xsmall()};

	${from.tablet} {
		${textSans.xsmall()};
	}
`;
const privacySettingsLinkStyles = css`
	${textSans.xsmall({
		fontWeight: 'bold',
	})};

	${from.tablet} {
		${textSans.xsmall({
			fontWeight: 'bold',
		})};
	}
`;
const caretStyles = css`
	&:before {
		content: '';
		display: block;
		position: absolute;
		bottom: -14px;
		width: 0;
		height: 0;
		border: 7px solid transparent;
		border-top-color: ${palette.neutral[46]};

		${from.tablet} {
			left: 90px;
			top: 100%;
			border: 10px solid transparent;
			border-top-color: ${palette.neutral[0]};
		}

		${until.tablet} {
			left: 75px;
		}
	}

	&:after {
		content: '';
		display: block;
		position: absolute;
		bottom: -12px;
		width: 0;
		height: 0;
		border: 6px solid transparent;
		border-top-color: ${palette.neutral[97]};

		${from.tablet} {
			left: 91px;
			top: 100%;
			border: 9px solid transparent;
			border-top-color: ${palette.neutral[97]};
		}

		${until.tablet} {
			left: 76px;
		}
	}
`;
// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type ArticleCountHeaderProps = {
	numArticles: number;
	userName: string | null;
};
type ArticleCountWithToggleProps = {
	numArticles: number;
	isArticleCountOn: boolean;
	onToggleClick: () => void;
	userName: string | null;
	defaultHeaderCopy: string | React.ReactNode;
};
type ContributionsArticleCountOptOutWithProps = {
	numArticles: number;
	isArticleCountOn: boolean;
	isMobileOnly: boolean;
	onArticleCountOptOut: () => void;
	onArticleCountOptIn: () => void;
	userName: string | null;
	defaultHeaderCopy: string | React.ReactNode;
};
// -- Functions -- //
const OPHAN_COMPONENT_ID_ARTICLE_COUNT_OPT_OUT_OPEN =
	'contributions-epic-article-count-open';
const OPHAN_COMPONENT_ID_ARTICLE_COUNT_OPT_OUT_CLOSE =
	'contributions-epic-article-count-close';
const OPHAN_COMPONENT_ID_ARTICLE_COUNT_STAY_IN =
	'contributions-epic-article-count-stay-on';
const OPHAN_COMPONENT_ID_ARTICLE_COUNT_OPT_OUT =
	'contributions-epic-article-count-opt-out';
const OPHAN_COMPONENT_ID_ARTICLE_COUNT_STAY_OUT =
	'contributions-epic-article-count-stay-out';
const OPHAN_COMPONENT_ID_ARTICLE_COUNT_OPT_IN =
	'contributions-epic-article-count-opt-in';
// -- Components -- //
export const ArticleCountWithToggle = ({
	isArticleCountOn,
	numArticles,
	onToggleClick,
	userName,
	defaultHeaderCopy,
}: ArticleCountWithToggleProps) => {
	if (isArticleCountOn && numArticles >= 5) {
		return (
			<div css={articleCountHeaderContainerStyles}>
				<div css={articleCountAboveContainerStyles}>
					<ArticleCountHeaderCopy
						numArticles={numArticles}
						userName={userName}
					/>
				</div>
				<div css={articleCountWrapperStyles}>
					<div css={articleCountTextStyles}>Article count</div>
					<ButtonLink
						priority="secondary"
						onClick={onToggleClick}
						cssOverrides={articleCountCtaStyles}
					>
						on
					</ButtonLink>
				</div>
			</div>
		);
	}

	if (!isArticleCountOn) {
		return (
			<div css={articleCountHeaderContainerStyles}>
				<div css={articleCountAboveContainerStyles}>{defaultHeaderCopy}</div>
				<div css={articleCountWrapperStyles}>
					<div css={articleCountTextStyles}>Article count</div>
					<ButtonLink
						priority="secondary"
						onClick={onToggleClick}
						cssOverrides={articleCountCtaStyles}
					>
						off
					</ButtonLink>
				</div>
			</div>
		);
	}

	return null;
};
export const ContributionsArticleCountWithOptOut = ({
	numArticles,
	isArticleCountOn,
	isMobileOnly,
	onArticleCountOptOut,
	onArticleCountOptIn,
	userName,
	defaultHeaderCopy,
}: ContributionsArticleCountOptOutWithProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [consentManagementPlatform, setConsentManagementPlatform] =
		useState(null);

	function openCmp() {
		if (consentManagementPlatform) {
			consentManagementPlatform.showPrivacyManager();
		}
	}

	useEffect(() => {
		import('@guardian/consent-management-platform').then(({ cmp }) => {
			setConsentManagementPlatform(cmp);
		});
	}, []);

	const onToggleClick = () => {
		setIsOpen(!isOpen);
		trackComponentClick(
			isOpen
				? OPHAN_COMPONENT_ID_ARTICLE_COUNT_OPT_OUT_CLOSE
				: OPHAN_COMPONENT_ID_ARTICLE_COUNT_OPT_OUT_OPEN,
		);
	};

	const onStayInClick = () => {
		setIsOpen(false);
		trackComponentClick(OPHAN_COMPONENT_ID_ARTICLE_COUNT_STAY_IN);
	};

	const onOptOutClick = () => {
		setIsOpen(false);
		onArticleCountOptOut();
		trackComponentClick(OPHAN_COMPONENT_ID_ARTICLE_COUNT_OPT_OUT);
	};

	const onOptInClick = () => {
		setIsOpen(false);
		onArticleCountOptIn();
		trackComponentClick(OPHAN_COMPONENT_ID_ARTICLE_COUNT_OPT_IN);
	};

	const onStayOutClick = () => {
		setIsOpen(false);
		trackComponentClick(OPHAN_COMPONENT_ID_ARTICLE_COUNT_STAY_OUT);
	};

	return (
		<div css={isMobileOnly ? topContainerMobile : topContainerDesktop}>
			<ArticleCountWithToggle
				isArticleCountOn={isArticleCountOn}
				numArticles={numArticles}
				onToggleClick={onToggleClick}
				userName={userName}
				defaultHeaderCopy={defaultHeaderCopy}
			/>

			{isOpen && (
				<div css={articleCountDescriptionTopContainerStyles}>
					<div css={caretStyles} />
					<div css={articleCountDescriptionContainer}>
						{isArticleCountOn ? (
							<>
								<div css={articleCountBodyTextStyles}>
									We are counting the number of Guardian articles you’ve read on
									this device. Can we continue showing your article count?
								</div>
								<div css={articleCountCtasContainerStyles}>
									<Button
										priority="primary"
										size="xsmall"
										cssOverrides={articleCountDefaultCtaStyles}
										onClick={onStayInClick}
									>
										Yes, thats OK
									</Button>
									<Button
										priority="tertiary"
										size="xsmall"
										cssOverrides={articleCountOptOutCtaStyles}
										onClick={onOptOutClick}
									>
										No, opt me out
									</Button>
								</div>
							</>
						) : (
							<>
								<div css={articleCountBodyTextStyles}>
									Many readers tell us they enjoy seeing how many pieces of
									Guardian journalism they’ve read, watched or listened to. Can
									we start showing you your article count on support appeals
									like this?
								</div>
								<div css={articleCountCtasContainerStyles}>
									<Button
										priority="primary"
										size="xsmall"
										cssOverrides={articleCountOptInCtaStyles}
										onClick={onOptInClick}
									>
										Yes, opt me in
									</Button>
									<Button
										priority="tertiary"
										size="xsmall"
										cssOverrides={articleCountOptOutCtaStyles}
										onClick={onStayOutClick}
									>
										No, thank you
									</Button>
								</div>
							</>
						)}
					</div>
					<div css={trackingSettingsContainerStyles}>
						To opt out of other tracking activity, manage your{' '}
						<ButtonLink
							priority="secondary"
							cssOverrides={privacySettingsLinkStyles}
							onClick={openCmp}
						>
							Privacy Settings
						</ButtonLink>
					</div>
				</div>
			)}
		</div>
	);
};
export function ArticleCountHeaderCopy({
	userName,
	numArticles,
}: ArticleCountHeaderProps) {
	if (userName) {
		return (
			<>
				Hi {userName}! You have read {numArticles} articles in the last 12
				months
			</>
		);
	}

	return <>You have read {numArticles} articles in the last 12 months</>;
}
