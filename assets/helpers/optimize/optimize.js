// @flow

// ----- Imports ----- //

import * as storage from 'helpers/storage';

// ----- Types ----- //

export type OptimizeExperiment = {
  id: string,
  variant: string,
}

export type OptimizeExperiments = OptimizeExperiment[];

const OPTIMIZE_STORAGE_KEY = 'optimizeExperiments';

const EXPERIMENTS_UPDATED = 'OPTIMIZE_EXPERIMENTS_UPDATED';

// ----- Functions ----- //

function optimizeIsLoaded() {
  return window.dataLayer != null;
}

function gtag() {
  if (optimizeIsLoaded()) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments); // unfortunately Optimize seems to need the Arguments object, not just an array
  }
}

function getExperimentsFromApi(callback: (variant: string, id: string) => void) {
  // $FlowIgnore
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

function addExperimentUpdateListener(addToStoreCallback: OptimizeExperiment => void) {
  window.addEventListener(
    EXPERIMENTS_UPDATED,
    ev => addToStoreCallback({ id: ev.detail.id, variant: ev.detail.variant }),
  );
}

function addOptimizeExperiments(addToStoreCallback: OptimizeExperiment => void) {
  // Store experiments in the session as well as Redux
  const withSessionStorageCallback = (exp: OptimizeExperiment) => {
    storeExperimentInSession(exp);
    addToStoreCallback(exp);
  };

  if (optimizeIsLoaded()) {
    getExperimentsFromApi((variant, id) => withSessionStorageCallback({ id, variant }));
  } else {
    // Add a listener so we can update the store once Optimize loads
    addExperimentUpdateListener(withSessionStorageCallback);
  }
}

function getOptimizeExperiments() {
  getExperimentsFromApi((value, name) => {
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
  addOptimizeExperiments,
  readExperimentsFromSession,
  getOptimizeExperiments,
};
