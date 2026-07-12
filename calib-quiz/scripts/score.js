(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.CalibrationQuiz = api;
  }
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";

  const answers = Object.freeze([
    39, 4132, 12, 39, 2160, 390000, 1756, 645, 5959, 35994,
  ]);

  function score(ranges) {
    if (!Array.isArray(ranges) || ranges.length !== answers.length) {
      return { valid: false, score: 0, hits: [] };
    }

    const hits = ranges.map(function (range, index) {
      if (!Array.isArray(range) || range.length !== 2) return null;

      const min = range[0];
      const max = range[1];
      if (
        typeof min !== "number" ||
        typeof max !== "number" ||
        !Number.isFinite(min) ||
        !Number.isFinite(max) ||
        min > max
      ) {
        return null;
      }

      return min <= answers[index] && answers[index] <= max;
    });

    const valid = hits.every(function (hit) {
      return hit !== null;
    });

    return {
      valid: valid,
      score: valid
        ? hits.filter(function (hit) {
            return hit;
          }).length
        : 0,
      hits: hits,
    };
  }

  return { answers: answers, score: score };
});
