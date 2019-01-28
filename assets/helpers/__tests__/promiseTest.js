// @flow

// ----- Imports ----- //

import {
  repeatPromise,
  pollUntilPromise,
  bracketPromise,
} from '../promise';


// ----- Tests ----- //

describe('promise', () => {

  describe('repeat', () => {

    it('exhausts all trials', (done) => {

      repeatPromise(10, () => Promise.reject()).then(
        () => Promise.resolve(false),
        () => Promise.resolve(true),
      ).then(failed => expect(failed).toEqual(true)).then(done);

    });

    it('returns with as soon as there is a success', (done) => {
      let n = 0;

      repeatPromise(10, () => {
        n += 1;
        return n < 5 ? Promise.reject() : Promise.resolve(n);
      }).then(
        () => Promise.resolve(n),
        () => Promise.resolve(NaN),
      ).then(result => expect(result).toEqual(5)).then(done);

    });

  });

  describe('polling', () => {

    it('return a successful action', (done, fail) => {

      let n = 0;

      pollUntilPromise(2, 50, () => {
        n += 1;
        return Promise.resolve(n);
      }, () => n <= 1).then(() => expect(n).toEqual(2)).then(done, fail);

    });

  });

  describe('bracket', () => {

    it('acquires and properly cleans up a resources', (done) => {

      let n = 0;

      bracketPromise(
        () => { n += 2; return Promise.resolve(); },
        () => { n -= 1; return Promise.resolve(); },
        () => Promise.reject(),
      )().then(() => expect(n).toEqual(1)).then(done, done);
    });

  });

});
