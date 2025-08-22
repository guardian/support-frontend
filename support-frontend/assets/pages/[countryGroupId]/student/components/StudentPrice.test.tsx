import { render, screen } from '@testing-library/react';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getStudentDiscount } from '../helpers/discountDetails';
import StudentPrice from './StudentPrice';

jest.mock('../helpers/discountDetails');

describe('StudentPrice Component', () => {
	const geoId: GeoId = 'us';
	const ratePlanKey: ActiveRatePlanKey = 'Monthly';

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('renders only the full price when no discount is applied', () => {
		(getStudentDiscount as jest.Mock).mockReturnValue({
			fullPriceWithCurrency: '£10',
			periodNoun: 'month',
		});

		render(<StudentPrice geoId={geoId} ratePlanKey={ratePlanKey} />);

		expect(screen.getByText('£10')).toBeInTheDocument();
		expect(screen.getByText('/month')).toBeInTheDocument();
		expect(screen.getAllByText('/month')).toHaveLength(1);
	});

	it('renders discount price and original price when discount applies', () => {
		(getStudentDiscount as jest.Mock).mockReturnValue({
			discountPriceWithCurrency: '£5',
			fullPriceWithCurrency: '£10',
			periodNoun: 'month',
			promoDuration: '3 months',
		});

		const { container } = render(
			<StudentPrice geoId={geoId} ratePlanKey={ratePlanKey} />,
		);

		expect(container).toHaveTextContent('£5/month');
		expect(container).toHaveTextContent('£10/month');
		expect(screen.getByText('for 3 months')).toBeInTheDocument();
		expect(screen.queryAllByText('/month', { exact: false })).toHaveLength(2);
	});

	it('renders discount price without duration when promoDuration is missing', () => {
		(getStudentDiscount as jest.Mock).mockReturnValue({
			discountPriceWithCurrency: '€8',
			fullPriceWithCurrency: '€12',
			periodNoun: 'month',
			promoDuration: undefined,
		});

		render(<StudentPrice geoId={geoId} ratePlanKey={ratePlanKey} />);

		expect(screen.getByText('€8')).toBeInTheDocument();
		expect(screen.getByText('€12/month')).toBeInTheDocument();
		expect(screen.queryByText('for', { exact: false })).not.toBeInTheDocument();
	});

	it('applies strike-through style to the original price', () => {
		(getStudentDiscount as jest.Mock).mockReturnValue({
			discountPriceWithCurrency: '£5',
			fullPriceWithCurrency: '£10',
			periodNoun: 'month',
			promoDuration: '3 months',
		});

		render(<StudentPrice geoId={geoId} ratePlanKey={ratePlanKey} />);

		const originalPrice = screen.getByTestId('original-price');
		expect(originalPrice).toHaveTextContent('£10/month');
		expect(originalPrice).toHaveStyle('text-decoration: line-through');
	});
});
