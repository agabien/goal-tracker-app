import { showLayer } from "../helpers/UI";
import { allLayers, calendar, classToHide, displayData } from "../index";
export { fetchQuotesApi };

const fetchQuotesApi = (quotesContainer: HTMLElement) => {
  fetch("https://type.fit/api/quotes")
    .then((res) => {
      return res.json();
    })
    .then((quote) => {
      const randomNumber = Math.floor(Math.random() * quote.length);
      const newQuoteHeader = document.createElement("h1");
      const newQuote = document.createElement("h2");
      const newQuoteAuthor = document.createElement("h3");
      const generateQuoteAgain = document.createElement("button");
      const backToMainPageBtn = document.createElement("button");

      quotesContainer.innerHTML = "";

      newQuoteHeader.textContent =
        "Psst! Słyszeliśmy, że potrzebujesz motywacji... Oto i ona!";
      newQuoteHeader.classList.add("quotes-container__header");
      quotesContainer.appendChild(newQuoteHeader);

      newQuote.textContent = quote[randomNumber].text;
      newQuote.classList.add("quotes-container__quote");
      quotesContainer.appendChild(newQuote);

      newQuoteAuthor.textContent = quote[randomNumber].author;
      newQuoteAuthor.classList.add("quotes-container__author");
      quotesContainer.appendChild(newQuoteAuthor);

      generateQuoteAgain.textContent = "Losuj ponownie";
      generateQuoteAgain.classList.add("btn-green");
      generateQuoteAgain.setAttribute("id", "generate-quote-again");
      quotesContainer.appendChild(generateQuoteAgain);

      backToMainPageBtn.textContent = "Powrót";
      backToMainPageBtn.classList.add("btn-red");
      backToMainPageBtn.setAttribute("id", "back-btn");
      quotesContainer.appendChild(backToMainPageBtn);

      generateQuoteAgain.addEventListener("click", () => {
        fetchQuotesApi(quotesContainer);
      });

      backToMainPageBtn.addEventListener("click", () => {
        showLayer(calendar, classToHide, allLayers);
        displayData(new Date());
      });
    })
    .catch(function () {
      console.log("Wystąpił błąd!");
    });
};
