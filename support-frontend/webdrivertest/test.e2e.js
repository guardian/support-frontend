const { expect, browser, $ } = require('@wdio/globals');

describe('Sign up for a Recurring Contribution (New Contributions Flow)', () => {
	it('Monthly contribution sign-up with Stripe', async () => {
		const emailCheckMock = await browser.mock('**/identity/get-user-type?**', {
			method: 'get',
		});
		emailCheckMock.respond({ userType: 'new', hi: 'Lakshmi' });

    const url = 'https://support.thegulocal.com/uk/contribute';
    const userName = 'dobedobeodo';

		await browser.url(url);

		await browser.setCookies([
      { name: 'pre-signin-test-user', value: userName },
			{ name: '_test_username', value: userName },
			{ name: '_post_deploy_user', value: 'true' },
			{ name: 'GU_TK', value: '1.1' },
		]);

    const cookies = await browser.getCookies()
    console.log(cookies);

		await $('#email').setValue('test@email.com');
		await $('#firstName').setValue(userName);
		await $('#lastName').setValue('dobedobeodo');
		await $('#qa-credit-card').click();

		const cardNumberIframe = await browser.findElement(
			'css selector',
			'#cardNumber iframe',
		);
		await browser.switchToFrame(cardNumberIframe);

		await $('input[name="cardnumber"]').setValue('4242424242424242');
		await expect($('input[name="cardnumber"]')).toBeExisting();

		browser.pause(10000);
		//
		const expiryDateIframe = await browser.findElement(
			'css selector',
			'#expiry iframe',
		);
		await browser.switchToFrame(expiryDateIframe);

		await $('input[name="exp-date"]').setValue('01/23');
		//
	});
});
