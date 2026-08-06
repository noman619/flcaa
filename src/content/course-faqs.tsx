import Link from "next/link";
import { FileCheck2, GraduationCap, Timer } from "lucide-react";
import type { FaqItem } from "@/components/course/faq-accordion";

/**
 * FAQ copy, ported verbatim from the original site.
 *
 * Kept here rather than in a page: the same set is shown on the marketing
 * landing page and on the catalog course page, and the answers contain markup
 * so they cannot live in a .ts data module.
 */
/**
 * The 45-hour post-licensing FAQ, on
 * /florida-real-estate-45-hour-post-license-course.
 *
 * The original gives each answer its own mark; the nearest icons in the set
 * carry the same reading. Its "multiple- choice" typo is normalised — a
 * stray space inside a word is a rendering artefact, not copy.
 */
export const POST_LICENSE_FAQS: readonly FaqItem[] = [
  {
    q: "What are the 45-hour post-licensing education requirements in Florida?",
    text: "In Florida, real estate agents must complete 45 hours of post-licensing education before their first license renewal period. This education requirement must be completed within 18 to 24 months after sales associates receive their initial license.",
    icon: GraduationCap,
    a: (
      <p>
        In Florida, real estate agents must complete 45 hours of post-licensing
        education before their first license renewal period. This education
        requirement must be completed within 18 to 24 months after sales
        associates receive their initial license.
      </p>
    ),
  },
  {
    q: "When must real estate sales associates complete their post-license course in Florida?",
    text: "The post-licensing course for real estate sales associates must be completed 18 to 24 months from the date your license was initially issued. The dates for your real estate license renewal are either March 31st or September 30th, whichever date is closest to your license approval date.",
    icon: Timer,
    a: (
      <p>
        The post-licensing course for real estate sales associates must be
        completed 18 to 24 months from the date your license was initially
        issued. The dates for your real estate license renewal are either March
        31st or September 30th, whichever date is closest to your license
        approval date.
      </p>
    ),
  },
  {
    q: "Is there an exam for the 45-hour real estate post-licensing course in Florida?",
    text: "Yes, there is an end-of-course exam to successfully complete the Florida 45-hour real estate sales associate post-licensing education. The final exam is a 3-hour exam with 100 multiple-choice questions. You must get a score of 75% or more to pass the post-licensing end-of-course exam. If you fail the end-of-course exam, you may retake the exam without any delay. If you fail the exam a second time, you will need to retake the whole course again.",
    icon: FileCheck2,
    a: (
      <>
        <p>
          Yes, there is an end-of-course exam to successfully complete the
          Florida 45-hour real estate sales associate post-licensing education.
          The final exam is a 3-hour exam with 100 multiple-choice questions.
          You must get a score of 75% or more to pass the post-licensing
          end-of-course exam.
        </p>
        <p>
          If you fail the end-of-course exam, you may retake the exam without
          any delay.
          <br />
          If you fail the exam a second time, you will need to retake the whole
          course again.
        </p>
      </>
    ),
  },
];

