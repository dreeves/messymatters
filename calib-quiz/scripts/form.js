(function () {
  "use strict";

  const quiz = window.CalibrationQuiz;
  const form = document.getElementById("calibration-quiz");
  if (!quiz || !form) return;

  const questions = Array.from(form.querySelectorAll(".question"));
  const result = document.getElementById("score-result");
  const scoreOutput = document.getElementById("score");

  function reportHeight() {
    if (window.parent === window) return;

    window.parent.postMessage(
      {
        type: "calibration-quiz-height",
        height: document.documentElement.scrollHeight,
      },
      window.location.origin,
    );
  }

  function constrain(question) {
    const inputs = question.querySelectorAll("input");
    inputs[1].min = inputs[0].value;
  }

  questions.forEach(function (question) {
    constrain(question);
    question.querySelector("input").addEventListener("input", function () {
      constrain(question);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    questions.forEach(constrain);
    if (!form.reportValidity()) return;

    const ranges = questions.map(function (question) {
      const inputs = question.querySelectorAll("input");
      const min = Number(inputs[0].value);
      const max = Number(inputs[1].value);
      return [min, max];
    });

    const scored = quiz.score(ranges);
    if (!scored.valid) return;

    questions.forEach(function (question, index) {
      const hit = scored.hits[index];
      question.classList.toggle("good", hit);
      question.classList.toggle("bad", !hit);
      question.querySelector(".mark").textContent = hit ? "✓" : "×";
      question.querySelector(".true-value .answer").textContent =
        quiz.answers[index];
      question.querySelector(".true-value").hidden = false;
    });

    scoreOutput.textContent = scored.score;
    result.hidden = false;
    result.focus();
    reportHeight();
  });

  window.addEventListener("load", reportHeight);
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(reportHeight).observe(document.documentElement);
  }
})();
