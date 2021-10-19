// ----- Imports ----- //
import React, { Component } from 'react';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './contributionTicker.scss';
// ---- Types ----- //
type DataFromServer = {
	total: number;
	goal: number;
};
type StateTypes = {
	count: number;
	goal: number;
	dataFromServer: DataFromServer | null;
	goalReached: boolean;
};
type TickerEndType = 'unlimited' | 'hardstop';
type TickerCountType = 'money' | 'people';
type TickerCopy = {
	countLabel: string;
	goalReachedPrimary: string;
	goalReachedSecondary: string;
};
export type TickerSettings = {
	tickerCountType: TickerCountType;
	tickerEndType: TickerEndType;
	currencySymbol: string;
	copy: TickerCopy;
};
type PropTypes = TickerSettings & {
	onGoalReached: () => void;
};

// ---- Helpers ----- //
const getInitialTickerValues = (
	tickerCountType: TickerCountType,
): Promise<DataFromServer> =>
	fetch(
		tickerCountType === 'money' ? '/ticker.json' : '/supporters-ticker.json',
	)
		.then((resp) => resp.json())
		.then((data) => {
			const total = parseInt(data.total, 10);
			const goal = parseInt(data.goal, 10);
			return {
				total,
				goal,
			};
		});

/* *************************************************************
The progress bar always starts with a translationX of
-100% (which is 100% left of where it becomes visible). This
function calculates how far to the right it should be animated
by finding the percentage of the goal that has been fulfilled:
((total / goal) * 100) and then subtracting 100 from it.
Eg. if 40% of our goal has been fulfilled, we want to translate
the progress bar from -100% left to -60% left. The translation
grows nearer to 0 which represents 100% fulfilled.
*************************************************************** */
const percentageToTranslate = (total: number, end: number) => {
	const percentage = (total / end) * 100 - 100;
	return percentage > 0 ? 0 : percentage;
}; // ----- Component ----- //

export default class ContributionTicker extends Component<
	PropTypes,
	StateTypes