export const MUTUAL_RECOGNITION_FAQS = [
  {
    q: "Which states currently have mutual recognition agreements with Florida?",
    text: "Currently, Florida has mutual recognition agreements with Alabama, Arkansas, Connecticut, Georgia, Illinois, Mississippi, Nebraska, and Rhode Island. If you hold a valid, active real estate license in one of these states, you may be eligible to bypass the standard pre-licensing education.",
    a: (
      <p>
        Currently, Florida has mutual recognition agreements with{" "}
        <strong>
          Alabama, Arkansas, Connecticut, Georgia, Illinois, Mississippi,
          Nebraska, and Rhode Island.
        </strong>{" "}
        If you hold a valid, active real estate license in one of these states,
        you may be eligible to bypass the standard pre-licensing education.
      </p>
    ),
  },
  {
    q: "Do I qualify for mutual recognition if I have moved to Florida?",
    text: "No. Mutual recognition is specifically designed for non-residents of Florida. If you have already become a Florida resident (registered to vote, filed for homestead exemption, etc.), you must take the standard 63-hour pre-licensing course and the full state exam. This path is strictly for agents living in their home state who want to conduct business in Florida.",
    a: (
      <p>
        <strong>No.</strong> Mutual recognition is specifically designed for{" "}
        <strong>non-residents</strong> of Florida. If you have already become a
        Florida resident (registered to vote, filed for homestead exemption,
        etc.), you must take the standard 63-hour pre-licensing course and the
        full state exam. This path is strictly for agents living in their home
        state who want to conduct business in Florida.
      </p>
    ),
  },
  {
    q: "Is the 63-hour pre-licensing course required for Mutual Recognition applicants?",
    text: "No! This is the biggest benefit of applying through mutual recognition. You are exempt from the mandatory 63-hour pre-licensing course. However, because the laws differ significantly from state to state, a dedicated exam prep course (like this one) is highly recommended to ensure you pass the law exam.",
    a: (
      <p>
        <strong>No!</strong> This is the biggest benefit of applying through
        mutual recognition. You are <strong>exempt</strong> from the mandatory
        63-hour pre-licensing course. However, because the laws differ
        significantly from state to state, a dedicated exam prep course (like
        this one) is highly recommended to ensure you pass the law exam.
      </p>
    ),
  },
  {
    q: "How is the Mutual Recognition exam different from the standard Florida real estate exam?",
    text: "The standard exam is 100 questions covering general real estate principles, practice, math, and law. The Mutual Recognition exam is much shorter and more focused. It consists of only 40 questions and strictly covers Florida Real Estate Law. There is no math and no general real estate theory.",
    a: (
      <p>
        The standard exam is 100 questions covering general real estate
        principles, practice, math, and law. The Mutual Recognition exam is much
        shorter and more focused. It consists of only{" "}
        <strong>40 questions</strong> and strictly covers{" "}
        <strong>Florida Real Estate Law.</strong> There is no math and no general
        real estate theory.
      </p>
    ),
  },
  {
    q: "What score do I need to pass?",
    text: "You must answer 30 out of 40 questions correctly (75%) to pass. While this sounds easy, the questions are specific to Florida statutes (Chapter 475), so winging it is not recommended.",
    a: (
      <p>
        You must answer <strong>30 out of 40 questions correctly</strong> (75%)
        to pass. While this sounds easy, the questions are specific to Florida
        statutes (Chapter 475), so &ldquo;winging it&rdquo; is not recommended.
      </p>
    ),
  },
  {
    q: "Can I take the exam online?",
    text: "Yes and no. The prep course is 100% online. However, the official state exam must be taken at a Pearson VUE testing center. You can schedule this once your application is approved by the DBPR.",
    a: (
      <p>
        Yes and no. The <strong>prep course</strong> is 100% online. However, the
        official state exam must be taken at a Pearson VUE testing center. You
        can schedule this once your application is approved by the DBPR.
      </p>
    ),
  },
  {
    q: "How long does this prep course take to complete?",
    text: "The course is self-paced. Most agents can complete the material in a week or a few weekends. Since there is no required seat-time, you can move as fast as you like.",
    a: (
      <p>
        The course is self-paced. Most agents can complete the material in a
        week or a few weekends. Since there is no required seat-time, you can
        move as fast as you like.
      </p>
    ),
  },
] as const;

/**
 * "Florida Real Estate Exam Information" from the practice-exam page.
 *
 * Presented there as headed paragraphs rather than a disclosure list, but every
 * one of them is a question with an answer, so it renders as an FAQ here and
 * picks up the FAQPage structured data for free.
 */
