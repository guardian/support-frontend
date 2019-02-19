import React, {type Node, Component} from 'react';
import { palette } from '@guardian/pasteup/palette';

import WithState from './withState.jsx';
import { flatten } from '../../scripts/pasteup-sass'
import './colours.scss';

const allColours = flatten(palette);

const copyStringToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  if(document.body !== null){
    document.body.appendChild(el); 
  }
  el.select();
  document.execCommand('copy');
  if(document.body !== null){
    document.body.removeChild(el);
  }
}

const coloursInCategory = (palette, category) => 
  Object.entries(palette)
    .filter(([key])=>key.includes(category))
    .reduce((p, [key,val])=>({...p, [key]:val}),{});

const Colour = ({name, colour, copyHex}) => (
  <WithState initialState={{clicked: false}}>
    {({clicked}, setState) =>
      <button 
        onClick ={() => {
          copyStringToClipboard(copyHex?colour:`gu-colour(${name})`)
          setState({clicked: true})
        }}
        onMouseLeave={()=>{
          setState({clicked: false})
        }}
        className="story-colour"
        data-clicked={clicked}
      >
        <div         
          className="story-colour__tile"
          style={{
            background: colour,
          }}
        />
        <h4 className="story-colour__hex">{clicked?'copied':colour}</h4>
        <h5 className="story-colour__name">{name}</h5>
      </button>
    }
  </WithState>
);

const Colours = ({copyHex, category, palette}) => (
  <div className="story-colours">
    <h2 className="story-colours__title">{category}</h2>
    <div className="story-colours__row">
    {
      Object.entries(coloursInCategory(palette, category)).map(([name, colour]) => (
        <Colour copyHex={copyHex} name={name} colour={colour} />
      ))
    }
    </div>
  </div>
)

export default Colours;
