/**
 * The teaching staff, shown on every course and landing page.
 *
 * One definition: the bios were previously copy-pasted into each page, so a
 * correction had to be made in several places to take effect.
 */
export type Instructor = { name: string; photo: string; bio: string };

/**
 * The CAM staff. Marc teaches on both tracks, so only his title differs from
 * the real estate listing — the bio is the same on both pages.
 */
export const CAM_INSTRUCTORS: readonly Instructor[] = [
  {
    name: "Marc Pare, CAM Instructor",
    photo: "/course/instructor-marc.jpg",
    bio: "Marc has taught several subjects related to real estate and community association management for over ten years. He is passionate about distance education, reading and traveling. His goal is to help you pass the state exam on your first attempt.",
  },
  {
    name: "Patricia Miller, CAM Instructor",
    photo: "/course/instructor-patricia.jpg",
    bio: "Patricia joined Prolicense in 2018 and is the Director of CAM Education. She teaches and writes CAM continuing education and pre-license courses and brings extensive experience to the learners. Her goal is to present you with the most comprehensive CAM course available in Florida.",
  },
];

/**
 * The real estate school page's own wording.
 *
 * The original does not keep one bio: on the school page Marc is "passionate
 * about online education" and Maria "joined Prolicense in 2017", while the
 * 63-hour course page says "distance education" and 2021. Both are ported as
 * written rather than reconciled — picking one would be inventing copy.
 */
export const RE_SCHOOL_INSTRUCTORS: readonly Instructor[] = [
  {
    name: "Marc Pare, Real Estate Instructor",
    photo: "/course/instructor-marc.jpg",
    bio: "Marc has taught several subjects related to real estate and community association management for over ten years. He is passionate about online education, reading and traveling. His goal is to help you pass the state exam on your first attempt.",
  },
  {
    name: "Maria Wilson, Real Estate Instructor",
    photo: "/course/instructor-maria.jpg",
    bio: "Maria joined Prolicense in 2017 and is the Director of Real Estate Education. She teaches and writes Real Estate continuing education and pre-license courses and brings extensive experience to the learners. Her goal is to present you with the most comprehensive courses available in Florida.",
  },
];

export const INSTRUCTORS: readonly Instructor[] = [
  {
    name: "Marc Pare, Real Estate Instructor",
    photo: "/course/instructor-marc.jpg",
    bio: "Marc has taught several subjects related to real estate and community association management for over ten years. He is passionate about distance education, reading and traveling. His goal is to help you pass the state exam on your first attempt.",
  },
  {
    name: "Maria Wilson, Real Estate Instructor",
    photo: "/course/instructor-maria.jpg",
    bio: "Maria joined Prolicense in 2021 and is the Director of Real Estate Education. She teaches and writes Real Estate continuing education and pre-license courses and brings extensive experience to the learners. Her goal is to present you with the most comprehensive courses available in Florida.",
  },
];
