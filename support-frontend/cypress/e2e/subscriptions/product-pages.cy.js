describe('Basic product page load tests', () => {
  const urlFirstPart = 'https://support.thegulocal.com/uk/subscribe';
	context('Paper product page', () => {
		it('should load correctly  when a test user goes to the newspaper landing page', () => {
			const paperLandingPage =
      `${urlFirstPart}/paper`; //Defined in support-frontend/conf/DEV.public.conf
			cy.visit(paperLandingPage);
			cy.url().should('include', 'uk/subscribe/paper');
			cy.get('#qa-paper-subscriptions').should('be.visible');
		});
	});
	context('Weekly product page', () => {
		it('should load correctly  when a test user goes to the guardian weekly landing page', () => {
			const guardianWeeklyLandingPage =
      `${urlFirstPart}/weekly`;
			cy.visit(guardianWeeklyLandingPage);
			cy.url().should('include', 'uk/subscribe/weekly');
			cy.get('#qa-guardian-weekly').should('be.visible');
		});
	});
	context('Weekly gift product page', () => {
		it('should load correctly  when a test user goes to the guardian weekly gift landing page', () => {
			const guardianWeeklyGiftLandingPage =
      `${urlFirstPart}/weekly/gift`;
			cy.visit(guardianWeeklyGiftLandingPage);
			cy.url().should('include', '/uk/subscribe/weekly/gift');
			cy.get('#qa-guardian-weekly-gift').should('be.visible');
		});
	});
	context('Subscriptions landing page', () => {
		it('should load correctly  when a test user goes to the subscription  landing page', () => {
			const subscriptionLandingPage =
      `${urlFirstPart}`;
			cy.visit(subscriptionLandingPage);
			cy.url().should('include', '/uk/subscribe');
			cy.get('#qa-subscriptions-landing-page').should('be.visible');
		});
	});
});
