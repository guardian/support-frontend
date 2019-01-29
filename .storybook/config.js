import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/button.jsx');
  require('../stories/header.jsx');
  require('../stories/tabs.jsx');
}

configure(loadStories, module);
