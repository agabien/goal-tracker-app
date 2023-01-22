export {
  date,
  lastDay,
  nextDays,
  handleCalendarArrows,
  renderMonth,
  displayGoalsOnCalendar,
  checkIfDailyGoalsDone,
};

let lastDay: number;
let nextDays: number;
let handleCalendarArrows: Function;
let numberOfGoalsPerDay = [];

let date = new Date();

const renderMonth = (startDate?: Date) => {
  if (startDate) {
    date = startDate;
  }
  const monthDays = document.querySelector(".days");
  const monthAndYearText = document.querySelector(".date h1");
  const actualDateText = document.querySelector(".date p");
  const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  const firstDayIndex = date.getDay();
  const lastDayIndex =
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay() - 1;
  const prevDays = firstDayIndex === 0 ? 5 : firstDayIndex - 2;
  let days = "";

  date.setDate(1);

  lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  nextDays = 7 - lastDayIndex;

  monthAndYearText.innerHTML = `${
    months[date.getMonth()]
  } ${date.getFullYear()}`;

  actualDateText.innerHTML = new Date().toDateString();

  for (let x = prevDays; x >= 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    ) {
      days += `<div class="day today">${i}</div>`;
    } else {
      days += `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j < nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innerHTML = days;
  }
};

const handleLeftArrow = (renderMonthFunction: Function) => {
  date.setMonth(date.getMonth() - 1);
  lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  renderMonthFunction();
};

const handleRightArrow = (renderMonthFunction: Function) => {
  date.setMonth(date.getMonth() + 1);
  lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  renderMonthFunction();
};

handleCalendarArrows = (renderMonthFunction: Function) => {
  const prevArrow = document.querySelector(".prev");
  const nextArrow = document.querySelector(".next");

  prevArrow.addEventListener("click", () => {
    handleLeftArrow(renderMonthFunction);
  });

  nextArrow.addEventListener("click", () => {
    handleRightArrow(renderMonthFunction);
  });
};

const displayGoalsOnCalendar = (
  cursorValueDate: string,
  renderColorCode: Function,
  cursorValueColor: string,
  cursorValueTaskTitle: string,
  cursorValueDaysComments: string,
  daysDiv: HTMLCollection,
  dayBoxOverlay: HTMLElement,
  dayBoxModal: HTMLElement,
  dailyGoalForm: HTMLInputElement,
  dailyGoalFormSubmitButton: HTMLInputElement,
  updateResult: Function,
  db,
  displayData: Function
) => {
  for (let k = 0; k < lastDay; k++) {
    let temp = cursorValueDate.split("-");
    let goalDate = new Date(temp[0], temp[1] - 1, temp[2]);
    let tempDate = new Date(date.getFullYear(), date.getMonth(), k);

    const miliseconds = 86400000 * 2;

    if (
      goalDate.getTime() > tempDate.getTime() &&
      tempDate.getTime() + miliseconds >= new Date().getTime()
    ) {
      const actualGoalColor = renderColorCode(cursorValueColor);
      const actualGoalColorDailyForm = renderColorCode(cursorValueColor);
      const actualGoalName = cursorValueTaskTitle;
      let num = 0;

      daysDiv[k].append(actualGoalColor);

      numberOfGoalsPerDay.push({ day: k + 1, numberOfGoals: 1 });

      for (const obj of numberOfGoalsPerDay) {
        for (const dayChecker in obj) {
          if (k === obj[dayChecker]) {
            num++;
            numberOfGoalsPerDay[numberOfGoalsPerDay.length - 1].numberOfGoals =
              num;
          }
        }
      }

      daysDiv[k].addEventListener("click", () => {
        const result = createModalWithDayCommentsInputs(
          dayBoxOverlay,
          dayBoxModal,
          dailyGoalForm,
          dailyGoalFormSubmitButton,
          actualGoalColorDailyForm,
          actualGoalName
        );

        const { actualInput, dailyGoalContainer } = result;

        const dailyGoalFormSubmitButtons = document.querySelectorAll(
          ".daily-goal-form-btn"
        );

        for (let i = 0; i < dailyGoalFormSubmitButtons.length; i++) {
          const btnId = dailyGoalFormSubmitButtons[i].getAttribute("id");

          dailyGoalFormSubmitButtons[i].addEventListener("click", () => {
            if (actualGoalName === btnId && actualInput.value) {
              addDayGoalComment(
                actualInput,
                tempDate,
                k,
                btnId,
                dailyGoalContainer,
                updateResult,
                db,
                displayData
              );
            }
          });
        }
      });

      for (const obj of cursorValueDaysComments) {
        for (const day in obj) {
          if (
            obj[day] === `${k + 1}-${date.getMonth()}-${date.getFullYear()}`
          ) {
            daysDiv[k].classList.remove("dayChecked");
            actualGoalColor.classList.remove("opacity");
            actualGoalColor.classList.add("done");
          }
        }
      }
    }
  }
  checkIfDailyGoalsDone(daysDiv);
};

const checkIfDailyGoalsDone = (daysDiv) => {
  for (let k = 1; k < daysDiv.length; k++) {
    daysDiv[k].classList.remove("dayChecked");

    let allColorDotsPerDay: HTMLSpanElement[] =
      daysDiv[k].getElementsByClassName("dot");

    let goalsDone: HTMLSpanElement[] =
      daysDiv[k].getElementsByClassName("done");

    if (
      allColorDotsPerDay.length === goalsDone.length &&
      goalsDone.length > 0
    ) {
      daysDiv[k].classList.add("dayChecked");
    }
  }
};

const createModalWithDayCommentsInputs = (
  dayBoxOverlay: HTMLElement,
  dayBoxModal: HTMLElement,
  dailyGoalForm: HTMLInputElement,
  dailyGoalFormSubmitButton: HTMLInputElement,
  actualGoalColorDailyForm: HTMLElement,
  actualGoalName: string
) => {
  const dailyGoalContainer = document.createElement("div");
  const dailyGoalFormLabel = document.createElement("label");

  dayBoxOverlay.classList.remove("hidden");
  dayBoxModal.classList.remove("hidden");

  dailyGoalForm = document.createElement("input");
  dailyGoalForm.classList.add("day-box__form");
  dailyGoalFormSubmitButton = document.createElement("input");
  dailyGoalFormSubmitButton.type = "submit";
  dailyGoalFormSubmitButton.classList.add("btn-green");
  dailyGoalFormSubmitButton.classList.add("daily-goal-form-btn");
  dailyGoalFormSubmitButton.setAttribute("id", `${actualGoalName}`);
  dailyGoalContainer.classList.add("daily-goal-container");
  dailyGoalForm.setAttribute("id", "days-comment");
  dailyGoalFormLabel.setAttribute("for", "days-comment");
  dailyGoalFormLabel.textContent = `Co dziś zrobiłeś, żeby być bliżej celu ${actualGoalName}?`;

  const actualInput = dailyGoalForm;

  dailyGoalContainer.prepend(actualGoalColorDailyForm);
  dailyGoalContainer.appendChild(dailyGoalFormLabel);
  dailyGoalContainer.appendChild(dailyGoalForm);
  dailyGoalContainer.appendChild(dailyGoalFormSubmitButton);
  dayBoxModal.appendChild(dailyGoalContainer);

  return { actualInput, dailyGoalContainer };
};

const addDayGoalComment = (
  actualInput: HTMLInputElement,
  tempDate: Date,
  k: number,
  btnId: string,
  dailyGoalContainer: HTMLElement,
  updateResult: Function,
  db,
  displayData: Function
) => {
  const addedComment = actualInput.value;
  const day = `${k + 1}-${tempDate.getMonth()}-${tempDate.getFullYear()}`;
  const dayToDisplay = `${k + 1}.${
    tempDate.getMonth() + 1
  }.${tempDate.getFullYear()}`;

  const newGoal = { day, addedComment };
  updateResult(db, displayData, newGoal, btnId);

  actualInput.style.display = "none";
  dailyGoalContainer.textContent = `${dayToDisplay}: ${newGoal.addedComment}`;
};
