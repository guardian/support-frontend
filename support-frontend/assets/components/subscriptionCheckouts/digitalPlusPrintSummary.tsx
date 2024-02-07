import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	headline,
	palette,
	space,
	textSans,
} from '@guardian/source-foundations';
import {
	Link,
	linkThemeDefault,
	SvgChevronDownSingle,
	SvgChevronUpSingle,
} from '@guardian/source-react-components';
import { useState } from 'react';

const container = css`
	display: flex;
	flex-direction: column;
	max-width: 376px;
	background-color: ${palette.neutral[97]};
	padding-bottom: ${space[3]}px;
	${from.desktop} {
		background-color: ${palette.neutral[100]};
		padding-bottom: 0;
	}
`;

const borderedContent = css`
	padding: ${space[3]}px 10px 0;
	${from.desktop} {
		border-bottom: 1px solid ${palette.neutral['86']};
		border-right: 1px solid ${palette.neutral['86']};
		padding: ${space[5]}px;
	}
`;

const titleContainer = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
`;

const title = css`
	${headline.xxsmall({ fontWeight: 'bold' })};
	color: ${palette.neutral[7]};
	margin-bottom: ${space[5]}px;
	${from.desktop} {
		${headline.xsmall({ fontWeight: 'bold' })};
	}
`;

const subtitle = (showDetailsStatus: 'visible' | 'hidden') => css`
	${textSans.xsmall()};
	color: ${palette.neutral[7]};
	display: ${showDetailsStatus === 'visible' ? 'none' : 'block'};
	${from.desktop} {
		display: none;
	}
`;

const subTitleAndDescription = (showDetailsStatus: 'visible' | 'hidden') => css`
	display: ${showDetailsStatus === 'visible' ? 'block' : 'none'};
	${from.desktop} {
		display: block;
	}
	color: #606060;
	border-top: 1px solid ${palette.neutral[86]};
	padding-top: ${space[1]}px;
	margin-bottom: ${space[5]}px;
	h3 {
		${textSans.small({ fontWeight: 'bold' })};
		color: ${palette.neutral[7]};
		${from.desktop} {
			${textSans.medium({ fontWeight: 'bold' })};
		}
	}
	p {
		${textSans.xsmall()};
	}
`;

const totalContainer = css`
	border-top: 1px solid ${palette.neutral[86]};
	padding-top: ${space[1]}px;
	display: flex;
	justify-content: space-between;
	margin-bottom: ${space[5]}px;
	h3 {
		${textSans.small({ fontWeight: 'bold' })};
		${from.desktop} {
			${textSans.medium({ fontWeight: 'bold' })};
		}
		color: ${palette.neutral[7]};
	}
`;

const previousPrice = css`
	font-weight: normal;
	text-decoration: line-through;
`;

const priceDescription = css`
	border-top: 1px solid ${palette.neutral[86]};
	padding: ${space[1]}px 0 0;
	list-style-type: none;
	${from.desktop} {
		margin-bottom: ${space[5]}px;
	}
	${textSans.xxsmall()};
	color: #606060;
`;

const productStartDates = (showDetailsStatus: 'visible' | 'hidden') => css`
	list-style-type: none;
	background-color: ${palette.neutral[97]};
	${textSans.xxsmall()};
	border-top: 1px solid ${palette.neutral['86']};
	padding-top: ${space[2]}px;
	margin-top: ${space[2]}px;
	color: #606060;
	li + li {
		margin-top: ${space[1]}px;
	}
	display: ${showDetailsStatus === 'visible' ? 'block' : 'none'};
	${from.desktop} {
		border-top: none;
		padding: 10px;
		margin-top: 0;
		display: block;
	}
`;

const detailsAndChangeButtons = css`
	display: flex;
	justify-content: space-between;
	margin-top: ${space[2]}px;
	padding: 0 10px;
	${from.desktop} {
		justify-content: flex-end;
	}
