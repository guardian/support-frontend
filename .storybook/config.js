import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/button.jsx');
}

configure(loadStories, module);
