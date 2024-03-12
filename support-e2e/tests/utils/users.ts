import { v4 as uuidv4 } from "uuid";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length: number) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const firstName = () =>
  `test.support.frontend.e2e.firstName+${generateString(5)}`;
export const lastName = () =>
  `test.support.frontend.e2e.lastName+${generateString(5)}`;
export const email = () => `test${uuidv4()}@theguardian.com`;
