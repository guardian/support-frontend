type PropTypes = { featureHeaderMsg: string };

function FeatureHeader(featureHeaderProps: PropTypes): JSX.Element {
	return (
		<div className="subscriptions__feature">
			<div className="subscriptions__feature-container">
				<h2 className="subscriptions__feature-text">
					{featureHeaderProps.featureHeaderMsg}
				</h2>
			</div>
		</div>
	);
}

export default FeatureHeader;
