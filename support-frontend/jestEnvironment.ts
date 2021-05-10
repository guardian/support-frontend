const JSDOMEnvironment = require('jest-environment-jsdom-fifteen');

module.exports = class JSDomGlobalEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(config);
    this.global.jsdom = this.dom;
  }

  teardown() {
    this.global.jsdom = null;
    return super.teardown();
  }

};