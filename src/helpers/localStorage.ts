import { Goal, dayComment } from "../classes/Goal";
export {
  dateFormat,
  goalFormat,
  renderColorCode,
  createListItem,
  deleteItem,
  updateResult,
  addData,
};

const dateFormat = (inputDate: string) => {
  const temp = inputDate;
  inputDate = `${temp.slice(8)}.${temp.slice(5, 7)}.${temp.slice(0, 4)}`;
  return inputDate;
};

const goalFormat = (inputGoal: string) => {
  return inputGoal[0].toUpperCase() + inputGoal.slice(1);
};

const renderColorCode = (colorHexCode: string) => {
  const colorCode = document.createElement("span");
  colorCode.setAttribute("data-color", `${colorHexCode}`);
  colorCode.classList.add("dot");
  colorCode.classList.add("opacity");
  colorCode.style.backgroundColor = `${colorHexCode}`;
  return colorCode;
};

const createListItem = (contents: string) => {
  const listItem = document.createElement("li");
  listItem.textContent = contents;
  return listItem;
};

function deleteItem(event, db) {
  let dataTask = event.target.getAttribute("data-task");

  let transaction = db.transaction(["goalsList"], "readwrite");
  let request = transaction.objectStore("goalsList").delete(dataTask);

  transaction.oncomplete = function () {
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
  };
}

const updateResult = (
  db,
  displayData: Function,
  newGoal: dayComment,
  btnId: string
) => {
  let transaction = db.transaction(["goalsList"], "readwrite");
  let objectStore = transaction.objectStore("goalsList");
  objectStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      if (cursor.value.taskTitle === btnId) {
        const updateData = cursor.value;
        updateData.daysComments.push(newGoal);
        const request = cursor.update(updateData);
        request.onsuccess = function () {
          displayData();
        };
      }
      cursor.continue();
    }
  };
};

function addData(
  e: Event,
  db,
  title: HTMLInputElement,
  start: HTMLInputElement,
  stop: HTMLInputElement,
  date: HTMLInputElement,
  notificationNo: HTMLInputElement,
  commentInput: HTMLTextAreaElement,
  displayData: Function,
  allGoals: Goal[]
) {
  e.preventDefault();

  if (
    title.value == "" ||
    start.value == null ||
    stop.value == null ||
    date.value == ""
  ) {
    console.log("Data not submitted — form incomplete.");
    return;
  } else {
    let parseData = [
      new Goal(
        title.value,
        start.value,
        stop.value,
        date.value,
        notificationNo,
        commentInput.value
      ),
    ];

    const newItem = JSON.parse(JSON.stringify(parseData));

    let transaction = db.transaction(["goalsList"], "readwrite");

    transaction.oncomplete = function () {
      displayData();
    };

    transaction.onerror = function () {
      console.log(`Transaction not opened due to error: ${transaction.error}`);
    };

    let objectStore = transaction.objectStore("goalsList");
    let objectStoreRequest = objectStore.add(newItem[0]);

    allGoals.push(newItem[0]);

    objectStoreRequest.onsuccess = function (event) {
      title.value = "";
      start.value = null;
      stop.value = null;
      date.value = "2023-01-01";
      notificationNo.checked = true;
      commentInput.value = "";
    };
  }
}
