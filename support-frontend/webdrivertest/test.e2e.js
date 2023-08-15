const { expect, browser, $ } = require('@wdio/globals')

describe('My Login application', () => {
    it('should login with valid credentials', async () => {


        const emailCheckMock = await browser.mock('**/identity/get-user-type?**', {
            method: 'get'
        })
        emailCheckMock.respond({"userType":"new", "hi": "Lakshmi"})

        await browser.url('https://support.thegulocal.com/uk/contribute');

        await $('#email').setValue('test@email.com')
        await $('#firstName').setValue('dobedobeodo')
        await $('#lastName').setValue('dobedobeodo')
        await $('#qa-credit-card').click()

        await expect($('#flash')).toBeExisting()
        // await expect($('#flash')).toHaveTextContaining(
        //     'You logged into a secure area!')
    })
})
