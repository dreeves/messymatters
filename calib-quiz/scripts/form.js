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

  questions.forEach(function (question) {
    question.querySelectorAll("input").forEach(function (input) {
      input.addEventListener("input", function () {
        input.setCustomValidity("");
      });
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const ranges = [];
    let reversed = null;

    questions.forEach(function (question) {
      const inputs = question.querySelectorAll("input");
      const min = Number(inputs[0].value);
      const max = Number(inputs[1].value);

      inputs[1].setCustomValidity("");
      if (min > max && reversed === null) {
        inputs[1].setCustomValidity("min greater than the max");
        reversed = inputs[1];
      }

      ranges.push([min, max]);
    });

    if (reversed !== null) {
      reversed.reportValidity();
      return;
    }

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
