# Development in Support The Guardian frontend

 In this guide we will go through the elements that conform Support Frontend, how they interact 
 and 

## Quick Technological stack

### Frontend
 * autoprefixer
 * babel
 * jest
 * preact
 * redux
 * flow
 * eslint
 * sass

### Backend
* Play

### Tools
 * webpack
 * npm registry
 * npm scripts
 * yarn
 * sbt


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
 
 ### Data flow 
 
 The data flows in the following way:
 
 
 1. The user interact with the UI and he or she generates an action. The action is dispatched to the store via  `store.dispatch(action)`.
 2. The store handle the action using the reducer function we defined.
 3. The store saves the new state defined by the reducer in the previous step. 
 4. The UI is updated to reflect the last version of the state.
 
 You can find more information about the data flow [here](http://redux.js.org/docs/basics/DataFlow.html)
 
 ### Project's structure
 
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



 
### Server side architecture
 

## Building process






