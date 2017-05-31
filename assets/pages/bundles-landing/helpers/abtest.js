// @flow

// ----- Imports ----- //

import type { Participations } from 'helpers/abtest';


// ----- Functions ----- //

const otherWaysOfContribute = (participation: Participations): string => {

  const variant = participation.otherWaysOfContribute;

  switch (variant) {
    case 'control' : return 'other ways you can support us';
    case 'variantA' : return 'other ways you can contribute';
    case 'variantB' : return 'other ways you can give us money';
    default : return 'other ways you can support us';
  }
};

export default otherWaysOfContribute;
