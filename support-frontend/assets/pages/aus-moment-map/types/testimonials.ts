import type { AuStateCode } from '@modules/internationalisation/state';

export type Testimonial = {
	name: string;
	city: string;
	body: string;
};
export type TestimonialsCollection = Record<AuStateCode, Testimonial[]>;
