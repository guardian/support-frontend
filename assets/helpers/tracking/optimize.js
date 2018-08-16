// @flow

// ----- Types ----- //

type Experiment = string;
type Variant = string;

type OptimizeExperiments = {
  [Experiment]: Variant,
};


// ----- Functions ----- //

// Makes sure experiments are of the type [string]: string to match participations.
function parseExperiments(optimize: Object): OptimizeExperiments {

  return Object.keys(optimize).reduce((result, key) => {
    if (typeof optimize[key] === 'string') {
      return { ...result, [key]: optimize[key] };
    }

    return result;
  }, {});

}

// Checks if the optimize object exists in the window.
function optimizeExists(): boolean {
  return window.guardian &&
    window.guardian.optimize &&
    typeof window.guardian.optimize === 'object';
}

// Retrieves the object from the window, async in case it hasn't been put there yet.
function getExperiment(): Promise<OptimizeExperiments> {

  if (optimizeExists()) {
    return Promise.resolve(parseExperiments(window.guardian.optimize));
  }

  return new Promise((res, rej) => {
    window.addEventListener('optimizeActive', () => {
      if (optimizeExists()) {
        res(parseExperiments(window.guardian.optimize));
      }

      rej();
    });
  });

}


// ----- Exports ----- //

export { getExperiment };
