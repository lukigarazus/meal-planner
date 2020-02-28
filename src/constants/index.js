const BREAKFAST = "Breakfast";
const LUNCH = "Lunch";
const DINNER = "Dinner";
const SECOND_BREAKFAST = "Second Breakfast";
const SUPPER = "Supper";
const TEA = "Tea";
const AFTERNOONS = "Afternoons";

const SMALL = 3;
const MEDIUM = 5;
const HIGH = 7;

export const POSSIBLE_STAGE_COUNTS = [SMALL, MEDIUM, HIGH];

export const STAGES = {
  [SMALL]: [BREAKFAST, LUNCH, DINNER],
  [MEDIUM]: [BREAKFAST, SECOND_BREAKFAST, LUNCH, SUPPER, DINNER],
  [HIGH]: [BREAKFAST, SECOND_BREAKFAST, AFTERNOONS, LUNCH, TEA, SUPPER, DINNER]
};

export const DEFAULT_STAGE_COUNT = MEDIUM;
