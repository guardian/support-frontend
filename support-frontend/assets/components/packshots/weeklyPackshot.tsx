import GridImage from 'components/gridImage/gridImage';
import { weeklyDigitalContainer } from './weeklyPackshotStyle';

function WeeklyPackShot(): JSX.Element {
	return (
		<div css={weeklyDigitalContainer}>
			<GridImage
				gridId={'subscriptionGuardianWeeklyDigitalHero_16x9'}
				srcSizes={[2000]}
				sizes="453px"
				imgType="png"
				altText="Illustration of The Guardian Weekly Subscription"
			/>
		</div>
	);
}

export default WeeklyPackShot;
