// TODO: Calculate the value in `offer`, once marketing has decided on the best copy option

export const discountCopyChoices = {
  control: {
    roundal: ['Save up to','37%'],
    heading: `Save up to 37% on The Guardian and The Observer - all year round`,
    offer: [
        `Save 37% a month on retail price`,
        'Save 33% a month on retail price',
        'Save 25% a month on retail price',
        'Save 22% a month on retail price'
    ]
  },
  save: {
    roundal: ['Save up to', '£27.78', 'per month'],
    heading: `Save up to £27 per month on
        The Guardian and The
        Observer - all year round
    `,
    offer: []
  },
  from: {
    roundal: ['from', '£1.57', 'per issue'],
    heading: `Subscribe to The Guardian and
        The Observer from £1.57 per
        issue - all year round
    `,
    offer: [
        'Pay only £1.57 per issue',
        'Pay only £1.58 per issue',
        'Pay only £2.40 per issue',
        'Pay only £2.49 per issue'
    ]
  },
  getupto: {
    roundal: ['Get up to', '11', 'issues free per mth'],
    heading: `Subscribe to the Guardian and 
        The Observer, and enjoy up to 
        11 free issues a month
    `,
    offer: [
        'Savings worth 11 extra issues a month',
        'Savings worth 8 extra issues a month',
        'Savings worth 2 extra issues a month',
        `Savings worth 1 extra 
          issue a month`
    ]
  }
}

type DiscountCopy = {|
  roundal: string,
  heading: string,
  offer: string,
|}

export const getDiscountCopy = (discountParam: ?string): DiscountCopy => {
    const discountCopy = discountCopyChoices[discountParam] || discountCopyChoices.control

    return {
        roundal: discountCopy.roundal,
        heading: discountCopy.heading,
        offer: discountCopy.offer,
    }
}
