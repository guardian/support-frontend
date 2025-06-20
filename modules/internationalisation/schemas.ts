import { z } from 'zod';
import { IsoCurrency } from '@modules/internationalisation/currency';

export const isoCurrencySchema = z.nativeEnum(IsoCurrency);
