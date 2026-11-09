const questions = [
  {
    category: "SPACE",
    text: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Mercury"],
    correct: 1,
    explanation: "Mars looks red because iron-rich dust on its surface has oxidized — essentially, it has rusted."
  },
  {
    category: "NATURE",
    text: "What is the largest mammal on Earth?",
    answers: ["African elephant", "Giraffe", "Blue whale", "Hippopotamus"],
    correct: 2,
    explanation: "The blue whale is the largest animal known to have ever lived, reaching around 30 metres long."
  },
  {
    category: "SCIENCE",
    text: "What is the chemical symbol for water?",
    answers: ["CO₂", "O₂", "H₂O", "NaCl"],
    correct: 2,
    explanation: "A water molecule has two hydrogen atoms bonded to one oxygen atom, hence H₂O."
  },
  {
    category: "GEOGRAPHY",
    text: "Which is the largest ocean on Earth?",
    answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correct: 3,
    explanation: "The Pacific Ocean covers more area than all of Earth's land combined."
  },
  {
    category: "ARTS & CULTURE",
    text: "How many strings does a standard violin have?",
    answers: ["Four", "Five", "Six", "Eight"],
    correct: 0,
    explanation: "A standard violin has four strings, typically tuned to G, D, A, and E."
  }
];

const quizContent = document.querySelector("#quiz-content");
const resultContent = document.querySelector("#result-content");
const questionCategory = document.querySelector("#question-category");
const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");
const progressLabel = document.querySelector("#progress-label");
const progressPercent = document.querySelector("#progress-percent");
const progressFill = document.querySelector("#progress-fill");
const progressTrack = document.querySelector(".progress-track");
const scoreLabel = document.querySelector("#score-label");
const restartButton = document.querySelector("#restart-button");

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;
let answered = false;

function renderQuestion() {
  const question = questions[currentQuestion];
  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  questionCategory.textContent = `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} · ${question.category}`;
  questionText.textContent = question.text;
  progressLabel.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressPercent.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
  progressTrack.setAttribute("aria-valuenow", String(progress));
  scoreLabel.textContent = `Score: ${score}`;
  feedback.textContent = "";
  feedback.className = "feedback";
  selectedAnswer = null;
  answered = false;
  nextButton.disabled = true;
  nextButton.innerHTML = 'Check answer <span aria-hidden="true">→</span>';

  answerList.replaceChildren();
  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${answer}</span>`;
    button.addEventListener("click", () => selectAnswer(index));
    answerList.append(button);
  });
}

function selectAnswer(index) {
  if (answered) return;
  selectedAnswer = index;
  nextButton.disabled = false;
  answerList.querySelectorAll(".answer-option").forEach((button, buttonIndex) => {
    const isSelected = buttonIndex === index;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function checkAnswer() {
  if (selectedAnswer === null) return;

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;
  answered = true;
  if (isCorrect) score += 1;
  scoreLabel.textContent = `Score: ${score}`;

  answerList.querySelectorAll(".answer-option").forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add("correct");
    else if (index === selectedAnswer) button.classList.add("incorrect");
  });

  feedback.textContent = `${isCorrect ? "That's right!" : "Not quite."} ${question.explanation}`;
  feedback.classList.add(isCorrect ? "feedback-correct" : "feedback-incorrect");
  const isLastQuestion = currentQuestion === questions.length - 1;
  nextButton.innerHTML = isLastQuestion ? 'See results <span aria-hidden="true">→</span>' : 'Next question <span aria-hidden="true">→</span>';
  nextButton.focus();
}

function showResults() {
  quizContent.hidden = true;
  resultContent.hidden = false;
  document.querySelector("#final-score").textContent = `${score}/${questions.length}`;

  const percentage = score / questions.length;
  let title = "Keep exploring!";
  let message = "Every quiz is a chance to learn something new. Give it another go and see if you can improve your score.";
  if (percentage === 1) {
    title = "Perfect score!";
    message = "You got every question right. Your curiosity is paying off — fantastic work!";
  } else if (percentage >= 0.6) {
    title = "Nice work!";
    message = "You have a solid grasp of these topics. Keep that curiosity going!";
  }
  document.querySelector("#result-title").textContent = title;
  document.querySelector("#result-message").textContent = message;
  restartButton.focus();
}

nextButton.addEventListener("click", () => {
  if (!answered) {
    checkAnswer();
    return;
  }
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    questionText.focus?.();
  } else {
    showResults();
  }
});

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  quizContent.hidden = false;
  resultContent.hidden = true;
  renderQuestion();
  answerList.querySelector("button")?.focus();
});

renderQuestion();
