import { render, screen } from '@testing-library/react';
import { PriceSummary } from './priceSummary';

describe('PriceSummary', () => {
	describe('without a discount', () => {
		it('renders the full price', () => {
			render(
				<PriceSummary fullPrice="£12" period="month" showPeriod={false} />,
			);

			expect(screen.getByText('£12')).toBeInTheDocument();
		});

		it('renders the full price with period when showPeriod is true', () => {
			render(<PriceSummary fullPrice="£12" period="month" showPeriod={true} />);

			expect(screen.getByText('£12/month')).toBeInTheDocument();
		});
	});

	describe('with a discount price', () => {
		it('renders the discounted price and strikes through the full price', () => {
			render(
				<PriceSummary
					fullPrice="£12"
					period="month"
					discountPrice="£6"
					showPeriod={true}
				/>,
			);

			expect(screen.getByText(/£12/)).toBeInTheDocument();
			expect(screen.getByText(/£12/).closest('span')).toHaveStyle(
				'text-decoration: line-through',
			);
			expect(screen.getByText(/£6/)).toBeInTheDocument();
		});

		it('renders visually hidden "Was" and "now" labels for screen readers', () => {
			render(
				<PriceSummary
					fullPrice="£12"
					period="month"
					discountPrice="£6"
					showPeriod={true}
				/>,
			);

			expect(screen.getByText('Was')).toBeInTheDocument();
			expect(screen.getByText(', now')).toBeInTheDocument();
		});

		it('does not render the strikethrough or screen reader labels when isIntroductoryPricing is true', () => {
			render(
				<PriceSummary
					fullPrice="£12"
					period="month"
					discountPrice="£6"
					showPeriod={true}
					isIntroductoryPricing={true}
				/>,
			);

			expect(screen.queryByText('Was')).not.toBeInTheDocument();
			expect(screen.queryByText(', now')).not.toBeInTheDocument();
			expect(screen.queryByText(/£12/)).not.toBeInTheDocument();
			expect(screen.getByText('£6/month')).toBeInTheDocument();
		});
	});

	describe('weekly gift divider', () => {
		it('uses "for" as the divider when isWeeklyGift is true', () => {
			render(
				<PriceSummary
					fullPrice="£12.00"
					period="6 weeks"
					showPeriod={true}
					isWeeklyGift={true}
				/>,
			);

			expect(screen.getByText('£12.00 for 6 weeks')).toBeInTheDocument();
		});

		it('uses "/" as the divider when isWeeklyGift is false', () => {
			render(
				<PriceSummary
					fullPrice="£12"
					period="month"
					showPeriod={true}
					isWeeklyGift={false}
				/>,
			);

			expect(screen.getByText('£12/month')).toBeInTheDocument();
		});
	});
});
