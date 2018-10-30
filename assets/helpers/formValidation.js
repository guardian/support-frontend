// @flow

// Copied from
// https://github.com/playframework/playframework/blob/38abd1ca6d17237950c82b1483057c5c39929cb4/framework/src/play/
// src/main/scala/play/api/data/validation/Validation.scala#L80
// but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
// for compatibility with Stripe
export const emailRegexPattern = '^[a-zA-Z0-9\\.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$';

export const isNotEmpty: string => boolean = input => !!input && input.trim() !== '';
export const isValidEmail: string => boolean = input => new RegExp(emailRegexPattern).test(input);
export const isLargerOrEqual: (number, string) => boolean = (min, input) => min <= parseFloat(input);
export const isSmallerOrEqual: (number, string) => boolean = (max, input) => parseFloat(input) <= max;
export const maxTwoDecimals: string => boolean = input => new RegExp('^\\d+\\.?\\d{0,2}$').test(input);

export const checkFirstName: string => boolean = isNotEmpty;
export const checkLastName: string => boolean = isNotEmpty;
export const checkState: (string | null) => boolean = s => typeof s === 'string' && isNotEmpty(s);
export const checkEmail: string => boolean = input => isNotEmpty(input) && isValidEmail(input);
