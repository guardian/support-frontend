// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import CentredContainer from 'components/containers/CentredContainer';

const stories = storiesOf('Containers', module);

stories.add('Centred container', () => (
  <div style={{ width: '100%' }}>
    <CentredContainer>
      <div style={{ backgroundColor: '#ffe500' }}>
        this content is centred on the page
      </div>
    </CentredContainer>
  </div>
));
