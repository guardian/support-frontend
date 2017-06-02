// @flow

// ----- Imports ----- //

import type { Participations } from 'helpers/abtest';
import { trackOphan } from 'helpers/abtest';

// ----- Functions ----- //

const otherWaysOfContribute = (participation: Participations): string => {

  const variant = participation.otherWaysOfContribute;

  trackOphan('otherWaysOfContribute', variant);

  switch (variant) {
    case 'control' : return 'other ways you can support us';
    case 'variantA' : return 'other ways you can support us';
    default : return 'other ways you can support us';
  }
};

export default otherWaysOfContribute;
