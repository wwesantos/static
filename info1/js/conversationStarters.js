const http = new HTTP();
const base_url = `${window.location.origin}/conversation-starters/get-question`;

let url = base_url;

const DISABLE = true;
const ENABLE = false;

let nextQuestion = 0;
let previousQuestion = 0;

const questionText = get("#question-text");
const quesitonId = get("#question-id");
const btnRandom = get("#btn-random");
const btnNext = get("#btn-next");
const btnPrevious = get("#btn-previous");
const loandingRandomQuestion = get("#loading-random");
const loandingNextQuestion = get("#loading-next");
const loandingPreviousQuestion = get("#loading-previous");
const random = get("#random");
const next = get("#next");
const previous = get("#previous");

const toggleFields = mode => {
  btnRandom.disable = mode;
  btnNext.disabled = mode;
  if (mode == ENABLE) {
    loandingRandomQuestion.style.display = "none";
    loandingNextQuestion.style.display = "none";
    loandingPreviousQuestion.style.display = "none";
    random.style.display = "inline-block";
    next.style.display = "inline-block";
    previous.style.display = "inline-block";
  }
};

const getQuestion = () => {
  toggleFields(DISABLE);
  http
    .get(url)
    .then(data => {
      nextQuestion = data.id + 1;
      previousQuestion = data.id - 1;
      quesitonId.textContent = `[${data.id + 1}]`;
      questionText.textContent = data.question;
      toggleFields(ENABLE);
    })
    .catch(err => {
      console.log(err);
      showError(err);
      toggleFields(ENABLE);
    });
};

btnNext.addEventListener("click", e => {
  e.preventDefault();
  url = `${base_url}?question=${nextQuestion}`;
  loandingNextQuestion.style.display = "inline-block";
  next.style.display = "none";
  getQuestion();
});

btnPrevious.addEventListener("click", e => {
  e.preventDefault();
  url = `${base_url}?question=${previousQuestion}`;
  loandingPreviousQuestion.style.display = "inline-block";
  previous.style.display = "none";
  getQuestion();
});

btnRandom.addEventListener("click", e => {
  e.preventDefault();
  url = `${base_url}?question=random`;
  loandingRandomQuestion.style.display = "inline-block";
  random.style.display = "none";
  getQuestion();
});
