import { getPromotionCopy } from '../promotions';

const sanitisablePromotionCopy = {
  title: 'The Guardian Weekly',
  description: 'The Guardian Weekly magazine:\n- is a round-up of the [world news opinion and long reads that have shaped the week.](https://www.theguardian.com/about/journalism)\n- with striking photography and insightful companion pieces, all handpicked from The Guardian and The Observer.',
  roundel: '**Save _25%_ for a year!**',
};

describe('getPromotionCopy', () => {
  it('should return promotion copy if it exists', () => {

    expect(getPromotionCopy()).toEqual({});

    expect(getPromotionCopy(sanitisablePromotionCopy)).not.toEqual({});

  });

  it('should return a santised html string when sanitisable promotion copy is provided', () => {

    expect(getPromotionCopy(sanitisablePromotionCopy).title).toEqual(sanitisablePromotionCopy.title);

    expect(getPromotionCopy(sanitisablePromotionCopy).description).toEqual('The Guardian Weekly magazine:<ul><li>is a round-up of the <a href="https://www.theguardian.com/about/journalism">world news opinion and long reads that have shaped the week.</a></li><li>with striking photography and insightful companion pieces, all handpicked from The Guardian and The Observer.</li></ul>');

    expect(getPromotionCopy(sanitisablePromotionCopy).roundel).toEqual('<strong>Save <em>25%</em> for a year!</strong>');

  });

});
