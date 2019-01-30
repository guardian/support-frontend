import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/button.jsx');
  require('../stories/header.jsx');
  require('../stories/hero.jsx');
}

configure(loadStories, module);
