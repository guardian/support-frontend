import type { AuState } from "helpers/internationalisation/country";
export type Testimonial = {
  name: string;
  city: string;
  body: string;
};
export type TestimonialsCollection = Record<AuState, Array<Testimonial>>;