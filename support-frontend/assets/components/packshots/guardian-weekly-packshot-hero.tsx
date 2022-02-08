import { css } from '@emotion/react';
import { from, until } from '@guardian/src-foundations/mq';
import GridImage from 'components/gridImage/gridImage';

/** NOTE about packshot images
 * ------
 * because these images are absolute positioned and thus provide
 * no width or height information to rest of the DOM
 * these packshots must have a width applied to allow the
 * container CSS to center the pack shot as a single image
 * this is applied using the "subscriptions__guardian-weekly-packshot" class in this instance
 *  */
const weeklyOverride = css`
	${until.tablet} {
		width: 100%;
	}

	img {
		width: 100%;

		${from.tablet} {
			width: 80%;
		}

		${from.desktop} {
			width: 500px;
		}
	}
`;

const GuardianWeeklyPackShotHero = () => (
	<div className="subscriptions-feature-packshot" css={weeklyOverride}>
		<GridImage
			gridId="subscriptionGuardianWeeklyPackShot"
			srcSizes={[1000, 500]}
			sizes="(max-width: 480px) 100px,
              (max-width: 740px) 100%,
              (max-width: 1067px) 150%,
              800px"
			imgType="png"
		/>
	</div>
);

export default GuardianWeeklyPackShotHero;
