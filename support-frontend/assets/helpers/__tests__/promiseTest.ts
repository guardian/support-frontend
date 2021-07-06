// ----- Imports ----- //
import { pollUntilPromise } from "helpers/async/promise";
// ----- Tests ----- //
describe('promise', () => {
  describe('polling', () => {
    it('return a successful action', (done, fail) => {
      let n = 0;
      pollUntilPromise(2, 50, () => {
        n += 1;
        return Promise.resolve(n);
      }, () => n <= 1).then(() => expect(n).toEqual(2)).then(done, fail);
    });
  });
});