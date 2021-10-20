import React from "react";
import { storiesOf } from "@storybook/react";
import { radios, withKnobs } from "@storybook/addon-knobs";
import CentredContainer from "components/containers/centredContainer";
import FullWidthContainer from "components/containers/fullWidthContainer";
import FlexContainer from "components/containers/flexContainer";
const stories = storiesOf('Containers', module).addDecorator(withKnobs);
stories.add('Centred container', () => <div style={{
  width: '100%'
}}>
    <CentredContainer>
      <div style={{
      backgroundColor: '#ffe500',
      padding: '12px',
      height: '200px',
      width: '100%'
    }}>
        This content is centred on the page
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Quisque id justo at est elementum egestas rhoncus eu nulla.
          Proin pellentesque massa at metus condimentum, a aliquam erat condimentum. Vivamus quis rutrum nulla.
          Curabitur ut ullamcorper magna, eu ornare nunc.
        </p>
      </div>
    </CentredContainer>
  </div>);
stories.add('Full-width container', () => {
  const theme = radios('Container theme', {
    light: 'light',
    dark: 'dark',
    white: 'white',
    brand: 'brand'
  }, 'light');
  return <FullWidthContainer theme={theme}>
      <CentredContainer>
        <div style={{
        backgroundColor: 'white',
        color: 'black',
        padding: '12px',
        height: '200px',
        width: '100%'
      }}>
            This content is inside a full-width container
          <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Quisque id justo at est elementum egestas rhoncus eu nulla.
              Proin pellentesque massa at metus condimentum, a aliquam erat condimentum. Vivamus quis rutrum nulla.
              Curabitur ut ullamcorper magna, eu ornare nunc.
          </p>
        </div>
      </CentredContainer>
    </FullWidthContainer>;
});
stories.add('Flex container', () => <div style={{
  width: '100%'
}}>
    <CentredContainer>
      <FlexContainer>
        <p style={{
        border: '1px solid black',
        padding: '12px',
        height: '200px',
        minWidth: '50%'
      }}>Elements inside the flex container sit in a column on mobile,
        </p>
        <p style={{
        border: '1px solid black',
        padding: '12px',
        height: '200px',
        minWidth: '50%'
      }}>and side-by-side from tablet and above
        </p>
      </FlexContainer>
    </CentredContainer>
  </div>);