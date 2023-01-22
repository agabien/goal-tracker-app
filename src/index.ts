import "./sass/index.scss";
import {
  handleCalendarArrows,
  renderMonth,
  displayGoalsOnCalendar,
} from "./components/calendar";
import { fetchQuotesApi } from "./components/quotesGenerator";
import {
  dateFormat,
  goalFormat,
  renderColorCode,
  createListItem,
  deleteItem,
  updateResult,
  addData,
} from "./helpers/localStorage";
import { showLayer, showElements } from "./helpers/UI";
export { allLayers, calendar, classToHide, displayData };

// variables and consts

const goalsMenuItem = document.querySelectorAll(".cele");
const monthMenuItem = document.querySelectorAll(".miesiac");
const menuMobile = document.querySelector(".menu-mobile");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const closeMobileBtn = document.querySelector(".close-mobile-btn");
const classToHide = "hidden";
const addGoalBtn = document.querySelector(".add-goal-btn");
const addNextGoalBtn = document.querySelector(".add-next-goal-btn");
const displayAllGoalsBtn = document.querySelector(".display-all-goals-btn");
const displayCalendarBtn = document.querySelector(".display-calendar-btn");
const allGoalsContainer = document.querySelector(".goals-container");
const addNewGoalContainer = document.querySelector(".goal-form-container");
const goalsList = document.querySelector(".goals-container__goals-list");
const addNewGoalForm = document.querySelector(".goal-form-container__form");
const title: HTMLInputElement = document.querySelector("#title");
const start: HTMLInputElement = document.querySelector("#deadline-start");
const stop: HTMLInputElement = document.querySelector("#deadline-stop");
const date: HTMLInputElement = document.querySelector("#date");
const notificationNo: HTMLInputElement = document.querySelector("#nie");
const commentInput: HTMLTextAreaElement = document.querySelector("#comment");
const dayBoxOverlay: HTMLElement = document.querySelector(".day-box__overlay");
const dayBoxModal: HTMLElement = document.querySelector(".day-box");
const generateQuoteBtn = document.querySelectorAll(".generate-quote-btn");
const generatedQuotesContainer: HTMLElement =
  document.querySelector(".quotes-container");
const allLayers = document.querySelectorAll(".layer");
const calendar = document.querySelector(".calendar");
const allGoals = [];

let dailyGoalFormSubmitButton: HTMLInputElement;
let dailyGoalForm: HTMLInputElement;
let displayData: Function;
let db;

// handle indexedDB database

window.onload = function () {
  const DBOpenRequest = window.indexedDB.open("goalsList", 4);

  DBOpenRequest.onerror = function (event) {
    console.log("Error loading database.");
  };

  DBOpenRequest.onsuccess = function (event) {
    console.log("Database initialised.");

    db = DBOpenRequest.result;

    displayData(new Date());
  };

  DBOpenRequest.onupgradeneeded = function (event) {
    db = event.target.result;

    db.onerror = function (event) {
      console.log("Error loading database.");
    };

    let objectStore = db.createObjectStore("goalsList", {
      keyPath: "taskTitle",
    });

    objectStore.createIndex("start", "start", {
      unique: false,
    });
    objectStore.createIndex("stop", "stop", {
      unique: false,
    });
    objectStore.createIndex("date", "date", {
      unique: false,
    });
    objectStore.createIndex("color", "color", {
      unique: false,
    });
    objectStore.createIndex("notified", "notified", {
      unique: false,
    });
    objectStore.createIndex("comment", "comment", {
      unique: false,
    });
    objectStore.createIndex("daysComments", "daysComments", {
      unique: false,
    });
  };

  displayData = (startDate?: Date) => {
    while (goalsList.firstChild) {
      goalsList.removeChild(goalsList.lastChild);
    }

    let objectStore = db.transaction("goalsList").objectStore("goalsList");

    objectStore.openCursor().onsuccess = function (event) {
      let cursor = event.target.result;

      if (cursor) {
        const colorCode = renderColorCode(cursor.value.color);

        const commentText = cursor.value.comment
          ? `| komentarz: ${cursor.value.comment}`
          : "";

        const toDoText = `${goalFormat(cursor.value.taskTitle)} | alert: ${
          cursor.value.notified
        } | godziny: ${cursor.value.start} – ${
          cursor.value.stop
        } | deadline: ${dateFormat(cursor.value.date)} ${commentText}`;

        const listItem = createListItem(toDoText);
        listItem.classList.add("goals-list__item");
        listItem.prepend(colorCode);

        goalsList.appendChild(listItem);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-red");
        listItem.appendChild(deleteButton);
        deleteButton.textContent = "X";

        deleteButton.setAttribute("data-task", cursor.value.taskTitle);
        deleteButton.onclick = function (event) {
          deleteItem(event, db);
        };

        cursor.continue();
      } else {
        if (!goalsList.firstChild) {
          goalsList.innerHTML = `Nie masz jeszcze żadnych celów.`;
        }
      }
    };

    renderMonthWithGoals(startDate);
  };

  addNewGoalForm.addEventListener(
    "submit",
    () =>
      addData(
        event,
        db,
        title,
        start,
        stop,
        date,
        notificationNo,
        commentInput,
        displayData,
        allGoals
      ),
    false
  );
};

