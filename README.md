support.theguardian.com
=======================

Frontend for the new supporter platform

## Installing dependencies

Install yarn in your machine, follow the correct tutorial according to your environment:

[https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install)

Go to the root of the project and run

`yarn install`

## Running the project

In order to run the server in your machine, you have to run the Play/Scala server and in another tab the webpack-dev-sever.

### Running Play/Scala server

`sbt devrun`

### Running Webpack Dev Server

`npm run devrun`

This commands will start two servers on your computer. The Play/Scala server will listen on port 9000 and the webpack-dev-server will listen on 9111.

If you access the webpack-dev-server (port 9111) you will have available a hot-reload sever for react, which is really useful for client side development.

## Available npm commands

In order to run an npm command you should run:

`npm run [name_command]`

| Command's name       | Functionality |
|----------------------|---------------|
| `lint`               | Validates that the JS files follow the correct rules. |
| `clean`              | Cleans the `public` folder. |
| `build-dev`          | It builds the files for the `DEV` environment |
| `build-prod`         | Builds the files for the `PROD` environment. It runs `clean`, `lint`, `test`, `build:css` and `build:js`. |
| `build:css`          | Build the CSS files |
| `build:js`           | Build the JS files using `DEV` environment. |
| `watch`              | Watch for changes in any CSS or JS files and recompiles everything. |
| `watch:css`          | Watch for changes in any CSS file. |
| `watch:js`           | Watch for changes in any JS file. |
| `devrun`             | Cleans, transpiles, runs and watch the webpack-dev-server using `DEV` environment. |
| `webpack-dev-server` | Runs the webpack-dev-server in port `9111`. |
| `test`               | Runs the client side tests built using Jest.  |
