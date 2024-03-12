import { v4 as uuidv4 } from 'uuid';

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length:number) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const firstName = () => `${generateString(5)}TestF`;
export const lastName = () => `${generateString(5)}TestL`;
/**
 * This email is skipped when sending thank you emails from Braze in `support-workers`.
 * If you change this here, you need to change it there too.
 *
 * see: support-workers/src/main/scala/com/gu/support/workers/lambdas/SendThankYouEmail.scala
 */
export const email = () => `test.e2e.supporter.revenue+${uuidv4()}@theguardian.com`;
