/*
This is a little helper to run a lambda locally.

It purposefully does only two things to keep it simple:
  1. Load environment variables from the `.env` file.
     See `package.json`, and `tsconfig.json`.
     NOTE: This step is only needed locally.

  2. Run the `main` function, the entrypoint of the lambda.
 */

import { main } from './index';

if (require.main === module) {
	void (async () => await main())();
}
