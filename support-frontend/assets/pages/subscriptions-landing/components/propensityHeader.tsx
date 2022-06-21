import { useState } from 'react';
import { classNameWithModifiers } from '../../../helpers/utilities/utilities';

function PropensityHeader(): JSX.Element {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<div className="subscriptions__feature">
			<div className="subscriptions__feature-container">
				<h2 className="subscriptions__feature-text">
					Based on your browsing history we recommend this product for you
				</h2>
				<button onClick={() => setOpen(!open)}>
					{open ? 'Close' : 'Learn More'}
				</button>
				<div
					className={classNameWithModifiers('learn-more', [
						open ? 'open' : null,
					])}
				>
					To improve your buying experience, we recommend the product we think
					you are most likely to enjoy. We do this by comparing your reading
					behaviour with the expected behaviour of existing subscribers. To see
					a full list of products, please visit our main{' '}
					<a href={'/uk/subscribe'}>Subscriptions Page</a>
					To understand and control how we use your data, see our
					<a href={'https://www.theguardian.com/help/privacy-policy'}>
						Privacy Policy
					</a>
				</div>
			</div>
		</div>
	);
}

export default PropensityHeader;
