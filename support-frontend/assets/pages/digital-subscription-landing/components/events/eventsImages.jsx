import React from 'react';
import GridImage from 'components/gridImage/gridImage';

const ennyImage = (
  <GridImage
    classModifiers={['']}
    gridId="enny"
    srcSizes={[140, 500, 1000]}
    sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            800px"
    imgType="jpg"
  />
);

export {
  ennyImage,

};