export const REAL_ESTATE_EXAM_FAQS = [
  {
    q: "What is the format of the real estate exam?",
    text: "The examination consists of 100 multiple choice questions, each having responses a, b, c, d. There are 45 questions on real estate principles and practices, 45 questions cover Florida and Federal laws and 10 questions require math calculations. You will have 3.5 hours to complete the exam. You will need to achieve a score of 75% to pass.",
    a: (
      <p>
        The examination consists of{" "}
        <strong>100 multiple choice questions</strong>, each having responses a,
        b, c, d. There are 45 questions on real estate principles and practices,
        45 questions cover Florida and Federal laws and 10 questions require math
        calculations. You will have <strong>3.5 hours</strong> to complete the
        exam. You will need to achieve a score of <strong>75%</strong> to pass.
      </p>
    ),
  },
  {
    q: "How to schedule the state exam?",
    text: "Once your real estate application is approved by the Florida DBPR, you will receive an email notification and a candidate ID number. Use this ID number to sign up for your real estate exam with Pearson Vue. Scheduling can be completed online or by calling 888-204-6230.",
    a: (
      <p>
        Once your real estate application is approved by the Florida DBPR, you
        will receive an email notification and a candidate ID number. Use this ID
        number to sign up for your real estate exam with Pearson Vue.{" "}
        <a
          href="https://www.pearsonvue.com/us/en/fl/realestate.html"
          target="_blank"
          rel="noreferrer"
          className="text-brand-700 underline underline-offset-4 transition-colors duration-200 hover:text-brand-900"
        >
          Scheduling can be completed online
        </a>{" "}
        or by calling 888-204-6230.
      </p>
    ),
  },
  {
    q: "How much does the Florida real estate exam cost?",
    text: "Scheduling the Florida real estate examination cost $36.75.",
    a: <p>Scheduling the Florida real estate examination cost $36.75.</p>,
  },
  {
    q: "Where are the Pearson Vue test centers located?",
    text: "Pearson Vue test centers are located throughout the United States. In Florida, you will find a test center in the following cities: Orlando, St. Petersburg, Boynton Beach, Coral Gables, Oakland Park, Ormand Beach, Fort Myers, Lake Mary, Gainesville, Melbourne, Jacksonville, Sarasota, Miami, Lakeland, Pensacola, Tallahassee, Doral, Tampa, Ft. Lauderdale, Hollywood.",
    a: (
      <p>
        Pearson Vue test centers are{" "}
        <a
          href="https://www.pearsonvue.com/us/en/fl/realestate.html"
          target="_blank"
          rel="noreferrer"
          className="text-brand-700 underline underline-offset-4 transition-colors duration-200 hover:text-brand-900"
        >
          located throughout the United States
        </a>
        . In Florida, you will find a test center in the following cities:
        Orlando, St. Petersburg, Boynton Beach, Coral Gables, Oakland Park,
        Ormand Beach, Fort Myers, Lake Mary, Gainesville, Melbourne,
        Jacksonville, Sarasota, Miami, Lakeland, Pensacola, Tallahassee, Doral,
        Tampa, Ft. Lauderdale, Hollywood.
      </p>
    ),
  },
  {
    q: "Can I review my Florida real estate exam results?",
    text: "Yes. You can review your entire exam. There is a fee of $35. You are given one hour for a review your test. Contact Pearson Vue at 888-204-6289 to schedule an appointment.",
    a: (
      <p>
        Yes. You can review your entire exam. There is a fee of $35. You are
        given one hour for a review your test. Contact Pearson Vue at
        888-204-6289 to schedule an appointment.
      </p>
    ),
  },
  {
    q: "How many times can I take the Florida State exam?",
    text: "You can retake the Florida real estate sales associate exam as many times as you need. Candidates who fail an examination must wait 24 hours to schedule are examination.",
    a: (
      <p>
        You can retake the Florida real estate sales associate exam as many times
        as you need. Candidates who fail an examination must wait 24 hours to
        schedule are examination.
      </p>
    ),
  },
] as const;

/**
 * The three questions closing /how-to-get-real-estate-license-in-florida.
 * Ported verbatim from that page.
 */
