import { render, screen } from '@testing-library/react';
import StudentPrice from './StudentPrice';

const oneYearStudentDiscount = {
	amount: 9,
	periodNoun: 'year',
	discountPriceWithCurrency: '£9',
	fullPriceWithCurrency: '£120',
};

const auStudentDiscount = {
	amount: 0,
	periodNoun: 'month',
	discountPriceWithCurrency: '$0',
	fullPriceWithCurrency: '$20',
	promoCode: 'UTS_STUDENT',
	promoDuration: 'two years',
	discountSummary: '$0/month for two years, then $20/month',
};

describe('StudentPrice Component', () => {
	it('renders only the full price when no discount is applied', () => {
		render(<StudentPrice studentDiscount={oneYearStudentDiscount} />);
		expect(screen.getByText('£9')).toBeInTheDocument();
		expect(screen.getByText('/year')).toBeInTheDocument();
		expect(screen.getAllByText('/year')).toHaveLength(1);
	});

	it('renders discount price and original price when discount applies', () => {
		render(<StudentPrice studentDiscount={auStudentDiscount} />);
		expect(screen.getByText('$0')).toBeInTheDocument();
		expect(screen.getByText('$20/month')).toBeInTheDocument();
		expect(
			screen.getByText(`for ${auStudentDiscount.promoDuration}`),
		).toBeInTheDocument();
		expect(screen.queryAllByText('/month', { exact: false })).toHaveLength(2);
	});

	it('renders discount price without duration when promoDuration is missing', () => {
		render(<StudentPrice studentDiscount={oneYearStudentDiscount} />);
		expect(screen.getByText('£9')).toBeInTheDocument();
		expect(screen.getByText('£120/year')).toBeInTheDocument();
		expect(screen.queryByText('for', { exact: false })).not.toBeInTheDocument();
	});

	it('applies strike-through style to the original price', () => {
		render(<StudentPrice studentDiscount={oneYearStudentDiscount} />);
		const originalPrice = screen.getByTestId('original-price');
		expect(originalPrice).toHaveTextContent('£120/year');
		expect(originalPrice).toHaveStyle('text-decoration: line-through');
	});
});
