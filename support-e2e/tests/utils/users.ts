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
export const email = () => `${uuidv4()}test@theguardian.com`;