> {
	constructor(props: PropTypes) {
		super(props);
		this.increaseTextCounter = this.increaseTextCounter.bind(this);
		this.state = {
			count: 0,
			goal: 0,
			dataFromServer: null,
			goalReached: false,
		};
	}

	componentDidMount(): void {
		getInitialTickerValues(this.props.tickerCountType).then(
			({ total, goal }) => {
				/* ***************************************************************
      Starting the initial count at 80% of its total instead of 0
      affects the increaseTextCounter animation by making it shorter &
      therefore more performant. Animating from 0 to £50,000 (for instance)
      would take significantly longer than we want to run this animation.
      By running it for a short period, we give the experience of the
      number going up as if in real time without taking a big performance
      hit or making the user bored
      ***************************************************************** */
				const initialCount = total ? total * 0.8 : 0;
				const goalReached = !!total && !!goal && total >= goal;

				if (goalReached) {
					this.props.onGoalReached();
				}

				const dataFromServer = {
					total,
					goal,
				};
				this.setState({
					goal: goal || 0,
					count: initialCount || 0,
					dataFromServer,
					goalReached,
				});

				// Only run the number animation if the goal hasn't been reached yet
				if (!goalReached) {
					window.requestAnimationFrame(
						this.increaseTextCounter(dataFromServer).bind(this),
					);
				}
			},
		);
	}

	increaseTextCounter = (dataFromServer: DataFromServer) => () => {
		const nextCount = this.state.count + Math.floor(this.state.count / 100);
		const finishedCounting =
			nextCount <= this.state.count || // count isn't going up because total is too small
			nextCount >= dataFromServer.total;

		if (finishedCounting) {
			this.setState({
				count: dataFromServer.total,
			});
		} else {
			this.setState({
				count: nextCount,
			});
			window.requestAnimationFrame(this.increaseTextCounter(dataFromServer));
		}
	};
	renderContributedSoFar = () => {
		if (!this.state.goalReached) {
			return (
				<div className="contributions-landing-ticker__so-far">
					<div className="contributions-landing-ticker__count">
						{this.props.tickerCountType === 'money'
							? this.props.currencySymbol
							: ''}
						{Math.floor(this.state.count).toLocaleString()}
					</div>
					<div className="contributions-landing-ticker__count-label contributions-landing-ticker__label">
						{this.props.copy.countLabel}
					</div>
				</div>
			);
		}

		if (this.state.goalReached && this.props.tickerEndType === 'unlimited') {
			return (
				<div className="contributions-landing-ticker__so-far">
					<div className="contributions-landing-ticker__count">
						{this.props.copy.goalReachedPrimary}
					</div>
					<div className="contributions-landing-ticker__count-label contributions-landing-ticker__label">
						{this.props.copy.goalReachedSecondary}
					</div>
				</div>
			);
		}

		if (this.state.goalReached && this.props.tickerEndType === 'hardstop') {
			return (
				<div className="contributions-landing-ticker__so-far">
					<div className="contributions-landing-ticker__count">
						{this.props.copy.goalReachedPrimary}
					</div>
				</div>
			);
		}

		return <div className="contributions-landing-ticker__so-far" />;
	};

	render() {
		const goal = this.state.dataFromServer ? this.state.dataFromServer.goal : 0;
		const total = this.state.dataFromServer
			? this.state.dataFromServer.total
			: 0;
		// If we've exceeded the goal then extend the bar 15% beyond the total
		const end =
			this.props.tickerEndType === 'unlimited' && total > goal
				? total + total * 0.15
				: goal;

		/* *************************************************************
      `translate3d` is preferred to `translateX` because it uses the
      gpu to accelerate the animation. This is especially helpful for
      older computers or phones which may not have the CPU to handle
      two animations happening at the same time (the text counter and
      progress bar). Any transitions with `3d` or `z` in the name
      give you this acceleration, even when the `z-axis` is not being
      operated on.
      https://blog.teamtreehouse.com/increase-your-sites-performance-with-hardware-accelerated-css
      https://davidwalsh.name/translate3d
      *************************************************************** */
		const progressBarAnimation = `translate3d(${percentageToTranslate(
			total,
			end,
		)}%, 0, 0)`;
		const markerAnimation = `translate3d(${(goal / end) * 100 - 100}%, 0, 0)`;
		const readyToRender =
			!Number.isNaN(this.state.count) && this.state.count > -1;
		const classModifiers = [
			this.props.tickerEndType,
			this.state.goalReached ? 'goal-reached' : '',
			!readyToRender ? 'hidden' : '',
		];
		const baseClassName = 'contributions-landing-ticker';
		const wrapperClassName = classNameWithModifiers(
			baseClassName,
			classModifiers,
		);
		const goalValue =
			this.props.tickerEndType === 'unlimited' && total > goal
				? total
				: this.state.goal;
		return (
			<div className={wrapperClassName}>
				<div className="contributions-landing-ticker__values">
					{this.renderContributedSoFar()}
					<div className="contributions-landing-ticker__goal">
						<div className="contributions-landing-ticker__count">
							{this.props.tickerCountType === 'money'
								? this.props.currencySymbol
								: ''}
							{Math.floor(goalValue).toLocaleString()}
						</div>
						<div className="contributions-landing-ticker__count-label contributions-landing-ticker__label">
							{this.props.tickerEndType === 'unlimited' && total > goal
								? this.props.copy.countLabel
								: 'our goal'}
						</div>
					</div>
				</div>
				<div className="contributions-landing-ticker__progress-bar">
					<div className="contributions-landing-ticker__progress">
						<div
							className="contributions-landing-ticker__filled-progress"
							style={{
								transform: progressBarAnimation,
							}}
						/>
					</div>
					<div
						className="contributions-landing-ticker__marker"
						style={{
							transform: markerAnimation,
						}}
					/>
				</div>
			</div>
		);
	}
}
