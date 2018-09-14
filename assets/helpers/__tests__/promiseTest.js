// @flow

// ----- Imports ----- //

import {
  repeatPromise,
  sleepPromise,
  pollUntilPromise,
  logPromise,
  bracketPromise,
} from '../promise';


// ----- Tests ----- //

const { jsdom } = global;

describe('promise', () => {

  describe('repeat', () => {

    it('exhausts all trials', done => {

      repeatPromise(10, () => Promise.reject()).then(
        () => Promise.resolve(false),
        () => Promise.resolve(true)
      ).then(failed => expect(failed).toEqual(true)).then(done);

    });

    it('returns with as soon as there is a success', done => {
      let n = 0;

      repeatPromise(10, () => {
        n += 1;
        return n < 5 ? Promise.reject() : Promise.resolve(n)
      }).then(
        n => Promise.resolve(n),
        () => Promise.resolve(NaN)
      ).then(result => expect(result).toEqual(5)).then(done);

    });

  });

  describe('sleepPromise', () => {

    it('should run the promise after 100ms', done => {

      const t1 = Date.now();

      sleepPromise(100, () => Promise.resolve(Date.now()))
        .then(t2 => expect(t2 - t1).toBeGreaterThanOrEqual(100))
        .then(done);

    });

  });

  describe('polling', () => {

    it('return a successful action', (done, fail) => {

      let n = 0;

      pollUntilPromise(2, 50, () => {
        n += 1;
        return Promise.resolve(n);
      }, n => n <= 1).then(n => expect(n).toEqual(2)).then(done, fail);

    });

  });

  // Don't know how if it's possible to mock Raven?
  // describe('logging', () => {

  //   it('log and rethrow exceptions', done => {

  //     const error = new Error('Oh noes!')

  //     logPromise(Promise.reject(error)).catch(done);

  //   });

  // });

  describe('bracket', () => {

    it('acquires and properly cleans up a resources', done => {
      
      let n = 0;

      bracketPromise(
        () => { n += 2; return Promise.resolve() },
        () => { n -= 1; return Promise.resolve() },
        () => Promise.reject()
      )().then(() => expect(n).toEqual(1)).then(done, done);
    })

  });  

});
