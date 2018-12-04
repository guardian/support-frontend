// @flow
let count = 0;
let goal;
let total;

const percentageTotalAsNegative = () => {
  let percentage = (total / goal) * 100 - 100;
  if (percentage > 0) {
    percentage = 0;
  }
  return percentage;
};

const animateBar = () => {
  const progressBarElement = document.querySelector(
    '.contributions-landing-ticker__filled-progress'
  );

  if (progressBarElement && progressBarElement instanceof HTMLElement) {
    progressBarElement.style.transform = `translateX(${percentageTotalAsNegative()}%)`;
  }
};

const increaseCounter = () => {
  count += Math.floor(total / 100);
  const counterElement = document.querySelector(
    '.contributions-landing-ticker__so-far .contributions-landing-ticker__count'
  );

  if (counterElement && counterElement instanceof HTMLElement) {
    counterElement.innerHTML = `$${count.toLocaleString()}`;
    if (count >= total) {
      counterElement.innerHTML = `$${total.toLocaleString()}`;
    } else {
      window.requestAnimationFrame(increaseCounter);
    }
  }
};

const populateText = () => {
  const goalElement = document.querySelector(
    '.contributions-landing-ticker__goal .contributions-landing-ticker__count'
  );

  if (goalElement && goalElement instanceof HTMLElement) {
    goalElement.innerHTML = `$${goal.toLocaleString()}`;
  }
};

const fetchDataAndAnimate = () => {
  fetch(
    'https://interactive.guim.co.uk/docsdata-test/1ySn7Ol2NQLvvSw_eAnVrPuuRnaGOxUmaUs6svtu_irU.json'
  )
    .then(resp => resp.json())
    .then(data => {
      const showCount = data.sheets.Sheet1[0].showCount === 'TRUE';
      total = parseInt(data.sheets.Sheet1[0].total, 10);
      goal = parseInt(data.sheets.Sheet1[0].goal, 10);

      console.log('amounts: ', total, goal);

      if (showCount) {
        populateText();
        window.setTimeout(() => {
          window.requestAnimationFrame(increaseCounter);
          animateBar();
        }, 500);
      }
    });
};

export const initTicker = () => {
  fetchDataAndAnimate();
};
