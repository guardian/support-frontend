import { headline, body } from '@guardian/src-foundations/typography';
import { textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { border, brandAltBackground, text } from '@guardian/src-foundations/palette';


const styles = {
  wrapper: {
    padding: `${space[3]}px`,
    color: `${text.primary}`,
  },

  topLine: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: `${space[3]}px`,

    'a, a:visited': {
      display: 'block',
      ...textSans.medium(),
      color: `${text.primary}`,
    },
  },

  sansTitle: {
    ...textSans.medium({ fontWeight: 'bold' }),
  },

  contentBlock: {
    display: 'block',
    width: '100%',
    marginBottom: `${space[3]}px`,
  },

  imageContainer: {
    display: 'inline-flex',
    width: '73px',
    height: '65px',
    paddingTop: '8px',
    backgroundColor: `${border.primary}`,
    overflow: 'hidden',
    position: 'absolute',
    img: {
      width: '160%',
      alignItems: 'flex-end',
    },
  },

  textBlock: {
    marginLeft: '82px',
    h3: {
      ...headline.xxsmall(),
      fontWeight: 'bold',
      '@media (min-width: 740px) and (max-width: 975px)': {
        ...body.medium(),
        fontWeight: 'bold',
      },
    },
    'p, span': {
      ...body.medium(),
      maxWidth: '220px',
      '@media (min-width: 740px) and (max-width: 975px)': {
        ...body.small(),
      },
    },
    span: {
      backgroundColor: `${brandAltBackground.primary}`,
      padding: `0 ${space[1]}px`,
    },
  },

};

export default styles;
