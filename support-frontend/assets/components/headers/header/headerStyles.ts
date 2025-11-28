export const brandPastel = '#506991';
export const gu_v_spacing = 12;
export const gu_h_spacing = 20;
const gu_col_width = 60;

export function gu_span(columns: number): number {
	return columns * gu_col_width + gu_h_spacing * (columns - 1);
}
