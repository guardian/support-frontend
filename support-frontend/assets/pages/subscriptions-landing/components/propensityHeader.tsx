import { useState } from 'react';
import { classNameWithModifiers } from '../../../helpers/utilities/utilities';

function PropensityHeader({product}: {product: string}): JSX.Element {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<div className="subscriptions__feature">
			<div className="subscriptions__feature-container">
				<h2 className="subscriptions__feature-text">
					Based on your browsing history we recommend our {product}
				</h2>
				<button onClick={() => setOpen(!open)}>
					{open ? 'Close' : 'Learn More'}
				</button>
				<div
					className={classNameWithModifiers('learn-more', [
						open ? 'open' : null,
					])}
				>
                    <p>
					To improve your buying experience, we recommend the product we think
					you are most likely to enjoy. We do this by comparing your reading
					behaviour on theguardian.com only with the expected behaviour of existing subscribers.
                    </p><p>
					To understand and control how we use your data, see our
					<a href={'https://www.theguardian.com/help/privacy-policy'}>
						Privacy Policy
					</a>
                </p><p>
                    We only use data that is allowed for the purpose, data points we use include
                    <ul className={"subscriptions__feature-ul"}>
                        <li>Operating system and device category e.g. Mobile Android</li>
                        <li>App or Web user</li>
                        <li>Region e.g. Europe</li>
                        <li>How much you read each area of the site e.g. sport: 15, uk_news: 24</li>
                        <li>How often you arrived from Google, Facebook, Twitter etc</li>
                        <li>Rough times of day and week you read at.</li>
                        <li>How much and how long you spend on the site on average</li>
                    </ul>
                </p>
				</div>
			</div>
		</div>
	);
}

export default PropensityHeader;
