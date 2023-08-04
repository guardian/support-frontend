describe('Sign up for a Recurring Contribution (New Contributions Flow)', () => {
	context('Monthly contribution sign-up with Stripe - GBP', () => {

		const userName = 'asdfasdfdsaf';
		const userLastName = 'dfgslksdfgkjbsdf';
		const userEmail = 'asdfa@example.com';

		beforeEach(() => {
			const landingPage = 'https://support.thegulocal.com/uk/contribute';

			cy.setCookie('pre-signin-test-user', userName);
			cy.setCookie('_test_username', userName);
			cy.setCookie('_post_deploy_user', 'true');
			cy.setCookie('GU_TK', '1.1');

			cy.visit(landingPage);
		});

		it('should load correctly when a test user goes to the contributions landing page', () => {
			cy.url().should('include', 'uk/contribute');
		});

    it('should display the thankyou page when a user fills in the form and submits', () => {
			cy.get('#firstName').type(userName);
			cy.get('#lastName').type(userLastName);
			cy.get('#email').type(userEmail);

      cy.get('#qa-credit-card').click();
      /*
      cy.get("input[name='cardnumber']").type("4242424242424242");
      cy.get("input[name='expiry']").type("0150");
      cy.get("input[name='cvc']").type("111");
      */
    })

	});
});
