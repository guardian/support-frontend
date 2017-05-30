// @flow

// ----- Functions ----- //

const otherWaysOfContribute = (participation: object): string => {

  const variant:string = participation.otherWaysOfContribute;

  switch (variant) {
    case 'control' : return 'other ways you can support us';
    case 'variantA' : return 'other ways you can contribute';
    case 'variantB' : return 'other ways you can give us money';
    default : return 'other ways you can support us';
  }
};

export default otherWaysOfContribute;
