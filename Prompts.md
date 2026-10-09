# AI Engineering Assistant Prompts

This file documents the prompts used during the development of **Cash-Flow**, demonstrating how AI was leveraged as an engineering assistant.

## 1. Initial Project Generation Prompt
*Prompt provided by user to generate the requirements and constraints.*
- Constraints: Vanilla JS only, no frameworks, use Chart.js, use jsPDF, include currency conversion, alert system, and persist via localStorage.
- Outcome: AI analyzed the requirements and structured the project into 3 separate standard files (`index.html`, `style.css`, `script.js`), adhering to all the instructions and best practices.

## 2. UI Improvement Prompts
- The AI was instructed implicitly via the primary requirement to make the dashboard visually appealing, responsive, and to use semantic HTML and good CSS practices.
- The AI decided to use a sleek dark mode theme with glassmorphic cards, standard CSS variables for easy theming, and flexbox/grid for responsive layouts.

## 3. JavaScript Logic Prompts
- Required to handle complex state operations without a framework.
- The AI utilized a unified `state` object and single-source-of-truth methodologies to dictate UI rendering.

## 4. LocalStorage Debugging Prompts
- Constraints included persisting data securely and parsing correctly on reload.
- The AI encapsulated this in `loadState()` and `saveState()` functions and ensured type safety when parsing strings back to numbers.

## 5. Chart.js & PDF Generation Prompts
- Required implementing external CDN libraries properly in vanilla JS.
- The AI managed the chart instance actively, destroying the previous instance before re-rendering to prevent ghost charts. For PDFs, the jsPDF library was utilized to construct a dynamic document line-by-line based on the current state.

## 6. API Integration Prompts
- Required fetching real-time exchange rates.
- The AI utilized `fetch` async/await logic with the free Frankfurter API, decoupling the UI display value from the core persisted data value to ensure data integrity during currency swaps.
