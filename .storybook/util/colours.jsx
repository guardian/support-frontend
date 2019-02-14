import React, {type Node, Component} from 'react';

import { colours as allColours } from 'stylesheets/gu-sass/colours.json';

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

const getCategories = (colours) => {
  const categories = {
    brand: ['brand-dark', 'brand-main', 'brand-pastel'],
    neutrals: ['brightness-7', 'brightness-20', 'brightness-46', 'brightness-60', 'brightness-86', 'brightness-93', 'brightness-97', 'brightness-100'],
    state: ['highlight-main', 'highlight-dark', 'green-main', 'green-dark', 'error', 'success'],
    news: ['news-dark', 'news-main', 'news-bright', 'news-pastel', 'news-faded'],
    opinion: ['opinion-dark', 'opinion-main', 'opinion-bright', 'opinion-pastel', 'opinion-faded'],
    sport: ['sport-dark', 'sport-main', 'sport-bright', 'sport-pastel', 'sport-faded'],
    culture: ['culture-dark', 'culture-main', 'culture-bright', 'culture-pastel', 'culture-faded'],
    lifestyle: ['lifestyle-dark', 'lifestyle-main', 'lifestyle-bright', 'lifestyle-pastel', 'lifestyle-faded'],
  };
  
  const listed = Object.values(categories).reduce((prev, cur)=>[...prev, ...cur],[]);
    
  return {
    ...categories,
    others: Object.keys(colours)
      .filter(colour => !listed.includes(colour))
      .filter(colour=>!colour.includes('__'))
  }
}

const Colour = ({name, colour, copyHex}) => (
  colour && <button 
  onClick ={() => {
    copyStringToClipboard(copyHex?colour:`gu-colour(${name})`)
  }}
  style={{
    background: colour,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '10rem',
    fontFamily: 'monospace',
    height: '10rem',
    borderRadius:'100%',
    border: `1px solid ${allColours['brightness-93']}`,
  }}>
    <div style={{
      color: parseInt(colour.substring(1,3), 16) > 126 ? 'black' : 'white',
      fontSize: '1em',
    }}>
      <strong>{colour}</strong>
      <div>{name}</div>
    </div>
  </button>
);

const Colours = ({copyHex}) => (
  <div>
    {
      Object.entries(getCategories(allColours)).map(([name, colours])=>(
        <div style={{
          padding: '2rem'
        }}>
          <h2 style={{
            marginBottom: '1rem',
            fontFamily: '"Guardian Headline", Georgia, serif',
            fontWeight: 700,
            fontSize: '1.2rem'
          }}>{name}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, 10rem)',
            gap: '1rem',
          }}>
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
