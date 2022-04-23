import flatpickr from 'flatpickr';
import { Report } from 'notiflix/build/notiflix-report-aio';

import 'flatpickr/dist/flatpickr.min.css';

const ref = {
  inputData: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),

  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    dateCheck(selectedDates);
  },
};

let timerId = null;
let differentMilliseconds = null;

ref.startBtn.disabled = true;
ref.inputData.addEventListener('focus', onInputClick);
ref.startBtn.addEventListener('click', timerStart);

function onInputClick() {
  flatpickr(ref.inputData, options);
}

function timerStart() {
  timerId = setInterval(updateTimerClock, 1000);
}

function updateTimerClock() {
  differentMilliseconds -= 1000;

  if (differentMilliseconds < 1000) {
    Report.success('Timer is over!', ' <br/><br/>', 'Okay');

    clearInterval(timerId);
  }

  ref.days.innerHTML = addLeadingZero(convertMs(differentMilliseconds).days);
  ref.hours.innerHTML = addLeadingZero(convertMs(differentMilliseconds).hours);
  ref.minutes.innerHTML = addLeadingZero(convertMs(differentMilliseconds).minutes);
  ref.seconds.innerHTML = addLeadingZero(convertMs(differentMilliseconds).seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, 0);
}

function dateCheck(selectedDates) {
  const currentDate = options.defaultDate;
  const timerDate = selectedDates[0];

  if (timerDate > currentDate) {
    ref.startBtn.disabled = false;
    differentMilliseconds = timerDate - currentDate;
  } else {
    ref.startBtn.disabled = true;
    Report.failure('Please choose a date in the future', ' <br/><br/>', 'Okay');
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
