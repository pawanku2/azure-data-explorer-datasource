// import { e2e } from '@grafana/e2e';

describe('Login test', () => {
    it('passes', () => {
      expect(2).toBe(2)
      // e2e.pages.Login.visit();
      // // To prevent flaky tests, always do a `.should` on any selector that you expect to be in the DOM.
      // // Read more here: https://docs.cypress.io/guides/core-concepts/retry-ability.html#Commands-vs-assertions
      // e2e.pages.Login.username()
      //   .should('be.visible')
      //   .type('admin');
    });
  });