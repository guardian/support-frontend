# Development in Support The Guardian frontend

Welcome to Support Frontend. In this document we will go through the elements that form 
Support Frontend, how they interact and how you can start adding code to this repository.
  
## Table of contents

1. [Getting started](#getting-started)
2. [Introduction to the technological stack](#introduction-to-the-technological-stack)
3. [Architecture](#architecture)
4. [Project's structure](#projects-structure) 
5. [CI Build process](#ci-build-process)
6. [Yarn commands](#yarn-commands)

## Getting started

Follow the instructions in [**setup.md**](setup.md) to setup your dev environment and
get `support-frontend` running locally.

## Introduction to the technological stack

The pieces that make up `support-frontend` are:

### Frontend
 * autoprefixer
 * babel
 * eslint
 * jest
 * preact
 * redux
 * flow
 * sass
 * ga and ophan for tracking
 * raven (sentry)

### Backend

* Play

### Tools

 * npm registry
 * npm scripts
 * sbt
 * webpack
 * yarn
 
## Architecture

 ### Client-side architecture 

 Each page of the support site is a self-contained redux/react application. We use redux to handle the internal state of
 the page and we use react as the presentation layer. 
 
 Every redux application has the following components: 
 * [**actions**](http://redux.js.org/docs/basics/Actions.html) are payloads of information that send data from your 
 application to your store.
 * [**reducers**](http://redux.js.org/docs/basics/Reducers.html) specify how the application's state changes in response 
 of an action.
 * [**store**](http://redux.js.org/docs/basics/Store.html) holds the application state.
 
 Additionally, since React allows us to describe the UI as a function of the state of the application, we use it as the 
 the presentation layer. More information about React/Redux [here](http://redux.js.org/docs/basics/UsageWithReact.html).
 
 There are two type of React components, [presentational and container components](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components).
 The presentational components ***are not aware of Redux***, and its main purpose is to define how the data is showed to the 
 end reader. Meanwhile, the container components ***are aware of Redux*** and its main purpose if to keep the state and handle 
 the logic of the app. 
 
 #### Data flow 
 
 The data flows in the following way:
 
 
 1. The user interact with the UI and he or she generates an action. The action is dispatched to the store via  `store.dispatch(action)`.
 2. The store handle the action using the reducer function we defined.
 3. The store saves the new state defined by the reducer in the previous step. 
 4. The UI is updated to reflect the last version of the state.
 
 You can find more information about the data flow [here](http://redux.js.org/docs/basics/DataFlow.html)
 ### Server side architecture
 //TODO 

 
## Project's structure

 
 The client-side javascript sits inside the assets folder and it is organized in the following way:
 
```
 .
 +-- assets
 |   +-- components  // Shared components.
 |   |   +-- exampleComponent1
 |   |   |   +-- exampleComponent.jsx
 |   |   |   +-- exampleComponent.css
 |   |   +-- exampleComponent2
 |   +-- helpers     // Shared helpers.
 |   |   +-- helper.js  
 |   +-- images      
 |   +-- pages       // Support's pages
 |   |   +-- page1   // An specific page.    
 |   |   |   +-- actions    // Actions of a certain page/redux app.
 |   |   |   +-- components // Components of a certain page/redux app.
 |   |   |   |   +-- component1.jsx
 |   |   |   |   +-- component2.jsx
 |   |   |   +-- helpers    // Helpers of a certain page/redux app.
 |   |   |   +-- reducers   // Reducers of a certain page/redux app. 
 |   |   |   +-- page1.jsx  // Root component of a page.
 |   |   |   +-- page1.scss // Stylesheet containing all the style of this page's components.
 |   |   +-- page2
 |   +-- stylesheets // Shared stylesheets
 |       +-- main.scss //Entry point of the scss files.
 ...
```

#### Important notes:

* The UI of the project is organized in components. The shared components are self-contained and are located in the top
 `components` folder. The components specific to a page and which are not used in other pages are located inside the 
 `components` folder inside a specific page.
 
* The CSS for a non-shareable component is located inside the `page.scss` file.  
 

## CI build process

In order to build the project, team city runs a series of steps. The first step installs node js, the second build the 
assets by executing the script [`build-tc`](https://github.com/guardian/support-frontend/blob/master/build-tc). 
Finally, the third step compiles the Scala code, packages the frontend and backend, and uploads this to riff-raff ready 
to be deployed. All this steps are defined in [`build.sbt`](https://github.com/guardian/support-frontend/blob/master/build.sbt).
  

### Building assets

Our building process uses `npm scripts` as a orchestrator tool for assets. The available scripts are defined in the 
`package.json`. Those scripts, depending on what is the objective use other tools like [webpack](https://webpack.js.org/), 
[sass](http://sass-lang.com/guide), [babel](https://babeljs.io/), [eslint](http://eslint.org/) etc.

As an example, in order to build the assets for production, the step `build-prod` should be ran. This script runs:
  1. `clean` : Deletes the previous compiled assets.
  2. `validate` : Validates the javascript source code by running lint for style check and flow type check.
  3. `test` : Runs the javascript tests using jest.
  4. `webpack` : Runs webpack in production mode. Webpack runs the following series of processes:
   * babel: it transpile the javascript and jsx files, generating browser-compatible JavaScript.  
   * uglify: minify and compress the javascript. Additionally, it generates the source maps that are going to be used 
             by Sentry. 
   * asset hashing: Additionally, since the site has a [caching layer](https://app.fastly.com) sitting in front of it, 
   we append a hash to the name of the asset in order to invalidate the cache every time we make a release of the site. The configuration 
    is done [here](https://github.com/guardian/support-frontend/blob/master/webpack.config.js#L56). 

## Yarn commands

In order to run a yarn command you should run:

```
$ yarn run [name_command]
```

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
