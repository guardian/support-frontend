import { css } from '@emotion/react';
import {
	brandAlt,
	from,
	neutral,
	titlepiece50,
} from '@guardian/source/foundations';

type PropTypes = { featureHeaderMsg: string };

const subscriptions__feature = css`
	padding: 50px 0 55px;
	width: 100%;
	background-color: ${brandAlt[400]};
`;

const subscriptions__feature_container = css`
	max-width: 1290px;
	margin: 0 auto;
	width: 100%;
`;

const subscriptions__feature_text = css`
	max-width: 400px;
	${titlepiece50};
	font-size: 28px;
	line-height: 30px;
	padding-left: 10px;
	font-weight: bold;
	padding-right: 10px;
	color: ${neutral[7]};

	${from.mobileLandscape} {
		max-width: 500px;
		font-size: 40px;
		line-height: 42px;
		padding-right: 20px;
	}

	${from.tablet} {
		max-width: 700px;
		line-height: 45px;
	}

	${from.desktop} {
		max-width: 800px;
		padding-left: 70px;
		font-size: 50px;
		line-height: 55px;
	}

	${from.wide} {
		padding-left: 50px;
	}
`;

function FeatureHeader(featureHeaderProps: PropTypes): JSX.Element {
	return (
		<div css={subscriptions__feature}>
			<div css={subscriptions__feature_container}>
				<h2 css={subscriptions__feature_text}>
					{featureHeaderProps.featureHeaderMsg}
				</h2>
			</div>
		</div>
	);
}

export default FeatureHeader;
