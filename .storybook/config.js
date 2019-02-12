import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import loadStories from '../stories/_index';

addDecorator(
  withOptions({
    name: 'support-ui',
    theme: {
      mainTextFace: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mainTextSize: 14,
      mainBorderRadius: 0,
      layoutMargin: 0,
      textColor: '#121212',
      barFill:  'linear-gradient(to bottom, #ededed 1px,#fff 1px)',
      barSelectedColor: '#ffe500',
      barBgColor: 'blue',    
      menuLink: {
        color: '#121212',
      },
      storiesNav: {
        backgroundColor: '#f6f6f6',
        borderRight: '1px solid #dcdcdc',
        paddingRight: 10,
      }
      
    }
  })
)

configure(loadStories, module);
