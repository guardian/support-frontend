// @flow

// ----- Imports ----- //

import * as storage from 'helpers/storage';
import { getQueryParameter } from 'helpers/url';
import { deserialiseJsonObject } from 'helpers/utilities';
import { setExperimentVariant } from 'helpers/optimize/optimizeActions';
import { gaPropertyId } from './googleTagManager';

// ----- Types ----- //

type Experiment = string;
type Variant = string;

export type OptimizeExperiments = {
  [Experiment]: Variant,
};

const OPTIMIZE_STORAGE_KEY = 'optimizeExperiments';

const OPTIMIZE_QUERY_PARAMETER = 'utm_expid';

const EXPERIMENTS_UPDATED = 'OPTIMIZE_EXPERIMENTS_UPDATED';

// ----- Functions ----- //

function optimizeIsLoaded() {
  return typeof window.dataLayer !== 'undefined' && window.dataLayer !== null;
}

function gtag() {
  if (optimizeIsLoaded()) {
    window.dataLayer.push(arguments);
  } else {
    console.log('window.datalayer is undefined in gtag function');
  }
}

function gtagWithCallback(callback: (variant: string, id: string) => void) {
  gtag('event', 'optimize.callback', { callback });
}

function addExperimentUpdateListener(store) {
  window.addEventListener(EXPERIMENTS_UPDATED, (ev) => {
    console.log(`Event listener called, event: ${ev.detail}`);
    store.dispatch(setExperimentVariant({
      id: ev.detail.id,
      variant: ev.detail.variant,
    }));
  });
}

function addOptimizeExperiments(store) {
  console.log('Called addOptimizeExperiments');

  if (optimizeIsLoaded()) {
    gtagWithCallback((variant, id) => {
      store.dispatch(setExperimentVariant({ id, variant }));
    });
  } else {
    // Add a listener so we can update the store once Optimize loads
    console.log('Adding event listener');
    addExperimentUpdateListener(store);
  }
}

function fetchOptimizeExperiments() {
  console.log('Called fetchOptimizeExperiments');

  gtagWithCallback((value, name) => {
    console.log(`Optimize script - Experiment with ID: ${name} is in variant: ${value}`);
    window.dispatchEvent(new CustomEvent(EXPERIMENTS_UPDATED, {
      detail: {
        id: name,
        variant: value,
      },
    }));
  });
}

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
  gtag,
  OPTIMIZE_QUERY_PARAMETER,
  addOptimizeExperiments,
  getOptimizeExperiments,
  parseExperimentsFromGaData,
  parseExperimentFromQueryParam,
  fetchOptimizeExperiments,
  addExperimentUpdateListener
};
