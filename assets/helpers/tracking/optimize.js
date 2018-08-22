// @flow

// ----- Imports ----- //

import * as storage from 'helpers/storage';
import { getQueryParameter } from 'helpers/url';
import { deserialiseJsonObject } from 'helpers/utilities';
import { gaPropertyId } from './googleTagManager';


// ----- Types ----- //

type Experiment = string;
type Variant = string;

export type OptimizeExperiments = {
  [Experiment]: Variant,
};

const OPTIMIZE_STORAGE_KEY = 'optimizeExperiments';

const OPTIMIZE_QUERY_PARAMETER = 'utm_expid';


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
function parseExperimentFromQueryParam(queryParameter: ?string): OptimizeExperiments {
  if (queryParameter) {
    // eslint-disable-next-line no-unused-vars
    const [_, experimentId, variantId] = queryParameter.split('.');
    if (experimentId && variantId) {
      return { [experimentId]: variantId };
    }
  }
  return {};
}

function storeOptimizeExperimentsInSession(experiments: OptimizeExperiments): boolean {
  try {
    const serialised = JSON.stringify(experiments);
    storage.setSession(OPTIMIZE_STORAGE_KEY, serialised);
    return true;
  } catch (_) {
    return false;
  }
}

function readOptimizeExperimentsInSession(): OptimizeExperiments {
  const data = storage.getSession(OPTIMIZE_STORAGE_KEY);
  return data ? deserialiseJsonObject(data) || {} : {};
}

function getOptimizeExperiments(): OptimizeExperiments {
  const experiments = {
    ...parseExperimentFromQueryParam(getQueryParameter(OPTIMIZE_QUERY_PARAMETER)),
    ...getExperimentsFromGaData(),
    ...readOptimizeExperimentsInSession(),
  };
  storeOptimizeExperimentsInSession(experiments);
  return experiments;
}


// ----- Exports ----- //

export {
  OPTIMIZE_QUERY_PARAMETER,
  getOptimizeExperiments,
  parseExperimentsFromGaData,
  parseExperimentFromQueryParam,
};
