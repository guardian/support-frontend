// ----- Imports ----- //
import { getProductPrice } from "helpers/productPrice/productPrices";
import { Annual, Quarterly, SixWeekly } from "helpers/productPrice/billingPeriods";
import { Domestic, getWeeklyFulfilmentOption, RestOfWorld } from "helpers/productPrice/fulfilmentOptions";
jest.mock('ophan', () => {});
// ----- Tests ----- //
const productPrices = {
  'United Kingdom': {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: {
          GBP: {
            price: 60,
            currency: 'GBP',
            promotions: []
          }
        },
        SixWeekly: {
          GBP: {
            price: 6,
            currency: 'GBP',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Annual: {
          GBP: {
            price: 240,
            currency: 'GBP',
            promotions: []
          }
        }
      }
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: {
          GBP: {
            price: 6,
            currency: 'GBP',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Quarterly: {
          GBP: {
            price: 37.5,
            currency: 'GBP',
            promotions: []
          }
        },
        Annual: {
          GBP: {
            price: 150,
            currency: 'GBP',
            promotions: [{
              name: '10% Off Annual Guardian Weekly Subs',
              description: 'Subscribe for 12 months and save 10%',
              promoCode: '10ANNUAL',
              discountedPrice: 135,
              numberOfDiscountedPeriods: 1,
              discount: {
                amount: 10,
                durationMonths: 12
              }
            }]
          }
        }
      }
    }
  },
  Europe: {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: {
          EUR: {
            price: 67.5,
            currency: 'EUR',
            promotions: []
          }
        },
        Annual: {
          EUR: {
            price: 270,
            currency: 'EUR',
            promotions: []
          }
        }
      }
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: {
          EUR: {
            price: 6,
            currency: 'EUR',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Quarterly: {
          EUR: {
            price: 61.3,
            currency: 'EUR',
            promotions: []
          }
        },
        Annual: {
          EUR: {
            price: 245.2,
            currency: 'EUR',
            promotions: [{
              name: '10% Off Annual Guardian Weekly Subs',
              description: 'Subscribe for 12 months and save 10%',
              promoCode: '10ANNUAL',
              discountedPrice: 220.68,
              numberOfDiscountedPeriods: 1,
              discount: {
                amount: 10,
                durationMonths: 12
              }
            }]
          }
        }
      }
    }
  },
  'New Zealand': {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: {
          NZD: {
            price: 132.5,
            currency: 'NZD',
            promotions: []
          }
        },
        Annual: {
          NZD: {
            price: 530,
            currency: 'NZD',
            promotions: []
          }
        }
      }
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: {
          NZD: {
            price: 6,
            currency: 'NZD',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Quarterly: {
          NZD: {
            price: 123,
            currency: 'NZD',
            promotions: []
          }
        },
        Annual: {
          NZD: {
            price: 492,
            currency: 'NZD',
            promotions: [{
              name: '10% Off Annual Guardian Weekly Subs',
              description: 'Subscribe for 12 months and save 10%',
              promoCode: '10ANNUAL',
              discountedPrice: 442.8,
              numberOfDiscountedPeriods: 1,
              discount: {
                amount: 10,
                durationMonths: 12
              }
            }]
          }
        }
      }
    }
  },
  Canada: {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: {
          CAD: {
            price: 86.25,
            currency: 'CAD',
            promotions: []
          }
        },
        Annual: {
          CAD: {
            price: 345,
            currency: 'CAD',
            promotions: []
          }
        }
      }
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: {
          CAD: {
            price: 6,
            currency: 'CAD',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Quarterly: {
          CAD: {
            price: 80,
            currency: 'CAD',
            promotions: []
          }
        },
        Annual: {
          CAD: {
            price: 320,
            currency: 'CAD',
            promotions: [{
              name: '10% Off Annual Guardian Weekly Subs',
              description: 'Subscribe for 12 months and save 10%',
              promoCode: '10ANNUAL',
              discountedPrice: 288,
              numberOfDiscountedPeriods: 1,
              discount: {
                amount: 10,
                durationMonths: 12
              }
            }]
          }
        }
      }
    }
  },
  Australia: {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: {
          AUD: {
            price: 106,
            currency: 'AUD',
            promotions: []
          }
        },
        Annual: {
          AUD: {
            price: 424,
            currency: 'AUD',
            promotions: []
          }
        }
      }
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: {
          AUD: {
            price: 97.5,
            currency: 'AUD',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Quarterly: {
          AUD: {
            price: 97.5,
            currency: 'AUD',
            promotions: []
          }
        },
        Annual: {
          AUD: {
            price: 390,
            currency: 'AUD',
            promotions: [{
              name: '10% Off Annual Guardian Weekly Subs',
              description: 'Subscribe for 12 months and save 10%',
              promoCode: '10ANNUAL',
              discountedPrice: 351,
              numberOfDiscountedPeriods: 1,
              discount: {
                amount: 10,
                durationMonths: 12
              }
            }]
          }
        }
      }
    }
  },
  International: {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: {
          GBP: {
            price: 60,
            currency: 'GBP',
            promotions: []
          },
          USD: {
            price: 81.3,
            currency: 'USD',
            promotions: []
          }
        },
        SixWeekly: {
          GBP: {
            price: 6,
            currency: 'GBP',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          },
          USD: {
            price: 6,
            currency: 'USD',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Annual: {
          GBP: {
            price: 240,
            currency: 'GBP',
            promotions: []
          },
          USD: {
            price: 325.2,
            currency: 'USD',
            promotions: []
          }
        }
      }
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: {
          GBP: {
            price: 6,
            currency: 'GBP',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          },
          USD: {
            price: 6,
            currency: 'USD',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Quarterly: {
          GBP: {
            price: 37.5,
            currency: 'GBP',
            promotions: []
          },
          USD: {
            price: 75,
            currency: 'USD',
            promotions: []
          }
        },
        Annual: {
          GBP: {
            price: 150,
            currency: 'GBP',
            promotions: [{
              name: '10% Off Annual Guardian Weekly Subs',
              description: 'Subscribe for 12 months and save 10%',
              promoCode: '10ANNUAL',
              discountedPrice: 135,
              numberOfDiscountedPeriods: 1,
              discount: {
                amount: 10,
                durationMonths: 12
              }
            }]
          },
          USD: {
            price: 300,
            currency: 'USD',
            promotions: [{
              name: '10% Off Annual Guardian Weekly Subs',
              description: 'Subscribe for 12 months and save 10%',
              promoCode: '10ANNUAL',
              discountedPrice: 270,
              numberOfDiscountedPeriods: 1,
              discount: {
                amount: 10,
                durationMonths: 12
              }
            }]
          }
        }
      }
    }
  },
  'United States': {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: {
          USD: {
            price: 81.3,
            currency: 'USD',
            promotions: []
          }
        },
        SixWeekly: {
          USD: {
            price: 6,
            currency: 'USD',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Annual: {
          USD: {
            price: 325.2,
            currency: 'USD',
            promotions: []
          }
        }
      }
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: {
          USD: {
            price: 6,
            currency: 'USD',
            promotions: [{
              name: 'Six For Six',
              description: 'Introductory offer',
              promoCode: '6FOR6',
              introductoryPrice: {
                price: 6,
                periodLength: 6,
                periodType: 'issue'
              }
            }]
          }
        },
        Quarterly: {
          USD: {
            price: 75,
            currency: 'USD',
            promotions: []
          }
        },
        Annual: {
          USD: {
            price: 300,
            currency: 'USD',
            promotions: [{
              name: '10% Off Annual Guardian Weekly Subs',
              description: 'Subscribe for 12 months and save 10%',
              promoCode: '10ANNUAL',
              discountedPrice: 270,
              numberOfDiscountedPeriods: 1,
              discount: {
                amount: 10,
                durationMonths: 12
              }
            }]
          }
        }
      }
    }
  }
};
describe('getPrice', () => {
  it('should return a price based on inputs', () => {
    const euroPriceQuarterly = getProductPrice(productPrices, 'FR', Quarterly, Domestic);
    expect(euroPriceQuarterly).toEqual({
      currency: 'EUR',
      price: 61.3,
      promotions: []
    });
    const audPriceSixForSix = getProductPrice(productPrices, 'AU', SixWeekly, Domestic);
    expect(audPriceSixForSix).toEqual({
      currency: 'AUD',
      price: 97.5,
      promotions: [{
        description: 'Introductory offer',
        introductoryPrice: {
          periodLength: 6,
          periodType: 'issue',
          price: 6
        },
        name: 'Six For Six',
        promoCode: '6FOR6'
      }]
    });
    const gbpPriceAnnual = getProductPrice(productPrices, 'GB', Annual, Domestic);
    expect(gbpPriceAnnual).toEqual({
      price: 150,
      currency: 'GBP',
      promotions: [{
        name: '10% Off Annual Guardian Weekly Subs',
        description: 'Subscribe for 12 months and save 10%',
        promoCode: '10ANNUAL',
        discountedPrice: 135,
        numberOfDiscountedPeriods: 1,
        discount: {
          amount: 10,
          durationMonths: 12
        }
      }]
    });
    const intPriceAnnual = getProductPrice(productPrices, 'CG', Annual, RestOfWorld);
    expect(intPriceAnnual).toEqual({
      currency: 'USD',
      price: 325.20,
      promotions: []
    });
  });
});
describe('getWeeklyFulfilmentOption', () => {
  it('should work out the correct fulfilment option for a country', () => {
    expect(getWeeklyFulfilmentOption('GB')).toEqual(Domestic);
    expect(getWeeklyFulfilmentOption('FR')).toEqual(Domestic);
    expect(getWeeklyFulfilmentOption('US')).toEqual(Domestic);
    expect(getWeeklyFulfilmentOption('AU')).toEqual(Domestic);
    expect(getWeeklyFulfilmentOption('AE')).toEqual(RestOfWorld);
  });
});