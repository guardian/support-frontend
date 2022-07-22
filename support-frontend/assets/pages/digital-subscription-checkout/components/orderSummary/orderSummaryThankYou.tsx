import { css } from '@emotion/react';
import {
	background,
	between,
	from,
	headline,
	neutral,
	space,
	text,
	textSans,
	until,
} from '@guardian/source-foundations';
import GridImage from 'components/gridImage/gridImage';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

export const wrapper = css`
	display: none;

	${from.tablet} {
		display: block;
		background-color: ${background.primary};
		color: ${text.primary};
		${until.desktop} {
			padding: ${space[3]}px;
		}
	}
`;

export const topLine = css`
	display: flex;
	justify-content: space-between;
	width: calc(100%-${space[3]}px * 2);
	align-items: center;
	padding: ${space[3]}px;

	${until.desktop} {
		border-top: 1px solid ${neutral['93']};
		padding: ${space[1]}px 0 ${space[2]}px;
	}

	${between.phablet.and.desktop} {
		display: block;
	}
`;

export const sansTitle = css`
	${textSans.medium({
		fontWeight: 'bold',
	})};
	${from.phablet} {
		${textSans.large({
			fontWeight: 'bold',
		})};
	}
`;

export const contentBlock = css`
	display: flex;
	width: 100%;

	${from.tablet} {
		display: block;
	}
`;

export const imageContainer = css`
	display: inline-flex;
	align-items: flex-start;
	width: 100%;
	padding: ${space[4]}px ${space[3]}px 0;
	background-color: ${neutral['97']};

	img {
		width: 100%;
		height: auto;
	}
`;

export const textBlock = css`
	margin-left: ${space[3]}px;

	${from.desktop} {
		margin: ${space[3]}px;
	}

	h3 {
		${headline.xxxsmall({
			fontWeight: 'bold',
		})};
		margin: ${space[1]}px 0 0 -${space[3]}px;
		${from.desktop} {
			${headline.xxsmall({
				fontWeight: 'bold',
			})};
			margin-top: 0;
			margin-left: ${space[1]}px;
		}
	}
`;

type PropTypes = {
	title: string;
	countryGroupId: CountryGroupId;
	pending?: boolean;
};

function OrderSummaryThankYou(props: PropTypes): JSX.Element {
	return (
		<aside css={wrapper}>
			<div css={topLine}>
				<h3 css={sansTitle}>
					{props.pending ? 'Order pending' : 'Order confirmed'}
				</h3>
			</div>
			<div css={contentBlock}>
				<div css={imageContainer}>
					<GridImage
						gridId={
							props.countryGroupId === 'AUDCountries'
								? 'editionsPackshotAusShort'
								: 'editionsPackshotShort'
						}
						srcSizes={[1000, 500]}
						sizes="(max-width: 740px) 50vw, 500"
						imgType="png"
						altText=""
					/>
				</div>
				<div css={textBlock}>
					<h4>{props.title}</h4>
				</div>
			</div>
		</aside>
	);
}

OrderSummaryThankYou.defaultProps = {
	pending: false,
};

export default OrderSummaryThankYou;
