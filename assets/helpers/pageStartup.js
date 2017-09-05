import 'ophan';
import * as ga from 'helpers/tracking/ga';
import * as abTest from 'helpers/abtest';
import * as logger from 'helpers/logger';

const start = () => {
  // ----- AB Tests ----- //

  const participation = abTest.init();


  // ----- Tracking ----- //

  ga.init();
  ga.setDimension('experience', abTest.getVariantsAsString(participation));
  ga.trackPageview();

  // ----- Logging ----- //

  logger.init();

  return participation;
};

export default { start };
