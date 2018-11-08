// @flow

// ----- Imports ----- //

import * as storage from 'helpers/storage';
import { setExperimentVariant } from 'helpers/page/commonActions';
import { type Store } from 'redux';

// ----- Types ----- //

export type OptimizeExperiment = {
  id: string,
  variant: string,
}

export type OptimizeExperiments = OptimizeExperiment[];

const OPTIMIZE_STORAGE_KEY = 'optimizeExperiments';

const OPTIMIZE_QUERY_PARAMETER = 'utm_expid';

const EXPERIMENTS_UPDATED = 'OPTIMIZE_EXPERIMENTS_UPDATED';

// ----- Functions ----- //

function optimizeIsLoaded() {
  return typeof window.dataLayer !== 'undefined' && window.dataLayer !== null;
}

function gtag() {
  if (optimizeIsLoaded()) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments); // unfortunately Optimize seems to need the Arguments object, not just an array
  } else {
    console.log('window.datalayer is undefined in gtag function');
  }
}

function gtagWithCallback(callback: (variant: string, id: string) => void) {
  gtag('event', 'optimize.callback', { callback });
}

function readExperimentsFromSession(): OptimizeExperiments {
  try {
    const data = storage.getSession(OPTIMIZE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function storeExperimentsInSession(experiments: OptimizeExperiments): boolean {
  try {
    const serialised = JSON.stringify(experiments);
    storage.setSession(OPTIMIZE_STORAGE_KEY, serialised);
    return true;
  } catch (_) {
    return false;
  }
}

function storeExperimentInSession(experiment: OptimizeExperiment): boolean {
  try {
    const existing: OptimizeExperiments = readExperimentsFromSession();
    const updated: OptimizeExperiments = existing
      .filter(exp => exp.id !== experiment.id)
      .concat(experiment);

    storeExperimentsInSession(updated);
    return true;
  } catch (_) {
    return false;
  }
}

function dispatchToStore(store: Store<*, *, *>, id: string, variant: string) {
  storeExperimentInSession({ id, variant });
  store.dispatch(setExperimentVariant({ id, variant }));
}

function addExperimentUpdateListener(store: Store<*, *, *>) {
  window.addEventListener(EXPERIMENTS_UPDATED, (ev) => {
    console.log(`Event listener called, event: ${ev.detail}`);

    dispatchToStore(store, ev.detail.id, ev.detail.variant);
  });
}

function addOptimizeExperiments(store: Store<*, *, *>) {
  console.log('Called addOptimizeExperiments');
  if (optimizeIsLoaded()) {
    gtagWithCallback((variant, id) => {
      dispatchToStore(store, id, variant);
    });
  } else {
    // Add a listener so we can update the store once Optimize loads
    console.log('Optimize is not ready yet - adding event listener');
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

// ----- Exports ----- //

export {
  OPTIMIZE_QUERY_PARAMETER,
  addOptimizeExperiments,
  readExperimentsFromSession,
  fetchOptimizeExperiments,
};
