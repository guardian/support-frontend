describe('Sign up for a Recurring Contribution (New Contributions Flow)', () => {
	context('Monthly contribution sign-up with Stripe - GBP', () => {
		beforeEach(() => {
			const landingPage = 'https://support.thegulocal.com/uk/contribute'; //Defined in support-frontend/conf/DEV.public.conf

      cy.session('auth', () => {
          cy.setCookie('gu-cmp-disabled', 'true');
          cy.setCookie('ccpaApplies', 'true');
      });

      cy.visit(landingPage);
		});

		it('should load correctly  when a test user goes to the contributions landing page', () => {
			cy.url().should('include', 'uk/contribute');
		});
	});
});
/*
describe('Sign up for a Recurring Contribution (New Contributions Flow)', () => {

  context('Monthly contribution sign-up with Stripe - GBP', () => {
    beforeEach(() => {
      const landingPage = "https://support.thegulocal.com/uk/contribute" //Defined in support-frontend/conf/DEV.public.conf
      cy.visit(landingPage)

    })

    it('should load correctly  when a test user goes to the contributions landing page', () => {
      cy.url().should('include', 'uk/contribute');
    });

    it('should display the contributeButton', () => {
      const contributeButton = "#qa-contributions-landing-submit-contribution-button";
      cy.get(contributeButton).should('be.visible')
    });

    it('should keep the contributeButton  clickable', () => {
      const contributeButton = "#qa-contributions-landing-submit-contribution-button";//Defined in support-frontend/conf/DEV.public.conf
      cy.window().its('ga').should('not.exist');
      const cmpIframe = () => {
        return cy
          .get('iframe[id^="sp_message_iframe"]')
          .its('0.contentDocument.body')
          .should('be.empty')
          .then(cy.wrap);
      };

      cmpIframe().contains("It's your choice");
      // cmpIframe().find('button.sp_choice_type_12').click();
      cy.get(contributeButton).click().should('be.enabled');
    });

  })

  // context('When the user selects the monthly option', () => {
  //
  //   class MissingPageElementException extends Error {
  //     constructor(queryString) {
  //       super(`Could not find element with selector: ${queryString}`);
  //       this.name = 'MissingPageElementException';
  //       // if (Error.captureStackTrace) {
  //       //   Error.captureStackTrace(this, MissingPageElementException);
  //       // }
  //     }
  //   }
  //
  //   function clickOn(buttonType){
  //
  //     cy.get(buttonType).focus().click();
  //     // else
  //     //   throw new MissingPageElementException(buttonType)
  //   }
  //
  //   function clickMonthly() {
  //     const monthlyButton = 'input[id="MONTHLY"]'
  //     clickOn(monthlyButton)
  //   }
  //
  //   it('should keep the contributeButton  clickable', () => {
  //     clickMonthly()
  //   })
  // })

})
*/
