type OneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Digit = 0 | OneToNine;

type YYYY = `20${Digit}${Digit}`;

type MM = `0${OneToNine}` | `1${0 | 1 | 2}`;

type DD = `${0}${OneToNine}` | `${1 | 2}${Digit}` | `3${0 | 1}`;

export type DateYMDString = `${YYYY}-${MM}-${DD}`;
