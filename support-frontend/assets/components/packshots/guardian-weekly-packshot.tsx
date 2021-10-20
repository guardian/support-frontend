import React from 'react';
import GridImage from 'components/gridImage/gridImage';

/** NOTE about packshot images
 * ------
 * because these images are absolute positioned and thus provide
 * no width or height information to rest of the DOM
 * these packshots must have a width applied to allow the
 * container CSS to center the pack shot as a single image
 * this is applied using the "subscriptions__guardian-weekly-packshot" class in this instance
 *  */
const GuardianWeeklyPackShot = () => (
	<div className="subscriptions__guardian-weekly-packshot">
		<GridImage
			gridId="subscriptionGuardianWeeklyPackShot"
			srcSizes={[500, 140]}
			sizes="(max-width: 739px) 140px,
             (max-width: 979px) 500px,
             (max-width: 1140px) 500px,
             500px"
			imgType="png"
		/>
	</div>
);

export default GuardianWeeklyPackShot;
