import { render, screen } from '@testing-library/react';
import type { PaperHeroItems } from '../helpers/PaperHeroCopy';
import NewspaperHero from './NewspaperHero';

const paperHeroItems: PaperHeroItems = {
	titleCopy: 'Default title',
	bodyCopy: 'Default description',
	roundelCopy: 'Default roundel',
};

describe('NewspaperHero', () => {
	it('shows the default copy when there is no landing page copy', () => {
		render(<NewspaperHero paperHeroItems={paperHeroItems} />);

		expect(screen.getByText('Default title')).toBeInTheDocument();
		expect(screen.getByText('Default description')).toBeInTheDocument();
		expect(screen.getByText('Default roundel')).toBeInTheDocument();
	});

	it('shows the landing page copy from the promotion', () => {
		render(
			<NewspaperHero
				paperHeroItems={paperHeroItems}
				landingPageCopy={{
					title: 'Promo title',
					description: 'Promo <strong>description</strong>',
					roundelHtml: 'Promo roundel',
				}}
			/>,
		);

		expect(screen.getByText('Promo title')).toBeInTheDocument();
		expect(screen.getByText('description')).toBeInTheDocument();
		expect(screen.getByText('Promo roundel')).toBeInTheDocument();
		expect(screen.queryByText('Default title')).not.toBeInTheDocument();
		expect(screen.queryByText('Default description')).not.toBeInTheDocument();
		expect(screen.queryByText('Default roundel')).not.toBeInTheDocument();
	});
});
