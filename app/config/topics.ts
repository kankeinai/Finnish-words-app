export const topics = [
  "Actions & Movement",
  "Basics",
  "Body",
  "Communication",
  "Family & Relationships",
  "Feelings & Opinions",
  "Food & Drink",
  "Grammar",
  "Health",
  "Home",
  "Leisure",
  "Media & Technology",
  "Nature",
  "People",
  "Places",
  "Shopping & Services",
  "Time",
  "Transport",
  "Work & Study",
] as const;

export type Topic = (typeof topics)[number];

