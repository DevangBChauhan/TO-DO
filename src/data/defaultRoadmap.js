// Default QA → SDET Roadmap Data
// Pre-populated with 5 phases based on the master roadmap

import { generateId } from '../utils/progressUtils';

export const DEFAULT_TARGET_DATE = '2027-01-27';
export const DEFAULT_START_DATE = new Date().toISOString().split('T')[0];

export function createDefaultRoadmap() {
  return [
    {
      id: generateId(),
      name: 'Java Foundation for Automation',
      description:
        'Bhai, ye phase skip mat karna. Selenium pe jaane se pehle Java strong honi chahiye. Nahi toh har error pe stuck ho jaoge aur phir chod doge — same cycle.',
      phaseNumber: 1,
      weeksRange: 'Weeks 1–4',
      priority: 'critical',
      status: 'working',
      badge: 'PRIORITY 1',
      color: '#f0a500',
      weeks: [
        {
          id: generateId(),
          name: 'Week 1 – Java Basics',
          tasks: [
            { id: generateId(), name: 'Variables, Data Types, Operators', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Conditions (if/else, switch)', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Loops (for, while, do-while)', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Write 5 practice exercises', priority: 'critical', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 2 – Methods & Arrays',
          tasks: [
            { id: generateId(), name: 'Methods – define, call, return values', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Arrays – declare, iterate, modify', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Strings – common methods', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Write 5 method-based exercises', priority: 'critical', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 3 – OOP Concepts',
          tasks: [
            { id: generateId(), name: 'Classes, Objects, Constructors', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Inheritance, Polymorphism, Encapsulation, Abstraction (IPEA)', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Exception Handling – try/catch/finally/custom exceptions', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Interfaces & Abstract classes', priority: 'important', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 4 – Collections & Maven',
          tasks: [
            { id: generateId(), name: 'Collections – ArrayList, HashMap basics', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Maven setup – pom.xml, adding dependencies', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Lambda & Streams (intro only)', priority: 'optional', completed: false, completedAt: null },
            { id: generateId(), name: 'File handling basics', priority: 'optional', completed: false, completedAt: null },
            { id: generateId(), name: 'Milestone check: write User class from scratch', priority: 'critical', completed: false, completedAt: null },
          ],
        },
      ],
      milestone:
        'You can write a Java class from scratch — without Google — that reads a list of users, filters by age, and prints their names. No tutorial. Just you and IntelliJ.',
    },
    {
      id: generateId(),
      name: 'Git + Selenium Basics + First Real Tests',
      description:
        'Ab Selenium aayega — but Git pehle. Har din ka code GitHub pe jaana chahiye. Ye tumhara portfolio hai. Interviewers GitHub dekhte hain.',
      phaseNumber: 2,
      weeksRange: 'Weeks 5–8',
      priority: 'critical',
      status: 'not-started',
      badge: 'PRIORITY 2',
      color: '#3b82f6',
      weeks: [
        {
          id: generateId(),
          name: 'Week 5 – Git Fundamentals',
          tasks: [
            { id: generateId(), name: 'Git: init, clone, add, commit, push, pull', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Git: branch, merge, conflict resolution', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Create GitHub repo "qa-automation-journey"', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Push all Phase 1 code to GitHub', priority: 'critical', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 6 – Selenium Setup & Basics',
          tasks: [
            { id: generateId(), name: 'Selenium: WebDriver setup, browser launch/close', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Locators: ID, Name, Class, CSS, XPath (relative)', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Actions: click, sendKeys, getText, getAttribute', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'First test: open browser → navigate → assert title', priority: 'critical', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 7 – Waits & Advanced Actions',
          tasks: [
            { id: generateId(), name: 'Waits: Implicit, Explicit (WebDriverWait) – no Thread.sleep', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Alerts, Frames, Windows/Tabs handling', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Dropdowns (Select class), Tables iteration', priority: 'important', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 8 – First Real Test Suite',
          tasks: [
            { id: generateId(), name: 'Automate 5+ scenarios on demoqa.com', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Automate login → search → verify on the-internet.herokuapp.com', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Screenshots on failure', priority: 'optional', completed: false, completedAt: null },
            { id: generateId(), name: 'Push all code to GitHub', priority: 'critical', completed: false, completedAt: null },
          ],
        },
      ],
      milestone:
        'You can automate a full login → search → verify result flow on a real website (e.g. demoqa.com) using proper locators and explicit waits. Code is on GitHub.',
    },
    {
      id: generateId(),
      name: 'TestNG + Page Object Model + Framework',
      description:
        'Ye woh phase hai jo tumhe "script writer" se "engineer" banata hai. POM samajhna aur implement karna — ye SDET ka core skill hai.',
      phaseNumber: 3,
      weeksRange: 'Weeks 9–12',
      priority: 'critical',
      status: 'not-started',
      badge: 'PRIORITY 3',
      color: '#22c55e',
      weeks: [
        {
          id: generateId(),
          name: 'Week 9 – TestNG Basics',
          tasks: [
            { id: generateId(), name: 'TestNG: @Test, @BeforeMethod, @AfterMethod', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'TestNG: groups, priority, dependsOnMethods', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Assertions with TestNG Assert class', priority: 'critical', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 10 – Page Object Model',
          tasks: [
            { id: generateId(), name: 'POM design pattern – understand the concept', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'PageFactory – @FindBy, initElements', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Build 3+ page classes for your practice site', priority: 'critical', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 11 – Framework Architecture',
          tasks: [
            { id: generateId(), name: 'Build reusable utilities: BaseTest, DriverFactory, Helpers', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Data-driven testing with TestNG DataProvider', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Configuration management (config.properties)', priority: 'important', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 12 – Reports & Parallel',
          tasks: [
            { id: generateId(), name: 'Extent Reports or Allure – proper test reporting', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Parallel execution with TestNG XML suite', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Cucumber/BDD basics – feature files, step definitions', priority: 'optional', completed: false, completedAt: null },
            { id: generateId(), name: 'Milestone: complete POM framework with 5+ test cases on GitHub', priority: 'critical', completed: false, completedAt: null },
          ],
        },
      ],
      milestone:
        'You have a complete POM framework on GitHub: 3+ page classes, 5+ test cases, TestNG suite running, reports generating. An interviewer can clone it and run it.',
    },
    {
      id: generateId(),
      name: 'API Testing + RestAssured + SQL Deepening',
      description:
        'UI → API → DB. Ye trifecta tumhara strongest weapon hai interviews mein. Most "automation testers" sirf UI karte hain. Tum teeno karoge.',
      phaseNumber: 4,
      weeksRange: 'Weeks 13–16',
      priority: 'important',
      status: 'not-started',
      badge: 'PRIORITY 4',
      color: '#8b5cf6',
      weeks: [
        {
          id: generateId(),
          name: 'Week 13 – HTTP & API Concepts',
          tasks: [
            { id: generateId(), name: 'HTTP methods, Status codes, Headers, Auth (Bearer/Basic)', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Postman: test APIs manually on reqres.in', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'JSON structure – parsing and understanding', priority: 'critical', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 14 – RestAssured Basics',
          tasks: [
            { id: generateId(), name: 'RestAssured: GET, POST, PUT, DELETE with assertions', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'JSON parsing, response validation, schema validation', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Convert Postman collections to RestAssured code', priority: 'important', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 15 – SQL Deepening',
          tasks: [
            { id: generateId(), name: 'SQL: JOINs, subqueries, GROUP BY, data validation queries', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'API negative testing: wrong auth, missing fields, boundary', priority: 'important', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 16 – Full Stack Test',
          tasks: [
            { id: generateId(), name: 'Combine: UI action → verify via API → verify via DB', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Contract testing concept (Pact – intro only)', priority: 'optional', completed: false, completedAt: null },
            { id: generateId(), name: 'Milestone: full registration API test flow on GitHub', priority: 'critical', completed: false, completedAt: null },
          ],
        },
      ],
      milestone:
        'You can test a user registration API end-to-end: POST the request, assert response, query DB to verify record created. All in one test flow. On GitHub.',
    },
    {
      id: generateId(),
      name: 'Interview Prep + CI/CD + Portfolio Polish',
      description:
        'Skill banana aur interview dena alag cheez hai. Ye phase bridge hai. GitHub polish, mock interviews, CI/CD basics, aur job applications — sab saath chalega.',
      phaseNumber: 5,
      weeksRange: 'Weeks 17–20',
      priority: 'important',
      status: 'not-started',
      badge: 'PRIORITY 5',
      color: '#ef4444',
      weeks: [
        {
          id: generateId(),
          name: 'Week 17 – Portfolio & Applications',
          tasks: [
            { id: generateId(), name: 'GitHub README polish – project ko presentable banao', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Resume update with projects + skills section', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Start applying from Week 17 – don\'t wait for "perfect"', priority: 'important', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 18 – CI/CD Basics',
          tasks: [
            { id: generateId(), name: 'GitHub Actions: basic workflow to run tests on push', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Docker intro – just enough to run tests in container', priority: 'optional', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 19 – Interview Practice',
          tasks: [
            { id: generateId(), name: 'Mock interviews: explain your framework, walkthrough code', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Common SDET interview questions (Java + Selenium + API)', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Coding rounds prep: basic DSA (arrays, strings, maps)', priority: 'important', completed: false, completedAt: null },
          ],
        },
        {
          id: generateId(),
          name: 'Week 20 – Final Polish',
          tasks: [
            { id: generateId(), name: 'Walk through full framework without notes', priority: 'critical', completed: false, completedAt: null },
            { id: generateId(), name: 'Set Naukri/LinkedIn alerts: "SDET Java", "Automation Tester Java"', priority: 'important', completed: false, completedAt: null },
            { id: generateId(), name: 'Milestone: CI/CD pipeline running on GitHub', priority: 'critical', completed: false, completedAt: null },
          ],
        },
      ],
      milestone:
        'You can walk an interviewer through your complete automation framework — every class, every decision, every design choice — without reading from notes. And your CI/CD pipeline runs on GitHub.',
    },
  ];
}
