import React from 'react';
import GridImage from 'components/gridImage/gridImage';

const keirStarmerImage = (
	<GridImage
		classModifiers={['']}
		gridId="keirStarmer"
		srcSizes={[140, 500, 1000]}
		sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            560px"
		imgType="jpg"
	/>
);
const felicityCloakeImage = (
	<GridImage
		classModifiers={['']}
		gridId="felicityCloake"
		srcSizes={[140, 500]}
		sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            560px"
		imgType="jpg"
	/>
);
const woleSoyinkaImage = (
	<GridImage
		classModifiers={['']}
		gridId="woleSoyinka"
		srcSizes={[140, 500, 1000]}
		sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            560px"
		imgType="png"
	/>
);
export { keirStarmerImage, felicityCloakeImage, woleSoyinkaImage };
