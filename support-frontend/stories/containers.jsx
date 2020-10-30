// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import CentredContainer from 'components/containers/CentredContainer';
import FullWidthContainer from 'components/containers/FullWidthContainer';
import FlexContainer from 'components/containers/FlexContainer';

const stories = storiesOf('Containers', module);

stories.add('Centred container', () => (
  <div style={{ width: '100%' }}>
    <CentredContainer>
      <div style={{
          backgroundColor: '#ffe500', padding: '12px', height: '200px', width: '100%',
        }}
      >
        This content is centred on the page
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Quisque id justo at est elementum egestas rhoncus eu nulla.
          Proin pellentesque massa at metus condimentum, a aliquam erat condimentum. Vivamus quis rutrum nulla.
          Curabitur ut ullamcorper magna, eu ornare nunc.
        </p>
      </div>
    </CentredContainer>
  </div>
));

stories.add('Full-width container', () => (
  <FullWidthContainer>
    <CentredContainer>
      <div style={{
          backgroundColor: 'white', padding: '12px', height: '200px', width: '100%',
        }}
      >
          This content is inside a full-width container
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Quisque id justo at est elementum egestas rhoncus eu nulla.
            Proin pellentesque massa at metus condimentum, a aliquam erat condimentum. Vivamus quis rutrum nulla.
            Curabitur ut ullamcorper magna, eu ornare nunc.
        </p>
      </div>
    </CentredContainer>
  </FullWidthContainer>
));

stories.add('Flex container', () => (
  <div style={{ width: '100%' }}>
    <CentredContainer>
      <FlexContainer>
        <p style={{
          border: '1px solid black', padding: '12px', height: '200px', width: '50%',
        }}
        >Elements inside the flex container sit in a column on mobile,
        </p>
        <p style={{
          border: '1px solid black', padding: '12px', height: '200px', width: '50%',
        }}
        >and side-by-side from tablet and above
        </p>
      </FlexContainer>
    </CentredContainer>
  </div>
));