`;

const showDetails = css`
	${textSans.xxsmall()};
	color: ${palette.brand[500]};
	text-decoration: none;
	display: flex;
	align-items: flex-end;
	padding: 0;
	border: 0;
	div {
		display: none;
	}
	svg {
		margin-left: 2px;
		width: 14px;
		height: 14px;
		fill: ${palette.brand[500]};
	}
	${from.desktop} {
		display: none;
	}
`;

const changeSubscriptionLink = css`
	${textSans.xxsmall()};
	align-self: flex-end;
	color: #606060;
	:visited {
		color: #606060;
	}
	${from.desktop} {
		${textSans.xsmall()};
		color: ${palette.brand[500]};
		:visited {
			color: ${palette.brand[500]};
		}
	}
`;

interface DigitalPlusPrintSummaryProps {
	total: number;
	currencySymbol: string;
	paymentFrequency: 'month' | 'year';
	discount?: {
		total: number;
		duration: number;
		period: 'month' | 'year';
	};
	startDateGW: string;
}

export function DigitalPlusPrintSummary({
	total,
	currencySymbol,
	paymentFrequency,
	discount,
	startDateGW,
}: DigitalPlusPrintSummaryProps) {
	const [showDetailsStatus, setshowDetailsStatus] = useState<
		'visible' | 'hidden'
	>('hidden');

	const handleShowHideDetails = () => {
		setshowDetailsStatus(
			showDetailsStatus === 'visible' ? 'hidden' : 'visible',
		);
	};

	return (
		<div css={container}>
			<div css={borderedContent}>
				<header css={titleContainer}>
					<h2 css={title}>Your subscription</h2>
					<h3 css={subtitle(showDetailsStatus)}>Digital + print</h3>
				</header>
				<hgroup css={subTitleAndDescription(showDetailsStatus)}>
					<h3>Digital + print</h3>
					<p>
						All benefits from All-access digital, plus Guardian Weekly print
						magazine delivered to your door.
					</p>
				</hgroup>
				<div css={totalContainer}>
					<h3>Total</h3>
					<h3>
						{!!discount && (
							<>
								<span css={previousPrice}>
									{currencySymbol}
									{total}
								</span>{' '}
							</>
						)}
						{currencySymbol}
						{discount?.total ?? total}/{paymentFrequency}
					</h3>
				</div>
				<ul css={priceDescription}>
					<li>
						You’ll pay {currencySymbol}
						{discount?.total ?? total}/{paymentFrequency}
						{discount &&
							` for ${discount.duration} ${discount.period}${
								discount.duration > 1 ? 's' : ''
							}, then ${currencySymbol}${total}/${paymentFrequency} afterwards unless you cancel. Offer only available to new subscribers who do not have an existing subscription with the Guardian.`}
					</li>
					<li>Auto renews every {paymentFrequency}. Cancel anytime.</li>
				</ul>
				<ul css={productStartDates(showDetailsStatus)}>
					<li>Your digital benefits will start today.</li>
					<li>
						Your first issue of Guardian Weekly will be published on{' '}
						{startDateGW}. Please allow 1 to 7 days after publication date for
						your magazine to arrive, depending on national post services.
					</li>
				</ul>
			</div>
			<div css={detailsAndChangeButtons}>
				<button css={showDetails} onClick={handleShowHideDetails}>
					{showDetailsStatus === 'visible' ? 'hide' : 'show'} details
					{showDetailsStatus === 'visible' ? (
						<SvgChevronUpSingle isAnnouncedByScreenReader size="xsmall" />
					) : (
						<SvgChevronDownSingle isAnnouncedByScreenReader size="xsmall" />
					)}
				</button>
				<ThemeProvider theme={linkThemeDefault}>
					<Link
						href="/contribute#ab-threeTierCheckout=variant"
						cssOverrides={changeSubscriptionLink}
					>
						Change subscription
					</Link>
				</ThemeProvider>
			</div>
		</div>
	);
}
