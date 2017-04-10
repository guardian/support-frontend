support.theguardian.com
=======================

Frontend for the new supporter platform


## Client-side

### Installing dependencies

Go to the root of the project and run

`npm install`

### Transpiling and watching for changes using `DEV` environment

`npm run devrun`

### Available npm commands

In order to run a npm command you should run:

`npm run [name_command]`

| Command's name       | Functionality |
|----------------------|---------------|
| `lint`               | Validates that the JS files follow the correct rules. |
| `clean`              | Cleans the public folder.                |
| `precommit`          | Command to be run by the precommit hook. It run the `test` and `lint` commands.    |
| `build-dev`          | It builds the files for the `DEV` environment  |
| `build-prod`         | Builds the files for the `PROD` environment              |
| `build:css`          | Build the CSS files |
| `build:js`           | Build the JS files using `DEV` environment.|
| `watch`              | Watch for changes in any CSS or JS files and recompiles everything. |
| `watch:css`          | Watch for changes in any CSS file. |
| `watch:js`           | Watch for changes in any JS file. |
| `devrun`             | Cleans, validates and runs the webpack-dev-server. |
| `webpack-dev-server` | Runs the webpack-dev-server in port `9111` |
| `test`               | Runs the client side tests built using Jest.  |


## Run

In order to run the server in your machine, you have to run the Play/Scala server and in other tab the webpack-dev-sever.

### Running Play/Scala server

`sbt devrun`

### Running Webpack Dev Server

`npm run devrun`

This commands will start two servers in your computer. The Play/Scala server will listen in port 9000 and the webpack-dev-server will listen in 9111.

If you access the webpack-dev-server (port 9111) you will have available a hot-reload sever for react, which is really useful for client side development.