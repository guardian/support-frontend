// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { gaPropertyId } from './googleTagManager';


// ----- Types ----- //

type Experiment = string;
type Variant = string;

export type OptimizeExperiments = {
  [Experiment]: Variant,
};


// ----- Functions ----- //

// Makes sure experiments are of the type [string]: string to match participations.
function parseExperimentsFromGaData(optimize: Object): OptimizeExperiments {

  return Object.keys(optimize).reduce((result, key) => {
    if (typeof optimize[key] === 'string') {
      return { ...result, [key]: optimize[key] };
    }

    return result;
  }, {});
}

function getExperimentsFromGaData(): OptimizeExperiments {
  try {
    return parseExperimentsFromGaData(window.gaData[gaPropertyId].experiments);
  } catch (_) {
    return {};
  }
}

// Returns an Optimize experiment from the query parameter utm_expid.
// Expected format of query parameter is '.<testid>.<variantid>'
function parseExperimentsFromQueryParams(queryParameter: ?string): OptimizeExperiments {
  if (queryParameter) {
    // eslint-disable-next-line no-unused-vars
    const [_, experimentId, variantId] = queryParameter.split('.');
    if (experimentId && variantId) {
      return { [experimentId]: variantId };
    }
  }
  return {};
}

// Retrieves the object from the window, async in case it hasn't been put there yet.
function getExperiments(): OptimizeExperiments {
  return {
    ...parseExperimentsFromQueryParams(getQueryParameter('utm_expid')),
    ...getExperimentsFromGaData(),
  };
}


// ----- Exports ----- //

export { getExperiments };
