import {
	featureContainer,
	featureHeader,
	featureHeaderContainer,
} from './featureHeaderStyles';

type FeatureHeaderProp = { featureHeaderMsg: string };

function FeatureHeader(featureHeaderProp: FeatureHeaderProp): JSX.Element {
	return (
		<div css={featureContainer}>
			<div css={featureHeaderContainer}>
				<h2 css={featureHeader}>{featureHeaderProp.featureHeaderMsg}</h2>
			</div>
		</div>
	);
}

export default FeatureHeader;
