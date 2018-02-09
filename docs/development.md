# Development in Support The Guardian frontend

Welcome to Support Frontend. In this document we will go through the elements that form 
Support Frontend, how they interact and how you can start adding code to this repository.
  
## Table of contents

1. [Getting started](#1-getting-started)
2. [Introduction to the technological stack](#2-introduction-to-the-technological-stack)
3. [Architecture](#3-architecture)
4. [Project's structure](#4-projects-structure) 
5. [CI Build process](#5-ci-build-process)
6. [Testing](#6-testing)
7. [Yarn commands](#7-yarn-commands)
8. [A/B Test framework](#8-ab-test-framework)
9. [Test environments](#9-test-environments)
10. [CSS guidelines](#10-css-guidelines)
11. [Payment Diagrams](#11-payment-diagrams)

## 1. Getting started

Follow the instructions in [**setup.md**](setup.md) to setup your dev environment and
get `support-frontend` running locally.

## 2. Introduction to the technological stack

In the following diagram it is possible to see the entire ecosystem of the support platform:   

![Support Platform](support-platform.png)

Inside `support-frontend` you will find the code which runs in the reader's browser and in the application server.
Please bear in mind that `support-frontend` should not have external dependencies. 

The pieces that make up `support-frontend` are:

### Frontend's technologies
 * autoprefixer
 * babel
 * eslint
 * jest
 * preact
 * redux
 * flow
 * sass
 * Google tag manager and ophan for tracking
 * raven (sentry)

### Backend

* Scala
* Play

### Tools

 * npm registry
 * npm scripts
 * sbt
 * webpack
 * yarn
 
## 3. Architecture

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
 presentation layer. More information about React/Redux [here](http://redux.js.org/docs/basics/UsageWithReact.html).
 
 There are two type of React components, [presentational and container components](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components).
 The presentational components ***are not aware of Redux***, and their main purpose is to define how the data is shown to the 
 end reader. Meanwhile, the container components ***are aware of Redux*** and their main purpose is to maintain state and handle 
 the logic of the app. 
 
 #### Data flow 
 
 The data flows in the following way:
 
 
 1. The user interact with the UI and he or she generates an action. The action is dispatched to the store via  `store.dispatch(action)`.
 2. The store handles the action using the reducer function we defined.
 3. The store saves the new state defined by the reducer in the previous step. 
 4. The UI is updated to reflect the last version of the state.
 
 You can find more information about the data flow [here](http://redux.js.org/docs/basics/DataFlow.html).
 ### Server side architecture
 //TODO 

 
## 4. Project's structure

 
 The client-side javascript sits inside the assets folder and is organized in the following way:
 
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
 |   |   +-- page1   // A specific page.    
 |   |   |   +-- components // Components of a certain page/redux app.
 |   |   |   |   +-- component1.jsx
 |   |   |   |   +-- component2.jsx
 |   |   |   +-- helpers    // Helpers of a certain page/redux app.
 |   |   |   +-- page1.jsx  // Root component of a page.
 |   |   |   +-- page1.scss // Stylesheet containing all the style of this page's components.
 |   |   |   +-- page1Actions.js    // Actions of a certain page/redux app.
 |   |   |   +-- page1Reducers.js   // Reducers of a certain page/redux app.
 |   |   +-- page2
 |   +-- stylesheets // Shared stylesheets
 |       +-- main.scss //Entry point of the scss files.
 ...
```

#### Important notes:

* The UI of the project is organized in components. The shared components are self-contained and are located in the top
 `components` folder. Additionally, in order to keep the components as simple as possible, the **shared components are presentational components**. 
 The components specific to a page (which are not used in other pages) are located inside the 
 `components` folder inside a specific page.
 
* The CSS for a non-shareable component is located inside the `page.scss` file.  
 

## 5. CI build process

In order to build the project, team city runs a series of steps. The first step installs node js, the second builds the 
assets by executing the script [`build-tc`](https://github.com/guardian/support-frontend/blob/master/build-tc). 
Finally, the third step compiles the Scala code, packages the frontend and backend, and uploads this to riff-raff ready 
to be deployed. All these steps are defined in [`build.sbt`](https://github.com/guardian/support-frontend/blob/master/build.sbt).
  

### Building assets

Our build process uses `npm scripts` as a orchestrator tool for assets. The available scripts are defined in the 
`package.json`. Those scripts, depending on what they are trying to achieve, use other tools like [webpack](https://webpack.js.org/), 
[sass](http://sass-lang.com/guide), [babel](https://babeljs.io/), [eslint](http://eslint.org/) etc.

As an example, in order to build the assets for production, the step `build-prod` should be run. This script runs:
  1. `clean` : Deletes the previous compiled assets.
  2. `validate` : Validates the javascript source code by running lint for style check and flow type check.
  3. `test` : Runs the javascript tests using jest.
  4. `webpack` : Runs webpack in production mode. Webpack runs the following series of processes:
   * babel: Transpiles the javascript and jsx files, generating browser-compatible JavaScript.  
   * uglify: Minifies and compresses the javascript. Additionally, it generates the source maps that are going to be used 
             by Sentry. 
   * asset hashing: Since the site has a [caching layer](https://app.fastly.com) sitting in front of it, 
   we append a hash to the name of the asset in order to invalidate the cache every time we make a release of the site. The configuration 
    is [here](https://github.com/guardian/support-frontend/blob/master/webpack.config.js#L56). 
    
## 6. Testing

To run client-side tests:
```
yarn run test
```

To run server-side unit tests:
```
sbt test
```

To run end-to-end browser-driven tests:

```
sbt selenium:test
```

**Note** that you need to run *identity-frontend*, *contributions-frontend* and *support-frontend* locally before running the end-to-end tests.

## 7. Yarn commands

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
| `devrun`             | Cleans, transpiles, runs and watches the webpack-dev-server using `DEV` environment. |
| `webpack-dev-server` | Runs the webpack-dev-server in port `9111`. |
| `test or jest`        | Runs the client side tests built using Jest.  |
| `jest-update-snapshot`| Update [jest's snapshots](https://facebook.github.io/jest/docs/snapshot-testing.html)   |

## 8. A/B Test framework


8.1. [API](#71-api)

8.2. [How to set up the AB Test framework in a new page of the site](#72-set-up-the-ab-test-framework-in-a-new-page-of-the-site)

8.3. [How to implement a new test](#73-implementation-of-a-test)

In this section we will go through the steps and considerations that you must have when you want to set up a new test.

### 8.1 API

The AB test framework has the following methods:

#### `init()`
This function initialize the AB test framework by executing the following steps:
1. Read the MVT (multi variant testing) id from the users's cookie. If the user has no mvt in his or her browser, 
it generates a new MVTid and saves it in the cookie.

2. From the MVT, it generates the `Participations` object. The steps to build that object are:
   * Read the participations from `localStorage`
   * Check if the test is active.
   * If the user is not already assigned to a variant in `localStorage`, assign them to a variant based on the value of the `mvtId`.
   * Override the variant if the user passes the variant in the url using the form: `#ab-[name_of_test]=[variant_name]`.

3. Save the `Participations` object in `localStorage`. 

4. Submit an event to Ophan to track the initial impression for all active A/B tests.

#### `getVariantsAsString(participations: Participations)`
Takes the participation object and returns all variants as a string in the following format:

`test1=variantA; test2=variantB`

This method is used mainly when the developer wants to track the variants in GA. In order to achieve this, she or 
he has to set up the custom dimension called `experiment` with the value of the variants as a string. An example of this can be 
found [here](https://github.com/guardian/support-frontend/pull/68/files#diff-bdf2dc8b3411cc1e5f83ca22c698e7b3R31).  


#### `trackABOphan(participation: Participations, complete: boolean)`
Track event using `tracker-js` from Ophan. 

#### `abTestReducer(state: Participations = {}, action: Action)`
Reducer function to be included in the reducer of pages which import the AB test framework.

### 8.2 Set up the AB test framework in a new page of the site

#### Step 1: Initialize the AB test framework on the page you are working on
In order to use the AB test framework you have to initialize it in your page. To do this call the 
`init` function of the module, this will return a `Participations` object which should be passed to the Redux store.


```javascript 1.8

+// ----- AB Tests ----- //
 +
 +const participation = abTest.init();
  
 
 // ----- Redux Store ----- //
  
  const store = createStore(reducer);
  
 +store.dispatch({ type: 'SET_AB_TEST_PARTICIPATION', payload: participation });
 
```
 
 You can find a real example of this [here](https://github.com/guardian/support-frontend/pull/67/files#diff-bdf2dc8b3411cc1e5f83ca22c698e7b3R41).

#### Step 2: Add the AbTest reducer to your store

In order to be able to understand Redux AB actions, you have to add the `abTestReducer` to your page's reducer as follows:
 
```javascript 1.8
export default combineReducers({
  contribution,
  intCmp,
  abTests,
});
```
  
You can find a real example of this [here](https://github.com/guardian/support-frontend/pull/67/files#diff-c1f0bb180b22e8e0da8bde14c6b411c4R122).


### 8.3 Implementation of a test

#### Step 0: Define your experiment 
First **design the experiment** that you want to run. The experiment consist of a hypothesis and a 
number of variants. For example:
   
> Hypothesis: By changing **[`element_to_test`]**, it will **`[increase|decrease]`** the **`[put_some_metric]`** by **`number`%**

For example: 

> By **changing the background colour to black**, it will **increase** the **conversion rate** by **5**%


 

The amount of change you expect your test to achieve will affect the length of the test. To detect a smaller change, 
you need more samples and therefore a longer running test. This is related to the [statistical significance concept](https://en.wikipedia.org/wiki/Statistical_significance).
 
[This tool](http://powerandsamplesize.com/Calculators/Compare-2-Proportions/2-Sample-Equality) can help to 
compute the sample size of your experiment, from the sample size, you can then estimate the duration of your test.  

#### Step 1: Add your test to the Tests object

 After your hypothesis is defined, you can implement the test in the codebase. First, define the test 
 in the [`abtestDefinitions.js`](/assets/helpers/abTests/abtestsDefinitions.js) by adding a new field to the tests object. 
 
 ```javascript 1.8
 // ----- Tests ----- //
 
 export type Tests = { [testId: string]: Test }
 
 export const tests: Tests = {
   yourTestId: {
     variants: ['control', 'variant'],
     audiences: {
       GB: {
         offset: 0,
         size: 1,
       },
     },
     isActive: true,
     independent: false,
     seed: 0,
   },
 };
 ```
 
  The `tests` object represents all of the tests running on the site, where each key is a test ID and each value is an object with the following fields:
  
  * **variants**: This field is an array of strings, each string will be the name of a variant. One of these variant names has 
  to be **control**. 
  * **audiences**: The *audiences* object contains a field for every country where the test will run. Then each audience object has two fields:
    *   `offset`, a number from 0 to 1 which indicates the part of the audience that will be affected by the test.
    *   `size`: a number from 0 to 1 which specifies the percentage of the audience to be included in the test.
  
    For example a test with offset 0.2 and size 0.5 will affect 50% of the audience starting from the 20%.
  * **isActive**: Indicates whether the test is active or not. If the test is not active it is not possible to force any variant.
  * **independent**: Expresses whether the algorithm uses the mvtId (`independent: false`) or a random number (`independent: true`) to assign a user to a variant.   
  * **seed**: It is used only when `independent` is equal to `true`. It is useful to sync different tests. In other words, the user will be in the same variant across different tests. For example, two tests with two 
  variants (`control` and `variantA`) and the **same seed**, will cause that the user will be in `control` for both tests or `variantA` for both tests. Use this functionality carefully, if the tests are dependent on each other (e.g. part of the same flow), it is possible to invalidate both tests.
 
       
#### Step 2: Read the variant from the state

The test and its variant(s), are now present in the `abParticipations` object. You can find that object inside the `common` object which is in every state of every page. 
Once the container knows which variant is on, it will render the presentational component or element corresponding to that variant. 
Usually this can be achieved by creating a local (or global if the test is run across different pages) module that knows which component or element to instantiate depending 
on the variant. 

An example of the above can be found on [this line of the 'bundle landing' page](https://github.com/guardian/support-frontend/pull/217/files#diff-bdf2dc8b3411cc1e5f83ca22c698e7b3R37) 
which reads the variant and then pass the variant to the sub-components which will load the correct version on the variant. The module that knows which version to render can 
be found [here](https://github.com/guardian/support-frontend/commit/b73794ca3a24745c03a7f5df91e18bcef2a77f07#diff-4880b6e463a4ef5417549ccc19c9ef38R76). 

#### Step 3: Track events with GA and Ophan

Now that you are rendering the correct component depending on the variant, the final step is to track user conversion.
*Conversion* can mean different things depending on what you are testing, it could be a click on a video, a scroll action,
a button click, whether the user writes something in a text field, etc. Basically, it can be any event that the user can produce. 
Test displays are automatically tracked to Ophan, but in order to use abacus as your test tool, you have to track the test's conversion action.
  
This tracking can be done using the [`trackABOphan`](#71-api) function from the ABtest framework. This function 
receives an A/B participation and a flag indicating whether is a complete event or not (which should be `true` in the case of conversions).

If you are firing a conversion event for a specific test, be sure that the `participations` parameter you provide to `trackABOphan` only contains your test.

## 9 Test Environments

| Support |   Is test user?   | Stripe | PayPal | Support Workers | Zuora |
|:-------:|:-----------------:|:------:|:------:|:---------------:|:-----:|
|   `Dev`   |        `true`       |   `Dev`  | `Dev`    |       `Code`      | `UAT`   |
|   `Dev`   |       `false`       |   `Dev`  | `Dev`    |       `Code`      | `Dev`   |
|   `Code`  |        `true`       |   `Dev`  | `Dev`    |       `Code`      | `UAT`   |
|   `Code`  |       `false`       |   `Dev`  | `Dev`    |       `Code`      | `Dev`   |
|   `Prod`  |        `true`       |   `Dev`  | `Dev`    |       `Prod`      | `UAT`   |
|   `Prod`  | `false` (real user) |  `Prod`  | `Prod`   |       `Prod`      | `Prod`  |
 

## 10 CSS guidelines

Currently in `support-frontend` there are two types of components. 

Shared component: Components that are used in more than one page, they are located inside the global `components` folder. These should only contain rules which are context-independent. For instance, font sizes, colours, padding (since it's internal), margins of child elements. But margin on the parent, for example, should probably be avoided, because it's presupposing that it will be used in a particular place. This kind of positional styling should happen in the page-level CSS.

Non-shared component: Components specific to a page which are not used outside that page. Typically located inside the 
`components` folder of a certain page. 

The shared components have their own `.scss` file. Additionally, there is a `.scss` for every page, where we put the 
non-shared components and we add rules for the shared components in that specific page.

We follow the principles below when we write CSS files:

### 1. Apply style only via css classes. 

The classes should follow the [BEM](http://getbem.com/introduction/) convention system. The shared components should have the `component` prefix in their class names. 

#### Example:

**Bad:**

```scss
#double-heading {
  font-size: 22px;
}

h2 {
  color: gu-colour(neutral-1);
}
```

**Good:**

```scss
.component-double-heading {
  font-size: 22px;
}

.component-double-heading__subheading {
  color: gu-colour(neutral-1);
}
```

### 2. No nesting

Nesting should be avoided. The only case where it is justified is inside a CSS file of a page, where we nest the entire style of a page inside the page's id to avoid conflicts with other pages' rules.

#### Example:

##### Bad:

```sass
.component-cta-link {
  width: 200px;

  .component-cta-link__text {
    font-family: $gu-egyptian-web;
  }
}
```

##### Good:

```sass
.component-cta-link {
  width: 200px;
}

.component-cta-link__text {
  font-family: $gu-egyptian-web;
}
```
##### Page nesting example

The `.scss` file of `examplePage` will have the following shape:

```sass
#example-page {
  .component-example-component{
    // Specific rules for a shared component in this specific page
  }
}
```

### 3. Avoid overriding shared components CSS properties

When we add a shared component into a page, sometimes we would like to add extra CSS rules for that component. 
Those rules should be put inside the CSS file of a page. Additionally, we should not overide any rule of the shared 
component. If we find ourselves overriding a lot of CSS rules, that is an indicator that we probably should move those 
rules out of the shared component' css file and we should place them inside the pace specific file.

As an example, a shared component which will have a different position (determine via `margin-right`) in each page, 
should not have a `margin-right` value in the shared component'css file but inside each specific page. 

### 4. Use two spaces for indentation
When we write `css` files we should indent them using two-spaces and avoid other styles such as tabs or four-spaces.

#### Example:

##### Bad:

```sass
.component-cta-link {
    width: 200px;
}
```

##### Good:

```sass
.component-cta-link {
  width: 200px;
}
```    
      
### 5. Full Example

As an example consider the following CSS for a shared component called `DoubleHeading`. 


```sass
.component-double-heading {
  font-size: 28px;
  line-height: 32px;
}

.component-double-heading__heading {
  font-weight: 900;
  font-family: $gu-egyptian-web;
  color: gu-colour(neutral-1);
}

.component-double-heading__subheading {
  color: gu-colour(neutral-1);
  font-family: $gu-text-sans-web;
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;

  @include mq($from: phablet) {
    font-size: 24px;
    line-height: 28px;
  }
}

```

Note that we avoid nesting, we use a BEM approach and we prefix the classes with `component`. 

## 11 Payment Diagrams 
The following diagram shows the series of requests that take place for a One-Off PayPal payment
![This diagram shows the series of requests that take place for a One-Off PayPal payment ](https://user-images.githubusercontent.com/2844554/35405125-1a6a53ee-01fd-11e8-892b-8716f685d6d3.png)