export const HOW_TO_LICENSE_FAQS = [
  {
    q: "How long does it take to get my real estate license in Florida?",
    text: "It takes an average of 10 weeks to get a real estate agent license in Florida. The exact amount of time it requires to obtain your license mainly depends on how fast it takes you to go through these four steps: 1. Time to complete your pre-license course: 45 days in average. 2. Time to schedule and get your fingerprints: 7 days in average. 3. Time to submit your application and get approved: 10 days in average. 4. Time to schedule and take your state exam: 8 days in average. Total time: 70 days (10 weeks).",
    a: (
      <>
        <p>
          It takes an average of <strong>10 weeks</strong> to get a real estate
          agent license in Florida. The exact amount of time it requires to
          obtain your license mainly depends on how fast it takes you to go
          through these four steps:
        </p>
        <ol>
          <li>Time to complete your pre-license course: 45 days in average.</li>
          <li>Time to schedule and get your fingerprints: 7 days in average.</li>
          <li>
            Time to submit your application and get approved: 10 days in
            average.
          </li>
          <li>Time to schedule and take your state exam: 8 days in average.</li>
        </ol>
        <p>
          <strong>Total time: 70 days (10 weeks).</strong>
        </p>
      </>
    ),
  },
  {
    q: "How hard is the real estate exam in Florida?",
    text: "The real estate exam definitely needs to be taken seriously. Besides the pre-license course, the key to pass the test on your first attempt is to focus on the “exam prep program” that follows the course. This module increases the chance of successfully passing the state exam by more than 40%.",
    a: (
      <p>
        The real estate exam definitely needs to be taken seriously. Besides the
        pre-license course, the key to pass the test on your first attempt is to
        focus on the “exam prep program” that follows the course. This module
        increases the chance of successfully passing the state exam by more than
        40%.
      </p>
    ),
  },
  {
    q: "How many times can I take the Florida State exam?",
    text: "There is no limit on the number of times you can retake the real estate state exam in Florida. Candidates who fail the exam are entitled to reschedule the test the next day. The fee to retake the real estate exam in Florida is $36.75.",
    a: (
      <p>
        There is no limit on the number of times you can retake the real estate
        state exam in Florida. Candidates who fail the exam are entitled to
        reschedule the test the next day. The fee to retake the real estate exam
        in Florida is $36.75.
      </p>
    ),
  },
] as const;

/**
 * Marc Pare's exam questions, on /florida-real-estate-exam.
 *
 * Every answer is a single unadorned paragraph, so the pairs are listed as
 * data and the node is derived — writing each one out as JSX would repeat the
 * sentence twice per entry with nothing gained.
 */
const EXAM_INFO_QA: readonly (readonly [string, string])[] = [
  [
    "Q1: Can you take the Florida real estate exam online?",
    "The Florida real estate exam must be taken in person at a Pearson Vue test center. Test centers are located throughout the United States.",
  ],
  [
    "Q2: How many times can you take the real estate exam in Florida?",
    "You can take the Florida real estate licensing exam as many times as needed to pass. You just need to wait 24 hours and pay $36.75 to reschedule your test.",
  ],
  [
    "Q3: How hard is the Florida real estate exam?",
    "The Florida real estate exam requires a grade of at least 75% to pass. The exam is a knowledge test about real estate principles and applicable laws in Florida. It does not test applicants on intuitive skills. In other words, you must study to pass this exam.",
  ],
  [
    "Q4: How to pass the Florida real estate exam?",
    "To pass the Florida real estate exam, you must practice, practice and practice. Real estate exam simulations and flashcards are the best study guides to prepare for the state exam.",
  ],
  [
    "Q5: How much is the real estate exam in Florida?",
    "The Florida real estate exam cost $36.75. Additional fees related with obtaining your real estate license in Florida include the pre-license course, the fingerprinting, and the licensing application.",
  ],
  [
    "Q6: How long is the Florida real estate exam?",
    "The Florida real estate exam is 3.5 hours and consists of 100 multiple-choice questions. A score of 75% or higher is required to pass.",
  ],
  [
    "Q7: How many questions are on the florida real estate exam?",
    "The Florida real estate exam consists of 100 multiple-choice questions. There are 90 theory questions regarding real estate principles in Florida and 10 questions involving math calculations.",
  ],
  [
    "Q8: Where to take Florida real estate exam?",
    "The Florida real estate exam is offered daily and must be taken at a Pearson Vue test center. Test centers are located throughout the United States.",
  ],
  [
    "Q9: What is on the Florida real estate exam?",
    "The Florida real estate exam real covers real estate principles and practices, real estate law, and real estate mathematics. The examination consists of 100 multiple-choice questions. Candidates are given a total of 3.5 hours to complete the examination.",
  ],
  [
    "Q10: What to do after you pass the real estate exam in Florida?",
    "After successfully passing the Florida real estate exam, your license will be issued on an inactive status. The license can be activated through your broker or by submitting the DBPR-RE 11 form.",
  ],
];

