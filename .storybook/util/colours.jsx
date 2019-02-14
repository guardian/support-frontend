import React, {type Node, Component} from 'react';

import { colours as allColours } from 'stylesheets/gu-sass/colours.json';
import WithState from './withState.jsx';
import './colours.scss';

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

const colourIsBright = colour => (
  parseInt(colour.substring(1, 3), 16) +
  parseInt(colour.substring(3, 5), 16) +
  parseInt(colour.substring(5, 7), 16)
) > (128 * 3);

const addMissingColoursToCategories = (categories, colours) => {
  const listed = Object.values(categories).reduce((prev, cur)=>[...prev, ...cur],[]);
  return {
    ...categories,
    others: Object.keys(colours)
      .filter(colour => !listed.includes(colour))
      .filter(colour=>!colour.includes('__'))
  }
}

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
        className="story-colours__colour"
        data-clicked={clicked}
        style={{
          background: colour,
          color: colourIsBright(colour) ? 'black' : 'white',
        }}
      >
        {colour}
        <div>{clicked?'copied':name}</div>
      </button>
    }
  </WithState>
);

const Colours = ({copyHex, categories}) => (
  <div>
    {
      Object.entries(addMissingColoursToCategories(categories, allColours)).map(([name, colours])=>(
        <div className="story-colours">
          <h2 className="story-colours__title">{name}</h2>
          <div className="story-colours__row">
          {
            colours.map(colour => (
              <Colour copyHex={copyHex} name={colour} colour={allColours[colour]} />
            ))
          }
          </div>
        </div>
      ))
    }
  </div>
)

export default Colours;
