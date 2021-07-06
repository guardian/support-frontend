import React from 'react';
import GridImage from 'components/gridImage/gridImage';
const jessPhillips = (
	<GridImage
		classModifiers={['']}
		gridId="jessPhillips"
		srcSizes={[140, 500, 1000]}
		sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            560px"
		imgType="jpg"
	/>
);
const robbieAndersonImage = (
	<GridImage
		classModifiers={['']}
		gridId="robbieAnderson"
		srcSizes={[140, 500, 1000]}
		sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            560px"
		imgType="jpg"
	/>
);
export { jessPhillips, robbieAndersonImage };