export const EXAM_INFO_FAQS: readonly FaqItem[] = EXAM_INFO_QA.map(
  ([q, text]) => ({ q, text, a: <p>{text}</p> }),
);

/**
 * The board member certification FAQ, on /board-certification-condo-hoa-fl.
 *
 * The original links all three hour figures at the home page; here they aim at
 * its "Choose your track" section (/#tracks).
 */
export const BOARD_CERT_FAQS = [
  {
    q: "What Florida law requires for newly elected Condo, HOA and Coop board members about getting certified?",
    text: "Newly elected or appointed directors must complete an approved 4-hour education course within 90 days of their election or appointment. Additionally, they must sign a written certification affirming that they have read and will uphold the association's governing documents.",
    a: (
      <p>
        Newly elected or appointed directors must complete an approved 4-hour
        education course <strong>within 90 days</strong> of their election or
        appointment. Additionally, they must sign a written certification
        affirming that they have read and will uphold the association&#39;s
        governing documents.
      </p>
    ),
  },
  {
    q: "Under Florida law, what are the continuing-education requirements for board directors of condominium associations, homeowners’ associations, and cooperatives?",
    text: "Under Florida law, condominium and cooperative board directors must complete one hour of continuing education annually, covering changes to the Florida Statutes and related administrative rules from the past year. For homeowners’ association (HOA) directors, the requirement depends on the size of the association: Fewer than 2,500 parcels: At least 4 hours of continuing education each year. 2,500 parcels or more: At least 8 hours of continuing education annually.",
    a: (
      <>
        <p>
          Under Florida law, condominium and cooperative board directors must
          complete{" "}
          <Link href="/#tracks">one hour of continuing education</Link>{" "}
          annually, covering changes to the Florida Statutes and related
          administrative rules from the past year.
        </p>
        <p>
          For homeowners’ association (HOA) directors, the requirement depends
          on the size of the association:
        </p>
        <ul>
          <li>
            Fewer than 2,500 parcels: At least{" "}
            <Link href="/#tracks">4 hours of continuing education</Link>{" "}
            each year.
          </li>
          <li>
            2,500 parcels or more: At least{" "}
            <Link href="/#tracks">8 hours of continuing education</Link>{" "}
            annually.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "How do I establish compliance with Florida’s new board member certification requirement?",
    text: "You will receive a certificate of completion immediately after completing the course. You can then print or electronically submit your certificate to the secretary of your board.",
    a: (
      <p>
        You will receive a certificate of completion immediately after
        completing the course. You can then print or electronically submit your
        certificate to the secretary of your board.
      </p>
    ),
  },
  {
    q: "Do I have to complete the course all at once?",
    text: "Our online course tracks your progress and automatically bookmarks the last page you viewed. If you exit the course before completion, it will automatically open where you left off during your last session.",
    a: (
      <p>
        Our online course tracks your progress and automatically bookmarks the
        last page you viewed. If you exit the course before completion, it will
        automatically open where you left off during your last session.
      </p>
    ),
  },
] as const;

/**
 * The CAM licensing guide FAQ, on /how-get-cam-license-florida. Distinct from
 * CAM_FAQS below, which belongs to the course page.
 */
export const HOW_TO_CAM_LICENSE_FAQS = [
  {
    q: "When a Community Association Manager (CAM) license is required in Florida?",
    text: "A Florida CAM License is required when managing a community association of more than 10 units and/or with an annual budget in excess of $100,000. Types of properties that hire CAM License holders are condominiums, homeowners associations, cooperatives, timeshares, mobile home parks and planned unit developments.",
    a: (
      <p>
        A Florida CAM License is required when managing a community association
        of <strong>more than 10 units</strong> and/or with an{" "}
        <strong>annual budget in excess of $100,000</strong>. Types of
        properties that hire CAM License holders are condominiums, homeowners
        associations, cooperatives, timeshares, mobile home parks and planned
        unit developments.
      </p>
    ),
  },
  {
    q: "Can I get my Florida CAM license online?",
    text: "Obtaining your CAM license is mostly online, including the pre-licensing course, application, and background check. The State exam, however, requires in-person attendance at an authorized Pearson VUE test center.",
    a: (
      <p>
        Obtaining your CAM license is mostly online, including the pre-licensing
        course, application, and background check. The State exam, however,
        requires in-person attendance at an authorized Pearson VUE test center.
      </p>
    ),
  },
  {
    q: "Community association manager duties in Florida?",
    text: "1. Manage condominiums, HOAs, planned unit developments, cooperatives (coop). 2. Administer and oversee the association funds. 3. Supervise the preparation of the budgets and other financial documents for an association. 4. Ensure appropriate notices to conduct association meetings. 5. Coordinate maintenance and contracts with employees and services providers. 6. Perform various day-to-day tasks involved with the operation of a community association.",
    a: (
      <ol>
        <li>
          Manage condominiums, HOAs, planned unit developments, cooperatives
          (coop).
        </li>
        <li>Administer and oversee the association funds.</li>
        <li>
          Supervise the preparation of the budgets and other financial documents
          for an association.
        </li>
        <li>Ensure appropriate notices to conduct association meetings.</li>
        <li>
          Coordinate maintenance and contracts with employees and services
          providers.
        </li>
        <li>
          Perform various day-to-day tasks involved with the operation of a
          community association.
        </li>
      </ol>
    ),
  },
] as const;

/** The 16-hour CAM licensing course FAQ. Ported verbatim from the original. */
export const CAM_FAQS = [
  {
    q: "What is the 16‑hour Florida CAM licensing course?",
    text: "Think of this as your starter kit for becoming a Florida Community Association Manager. The state requires you to complete 16 hours of pre-license education with a DBPR-approved provider (that’s the Department of Business & Professional Regulation) before you can take the CAM exam. The topics cover the real-world stuff you’ll use on the job—law, meetings, budgeting, insurance, and day-to-day operations.",
    a: (
      <p>
        Think of this as your starter kit for becoming a Florida Community
        Association Manager. The state requires you to complete 16 hours of
        pre-license education with a DBPR-approved provider (that’s the
        Department of Business &amp; Professional Regulation) before you can take
        the CAM exam. The topics cover the real-world stuff you’ll use on the
        job—law, meetings, budgeting, insurance, and day-to-day operations.
      </p>
    ),
  },
  {
    q: "Can I take the CAM licensing course online?",
    text: "Yes, the great news is that you can complete the required pre-licensing education entirely online. Our 16-hour CAM course is 100% online and self-paced, giving you the flexibility to study whenever and wherever it's most convenient for you.",
    a: (
      <p>
        Yes, the great news is that you can complete the required pre-licensing
        education entirely online. Our 16-hour CAM course is 100% online and
        self-paced, giving you the flexibility to study whenever and wherever
        it&apos;s most convenient for you.
      </p>
    ),
  },
  {
    q: "How long does my course completion stay valid?",
    text: "You’ve got a 12-month window from the day you finish the course to pass the state exam. If that window closes, you’ll need to retake the 16-hour course to be eligible again.",
    a: (
      <p>
        You’ve got a 12-month window from the day you finish the course to pass
        the state exam. If that window closes, you’ll need to retake the 16-hour
        course to be eligible again.
      </p>
    ),
  },
  {
    q: "What does the course actually cover?",
    text: "The state sets the mix, roughly: Law (about 20%) – statutes, rules, what you can and can’t do. Meetings & Procedures (about 25%) – running board and member meetings smoothly. Budgets & Finances (about 25%) – budgeting, assessments, reserves, reports. Insurance (about 12%) – coverages, risk, claims basics. Management & Maintenance (about 18%) – daily operations, vendors, facilities.",
    a: (
      <>
        <p>The state sets the mix, roughly:</p>
        <ul>
          <li>
            <strong>Law (about 20%)</strong> – statutes, rules, what you can and
            can’t do
          </li>
          <li>
            <strong>Meetings &amp; Procedures (about 25%)</strong> – running
            board and member meetings smoothly
          </li>
          <li>
            <strong>Budgets &amp; Finances (about 25%)</strong> – budgeting,
            assessments, reserves, reports
          </li>
          <li>
            <strong>Insurance (about 12%)</strong> – coverages, risk, claims
            basics
          </li>
          <li>
            <strong>Management &amp; Maintenance (about 18%)</strong> – daily
            operations, vendors, facilities
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "Who actually needs a Florida CAM license (and this course)?",
    text: "If you’re paid to manage a community association in Florida that has more than 10 units or an annual budget over $100,000, you need a CAM license. This covers condos, HOAs, co-ops, and timeshares.",
    a: (
      <p>
        If you’re paid to manage a community association in Florida that has
        more than 10 units or an annual budget over $100,000, you need a CAM
        license. This covers condos, HOAs, co-ops, and timeshares.
      </p>
    ),
  },
  {
    q: "What is the process to obtain a CAM license after the course?",
    text: "Upon successful completion of the 16-hour course, aspiring CAMs must follow these steps to obtain their license: Submit an Application: File an application with the Florida Department of Business and Professional Regulation (DBPR). Electronic Fingerprinting: Submit your fingerprints for a background check. Make an appointment online or contact IdentoGO at (800) 528-1358 for more information. Pass the State Exam: After the application is approved, candidates must schedule and pass the state CAM examination with a score of 75% or higher.",
    a: (
      <>
        <p>
          Upon successful completion of the 16-hour course, aspiring CAMs must
          follow these steps to obtain their license:
        </p>
        <ul>
          <li>
            <a
              href="https://www.myfloridalicense.com/intentions2.asp"
              target="_blank"
              rel="noreferrer"
            >
              Submit an Application
            </a>
            : File an application with the Florida Department of Business and
            Professional Regulation (DBPR).
          </li>
          <li>
            <strong>Electronic Fingerprinting:</strong> Submit your fingerprints
            for a background check.{" "}
            <a
              href="https://fl.state.identogo.com/"
              target="_blank"
              rel="noreferrer"
            >
              Make an appointment online
            </a>{" "}
            or contact IdentoGO at (800) 528-1358 for more information.
          </li>
          <li>
            <strong>Pass the State Exam:</strong> After the application is
            approved, candidates must{" "}
            <a
              href="https://www.pearsonvue.com/us/en/fl/dbpr.html"
              target="_blank"
              rel="noreferrer"
            >
              schedule and pass the state CAM examination
            </a>{" "}
            with a score of 75% or higher.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "What are the continuing education (CE) requirements after I get my Florida CAM license?",
    text: "Florida CAMs must complete 15 hours of CE every renewal cycle (you can take the hours in classroom, correspondence, or approved online/distance formats). Licenses renew on September 30 of even-numbered years. If you provide CAM services to homeowners’ associations (HOAs), you must include 5 hours specific to HOAs, with at least 3 hours on recordkeeping—bringing your total to 17 hours for that cycle. Be sure your courses are DBPR-approved and keep your completion certificates on file.",
    a: (
      <>
        <p>
          Florida CAMs must{" "}
          <Link href="/florida-cam-continuing-education">
            complete 15 hours of CE every renewal cycle
          </Link>{" "}
          (you can take the hours in classroom, correspondence, or approved
          online/distance formats). Licenses renew on September 30 of
          even-numbered years.
        </p>
        <p>
          If you provide CAM services to homeowners’ associations (HOAs), you
          must include 5 hours specific to HOAs, with at least 3 hours on
          recordkeeping—bringing your total to 17 hours for that cycle. Be sure
          your courses are DBPR-approved and keep your completion certificates
          on file.
        </p>
      </>
    ),
  },
] as const;

/** Bespoke FAQ per course slug. Courses absent here fall back to CourseFaq. */
export const COURSE_FAQS: Record<string, readonly FaqItem[] | undefined> = {
  "re-mutual-recognition-exam-prep": MUTUAL_RECOGNITION_FAQS,
  "re-sales-associate-exam-prep": REAL_ESTATE_EXAM_FAQS,
};
