import React from 'react';
import GridImage from 'components/gridImage/gridImage';

const PaperAndDigitalPackshot = () => (
	<div className="paper-and-digital-packshot">
		<GridImage
			gridId="subscriptionIpad"
			srcSizes={[1000, 500, 140]}
			sizes="(max-width: 740px) 100%,
            (max-width: 980px) 243px,
            (max-width: 1140px) 270px,
            300px"
			imgType="png"
		/>
		<GridImage
			gridId="subscriptionPrint"
			srcSizes={[805, 402]}
			sizes="(max-width: 740px) 100%,
             (max-width: 980px) 253px,
             (max-width: 1140px) 281px,
             312px"
			imgType="png"
		/>
		<GridImage
			gridId="subscriptionDailyMobile"
			srcSizes={[568, 484, 242]}
			sizes="(max-width: 740px) 100%,
            (max-width: 980px) 100px,
            125px"
			imgType="png"
		/>
		<GridImage
			gridId="subscriptionPrintDigital"
			srcSizes={[452, 905, 1366]}
			sizes="(max-width: 740px) 100%,
            (max-width: 980px) 102px,
            (max-width: 1140px) 113px,
            125px"
			imgType="png"
		/>
	</div>
);

export default PaperAndDigitalPackshot;
