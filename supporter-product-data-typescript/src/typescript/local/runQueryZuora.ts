/// <reference types="node" />

import { handler } from "../lambdas/queryZuoraLambda";

process.env.STAGE = process.env.STAGE ?? "CODE";

async function main(): Promise<void> {
  const result = await handler(
    { queryType: "incremental" },
    {} as never,
    () => undefined
  );
  console.log(JSON.stringify(result, null, 2));
}

void main();
