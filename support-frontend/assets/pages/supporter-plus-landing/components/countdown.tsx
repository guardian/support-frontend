import { css } from '@emotion/react';
import { headlineBold28, palette } from '@guardian/source/foundations';
import { useEffect, useState } from 'react';
/** 
 * This is used during the annual US End of Year Campaign.
 */

// create the style - TODO: design not yet confirmed... 
const grid = css`
    display: flex;
    padding-top: 33px;
    justify-content: center;
    align-items: center;
    `
const gridItem = css`
    font-variant-numeric: lining-nums proportional-nums;
    color: ${palette.brand[400]};
    background-color: ${palette.neutral[100]};
    /* 🖥 Headline/headline.bld.28 */
    ${headlineBold28}
    /* font-family: 'headlineBold28';
    font-size: 28px;
    font-style: normal;
    font-weight: 700; 
    line-height: 115%;*/ /* 32.2px */
    width: 65px;
    margin: 3px;
    padding: 2px;
    border: 1px solid ${palette.brand[400]};
    border-radius: 4px;
    `
const timePortion = css`
    color: ${palette.brand[400]};
    /* 🖥 Text Sans/text.sans.12 */
    font-family: 'GuardianTextSans';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; /* 15.6px */
    `

// props
export type CountdownProps = {
    deadlineDateTime: number; 
}

// create countdown logic

const initialTimePart = "00";
const millisecondsinSecond = 1000;
const millisecondsinMinute = 60 * millisecondsinSecond;
const millisecondsinHour = 60 * millisecondsinMinute;
const millisecondsInDay = 24 * millisecondsinHour;

// Questions:
    // could each portion be a component so that not everything gets updated each time? 
    // handle inactive tabs via the Page Visibility API and calculate on visibility change?
    // how do we assess performance?

const getTotalMillisRemaining = (targetDate: number) => {
    return targetDate - Date.now();
}

const ensureDoubleDigits = (timeSection: number): string => {
    if (timeSection < 0) {
        return '00'
    }
    else {
        return timeSection > 9 ?  timeSection.toString() : `0${timeSection.toString()}`
    }
}

// return a component
export default function Countdown({
    deadlineDateTime
}: CountdownProps): JSX.Element {

    const [seconds, setSeconds] = useState<string>(initialTimePart);
    const [minutes, setMinutes] = useState<string>(initialTimePart);
    const [hours, setHours] = useState<string>(initialTimePart);
    const [days, setDays] = useState<string>(initialTimePart);

    useEffect(() => {

        function updateTimeparts() {

            const timeRemainingOnInitialLoad = getTotalMillisRemaining(deadlineDateTime);
            if (timeRemainingOnInitialLoad <= 0) {
                setSeconds(ensureDoubleDigits(0));
                setMinutes(ensureDoubleDigits(0));
                setHours(ensureDoubleDigits(0)); 
                setDays(ensureDoubleDigits(0));               
                // console.log(`time <= 0 ${timeRemainingOnInitialLoad}`);
            }
            else {
                // console.log(`time > 0 ${timeRemainingOnInitialLoad}`);
                const d = Math.floor(timeRemainingOnInitialLoad/millisecondsInDay);
                const h = Math.floor(timeRemainingOnInitialLoad % millisecondsInDay / millisecondsinHour);
                const m = Math.floor(timeRemainingOnInitialLoad % millisecondsinHour / millisecondsinMinute);
                const s = Math.floor(timeRemainingOnInitialLoad % millisecondsinMinute / millisecondsinSecond);
                setSeconds(ensureDoubleDigits(s));
                setMinutes(ensureDoubleDigits(m));
                setHours(ensureDoubleDigits(h)); 
                setDays(ensureDoubleDigits(d)); 
            }
        }
        updateTimeparts();
        const id = setInterval(updateTimeparts, 1000);
        return () => clearInterval(id);

    },[deadlineDateTime]);


    return(
        <>
        <div css={grid}>
            <div css={gridItem}>
                <div>{days}</div>
                <div css={timePortion}>days</div>
            </div>
            <div css={gridItem}>
                <div>{hours}</div>
                <div css={timePortion}>hours</div>
            </div>
            <div css={gridItem}>
                <div>{minutes}</div>
                <div css={timePortion}>mins</div>
            </div>
            <div css={gridItem}>
                <div>{seconds}</div>
                <div css={timePortion}>secs</div>
            </div>
        </div>
        </>
    );
}
