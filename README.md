# Cash-Flow

A Production-Ready Vanilla JavaScript Salary & Expense Tracker Dashboard.

## Features
- **Dynamic Dashboard**: Track your salary, expenses, and remaining balance.
- **Data Persistence**: Uses `localStorage` to keep your data safe even after a browser refresh.
- **Interactive Chart**: Visualizes remaining balance vs total expenses using Chart.js.
- **Currency Converter**: Dynamically convert displayed values to USD, EUR, GBP using the Frankfurter API.
- **PDF Reports**: Export your current dashboard status as a professional PDF report.
- **Critical Alerts**: Automatically warns you when your remaining balance drops below 10% of your total salary.

## Technologies Used
- HTML5
- CSS3 (Vanilla, Custom Properties, Flexbox, Grid)
- JavaScript (ES6+, DOM Manipulation, LocalStorage)
- Chart.js (via CDN)
- jsPDF (via CDN)

## Project Structure
- `index.html`: The markup structure of the application.
- `style.css`: Modern styling with a dark-mode first, premium aesthetic.
- `script.js`: Core application logic covering state management, rendering, validation, and APIs.
- `Prompts.md`: Documentation of prompts used to generate the project.
- `README.md`: Project documentation.

## How to Run
1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser.
3. No build steps, bundlers, or local servers are required!

## Core Implementations

### LocalStorage Persistence
The application uses a centralized state object `state`. Whenever the state changes (adding an expense, changing salary, altering currency), `saveState()` is called to serialize the state via `JSON.stringify()` into `localStorage`. On application load, `loadState()` deserializes it and restores the UI.

### Calculations
Calculations strictly convert input string values to Numbers using `parseFloat()` to prevent concatenation bugs. Total expenses are computed using `Array.prototype.reduce()`, and remaining balance is derived dynamically. 

### Chart.js Integration
A Chart.js pie chart dynamically updates whenever a change occurs. Previous chart instances are cleanly destroyed using `.destroy()` before rendering a new one to prevent memory leaks and overlapping canvas issues.

### Currency API
The app integrates with the free Frankfurter API. Base values are internally stored as INR (or the base currency defined), and exchange rates are fetched asynchronously. The `formatCurrency()` function dynamically converts rendering output without modifying the underlying core state.

### jsPDF
The "Download Report" functionality uses jsPDF to programmatically generate a well-formatted document summarizing the dashboard's current state, parsing the application array and formatting it cleanly into the PDF.

## Future Improvements
- Multi-month tracking (Historical data).
- Categorization of expenses (Food, Rent, Utilities) with separate chart colors.
- Offline-first capabilities using Service Workers.
- Support for more currencies and locale-specific number formatting.
