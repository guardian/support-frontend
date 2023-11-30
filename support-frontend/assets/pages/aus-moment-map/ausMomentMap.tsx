// ----- Imports ----- //
import { motion } from 'framer-motion';
import * as ophan from 'ophan';
import * as React from 'preact/compat';
import { renderPage } from 'helpers/rendering/render';
import './ausMomentMap.scss';
import { Blurb } from 'pages/aus-moment-map/components/blurb';
import { CloseButton } from 'pages/aus-moment-map/components/closeButton';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import type { TestimonialsCollection } from 'pages/aus-moment-map/types/testimonials';
import 'pages/aus-moment-map/types/testimonials';
import { TestimonialsContainer } from './components/testimonialsContainer';
import { useWindowWidth } from './hooks/useWindowWidth';

// ----- Custom hooks ----- //
const useTestimonials = () => {
	const [testimonials, setTestimonials] =
		React.useState<TestimonialsCollection | null>(null);

	const testimonialsEndpoint =
		'https://interactive.guim.co.uk/docsdata/18tKS4fsHcEo__gdAwp3UySA3-FVje72_adHBZBhWjXE.json';

	React.useEffect(() => {
		void fetch(testimonialsEndpoint)
			.then((response) => response.json())
			.then((data: { sheets: Record<string, unknown> }) => data.sheets)
			.then((testimonialsData) =>
				setTestimonials(testimonialsData as TestimonialsCollection),
			);
	}, []);

	return testimonials;
};

const territories = ['NSW', 'ACT', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

// ----- Render ----- //
function AusMomentMap(): JSX.Element {
	const [selectedTerritory, setSelectedTerritory] = React.useState<
		string | null
	>(null);
	const [shouldScrollIntoView, setShouldScrollIntoView] = React.useState(false);

	const mapRef = React.useRef<HTMLDivElement>(null);
	const testimonialsContainerRef = React.useRef<HTMLDivElement>(null);

	const testimonials = useTestimonials();
	const { windowWidthIsGreaterThan, windowWidthIsLessThan } = useWindowWidth();

	ophan.init();

	React.useEffect(() => {
		if (windowWidthIsLessThan('desktop')) {
			setSelectedTerritory(null);
		}
	});

	React.useEffect(() => {
		const onKeyDown = (e: { key: string }) => {
			if (e.key === 'Escape') {
				setSelectedTerritory(null);
			}

			// TODO - hint
			if (e.key === 'Right' || e.key === 'ArrowRight') {
				if (selectedTerritory) {
					const index =
						(territories.indexOf(selectedTerritory) + 1) % territories.length;
					setSelectedTerritory(territories[index]);
				} else {
					setSelectedTerritory(territories[0]);
				}

				setShouldScrollIntoView(true);
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [selectedTerritory]);

	const animationTransition = {
		type: 'tween',
		duration: 0.2,
	};

	const mapVariants = {
		initial: {
			width: '100%',
		},
		active: {
			width: '40%',
		},
	};

	const testimonialsVariants = {
		mobile: {
			x: '0vw',
		},
		initial: {
			x: '59vw',
		},
		active: {
			x: '-59vw',
		},
	};

	const blurbVariants = {
		initial: {
			display: 'none',
		},
		active: {
			display: 'block',
		},
	};

	const animationVariant = () =>
		windowWidthIsGreaterThan('desktop') && selectedTerritory
			? 'active'
			: 'initial';

	const testimonialsProps = () => {
		if (windowWidthIsGreaterThan('desktop')) {
			return {
				animate: animationVariant(),
				variants: testimonialsVariants,
				transition: animationTransition,
				positionTransition: true,
			};
		}

		return null;
	};

	const createTestimonialsContainer = () => (
		<TestimonialsContainer
			testimonialsCollection={testimonials}
			selectedTerritory={selectedTerritory}
			shouldScrollIntoView={shouldScrollIntoView}
			setSelectedTerritory={(territory) => {
				setSelectedTerritory(territory);
				setShouldScrollIntoView(false);
			}}
			ref={testimonialsContainerRef}
		/>
	);

	return (
		<div className="map-page">
			<Header />
			<div className="main">
				<motion.div
					className="left"
					variants={mapVariants}
					animate={animationVariant()}
					transition={animationTransition}
					positionTransition
				>
					{windowWidthIsLessThan('desktop') && <Blurb />}
					<Map
						selectedTerritory={selectedTerritory}
						setSelectedTerritory={(territory) => {
							setSelectedTerritory(territory);
							setShouldScrollIntoView(true);
						}}
						ref={mapRef}
					/>
					<motion.div
						className="left-padded-inner"
						transition={animationTransition}
						animate={animationVariant()}
						variants={blurbVariants}
					>
						<Blurb slim />
					</motion.div>
				</motion.div>
				<div className="right">
					{windowWidthIsGreaterThan('desktop') && <Blurb />}
					{windowWidthIsGreaterThan('desktop') ? (
						<motion.div
							className="testimonials-overlay"
							{...testimonialsProps()}
						>
							<CloseButton onClick={() => setSelectedTerritory(null)} />
							{createTestimonialsContainer()}
						</motion.div>
					) : (
						<div>{createTestimonialsContainer()}</div>
					)}
				</div>
			</div>
		</div>
	);
}

renderPage(<AusMomentMap />, 'aus-moment-map');
export { AusMomentMap };
