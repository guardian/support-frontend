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
        color: '#767676',
        marginLeft: '0em',
        padding: '.3em 0 .4em 1.55em',
      },
      activeMenuLink: {
        color: '#121212',
        background: 'transparent',
      },
      treeMenuHeader: {
        color: '#333',
        fontSize: 13,
        paddingTop: '.5em'
      },      
      brandLink: {
        background: 'url("logo.svg") no-repeat bottom left',
        backgroundSize: 'contain',
        textIndent: '-9999em',
        border: '0',
        minWidth: '10em',
      },
      filter: {
        backgroundColor: 'transparent',
        border: '1px solid #dcdcdc',
      },
      storiesNav: {
        backgroundColor: '#f6f6f6',
        borderRight: '1px solid #dcdcdc',
        paddingRight: 10,
        'ul': {
          marginLeft: '-1em'
        }
      }
      
    }
  })
)

configure(loadStories, module);