addNewGoalForm.addEventListener("submit", () => {
  showElements(
    [allGoalsContainer, addNextGoalBtn, displayCalendarBtn],
    classToHide,
    [addGoalBtn, addNewGoalContainer, displayAllGoalsBtn]
  );
});

addNextGoalBtn.addEventListener("click", () => {
  showElements([addNewGoalContainer, displayAllGoalsBtn], classToHide, [
    allGoalsContainer,
    addGoalBtn,
    addNextGoalBtn,
    displayCalendarBtn,
  ]);
});

displayAllGoalsBtn.addEventListener("click", () => {
  showElements(
    [allGoalsContainer, addNextGoalBtn, displayCalendarBtn],
    classToHide,
    [displayAllGoalsBtn, addNewGoalContainer]
  );
});

displayCalendarBtn.addEventListener("click", () => {
  showLayer(calendar, classToHide, allLayers);
  showElements([], classToHide, [
    displayCalendarBtn,
    displayAllGoalsBtn,
    addNextGoalBtn,
  ]);
  displayData(new Date());
});

// calendar

const renderMonthWithGoals = (startDate?: Date) => {
  renderMonth(startDate);

  const daysDiv = document.getElementsByClassName("day");

  const DBOpenRequest = window.indexedDB.open("goalsList", 4);

  DBOpenRequest.onsuccess = function (event) {
    db = DBOpenRequest.result;
  };

  let objectStore = db.transaction("goalsList").objectStore("goalsList");

  objectStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;

    if (cursor) {
      displayGoalsOnCalendar(
        cursor.value.date,
        renderColorCode,
        cursor.value.color,
        cursor.value.taskTitle,
        cursor.value.daysComments,
        daysDiv,
        dayBoxOverlay,
        dayBoxModal,
        dailyGoalForm,
        dailyGoalFormSubmitButton,
        updateResult,
        db,
        displayData
      );

      cursor.continue();
    }
  };
};

handleCalendarArrows(renderMonthWithGoals);

dayBoxOverlay.addEventListener("click", (e) => {
  e.stopPropagation();
  dayBoxModal.innerHTML = "";
  showElements([], classToHide, [dayBoxOverlay, dayBoxModal]);
});

// handle menu

goalsMenuItem.forEach((btn) =>
  btn.addEventListener("click", () => {
    showLayer(allGoalsContainer, classToHide, allLayers);
    showElements([addNextGoalBtn, displayCalendarBtn], classToHide, [
      displayAllGoalsBtn,
      menuMobile,
      closeMobileBtn,
    ]);
  })
);

monthMenuItem.forEach((btn) =>
  btn.addEventListener("click", () => {
    showLayer(calendar, classToHide, allLayers);
    showElements([], classToHide, [
      addNextGoalBtn,
      displayCalendarBtn,
      menuMobile,
      closeMobileBtn,
    ]);
    displayData(new Date());
  })
);

addGoalBtn.addEventListener("click", () => {
  showLayer(addNewGoalContainer, classToHide, allLayers);
});

hamburgerBtn.addEventListener("click", () => {
  showElements([menuMobile, closeMobileBtn], classToHide, []);
});

closeMobileBtn.addEventListener("click", () => {
  showElements([], classToHide, [menuMobile, closeMobileBtn]);
});

// quotes generator

generateQuoteBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    showLayer(generatedQuotesContainer, classToHide, allLayers);
    showElements([], classToHide, [menuMobile, closeMobileBtn]);
    fetchQuotesApi(generatedQuotesContainer);
  })
);
