export { Goal, dayComment };

type dayComment = {
  date: string;
  name: string;
};

class Goal {
  taskTitle: string;
  start: string;
  stop: string;
  date: string;
  color: string;
  notified: string;
  comment: string;
  daysComments: dayComment[];

  constructor(
    taskTitle: string,
    start: string,
    stop: string,
    date: string,
    notified: HTMLInputElement,
    comment: string
  ) {
    this.taskTitle = taskTitle;
    this.start = start;
    this.stop = stop;
    this.date = date;
    this.color = this.colorGenerator();
    this.notified = this.checkNotification(notified);
    this.comment = comment;
    this.daysComments = [];
  }

  colorGenerator = function (): string {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return color;
  };

  checkNotification = function (notificationNoState: HTMLInputElement): string {
    return notificationNoState.checked ? "Nie" : "Tak";
  };
}
