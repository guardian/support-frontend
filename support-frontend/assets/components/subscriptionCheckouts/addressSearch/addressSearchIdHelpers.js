// @flow

const inputId = (scope: string) => `${scope}-search`;

const labelId = (scope: string) => `${scope}-search-label`;

const resultsListId = (scope: string) => `${scope}-search-results`;

const resultsListItemId = (scope: string, index: number) => (index !== -1 ?
  `${scope}-search-results-item-${index}` : null);

export { inputId, labelId, resultsListId, resultsListItemId };
