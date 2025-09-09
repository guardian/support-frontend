import type { AuState } from '@modules/internationalisation/country';

export type Testimonial = {
	name: string;
	city: string;
	body: string;
};
export type TestimonialsCollection = Record<AuState, Testimonial[]>;
