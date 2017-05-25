# support.theguardian.com

Frontend for the new supporter platform

You can find more details about the architecture of the project in our [**`development guide`**](https://github.com/guardian/support-frontend/blob/master/docs/development.md).

## Installing dependencies

Install yarn in your machine, follow the correct tutorial according to your environment:

[https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install)

Go to the root of the project and run

`yarn install`

## Running the project in DEV Mode

In order to run the server in your machine, you have to run the Play/Scala server and in another tab the webpack-dev-sever.

**Running Play/Scala Dev Server:**

`sbt devrun`

This command will start the Play/Scala server listening on port 9000 of your computer. If you go to localhost:9000 at this moment you 
will see a blank page. This is because the assets have not been generated yet. In order to do so, see the following step.  

**Running Client-Side Dev Server:**

`yarn devrun`

The command above, build the assets and serve them using the `webpack-dev-server` listening on port 9111. This server (port 9111) 
provides a hot-reload feature, which is really useful for client side development.

Go to localhost:9111 to see the support site.

## Running the project in PROD Mode

**Generate the assets**

`yarn build-prod`

This command will generate the assets using PROD environment.

**Running Play/Scala Server:**

`sbt run`

This command will start the Play/Scala server listening on port 9000 of your computer.   


Go to localhost:9000 to see the support site.

## Available yarn commands

In order to run a yarn command you should run:

`yarn run [name_command]`

| Command              | Functionality |
|----------------------|---------------|
| `clean`              | Cleans the `public` folder. |
| `validate`           | Validates the JS files (`.js` and `.jsx`), using eslint and flow. |
| `lint`               | Runs eslint. |
| `flow`               | Runs the flow type check. |
| `build-dev`          | Builds the files for the `DEV` environment |
| `build-prod`         | Builds the files for the `PROD` environment. It runs `clean`, `lint`, `test`, `build:css` and `build:js`. |
| `build:css`          | Builds the CSS files. |
| `build:css:sass`     | Builds the CSS using sass. |
| `build:css:postcss`  | Runs the postCSS tasks (autoprefixer and pxtorem). |
| `build:js`           | Builds the JS files using `DEV` environment. |
| `watch`              | Watches for changes in any CSS or JS files and recompiles everything. |
| `watch:js`           | Watches for changes in any JS file. |
| `watch:css`          | Watches for changes in any CSS file. |
| `watch:css:sass`     | Run watch task for sass command. |
| `devrun`             | Cleans, transpiles, runs and watches the webpack-dev-server using `DEV` environment. |
| `webpack-dev-server` | Runs the webpack-dev-server in port `9111`. |
| `test`               | Runs the client side tests built using Jest.  |
