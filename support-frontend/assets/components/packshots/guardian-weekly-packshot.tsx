import GridPicture from 'components/gridPicture/gridPicture';

/** NOTE about packshot images
 * ------
 * because these images are absolute positioned and thus provide
 * no width or height information to rest of the DOM
 * these packshots must have a width applied to allow the
 * container CSS to center the pack shot as a single image
 * this is applied using the "subscriptions__guardian-weekly-packshot" class in this instance
 *  */
function GuardianWeeklyPackShot(): JSX.Element {
	return (
		<div className="subscriptions__guardian-weekly-packshot">
			<GridPicture
				sources={[
					{
						gridId: 'subscriptionGuardianWeeklyMobile',
						srcSizes: [500, 140],
						imgType: 'png',
						sizes: '100vw',
						media: '(max-width: 739px)',
					},
					{
						gridId: 'subscriptionGuardianWeeklyTablet',
						srcSizes: [1000, 500],
						imgType: 'png',
						sizes: '(min-width: 1000px) 2000px, 1000px',
						media: '(max-width: 979px)',
					},
				]}
				fallback="subscriptionGuardianWeeklyPackShot"
				fallbackSize={1000}
				altText=""
				fallbackImgType="png"
			/>
		</div>
	);
}

export default GuardianWeeklyPackShot;
