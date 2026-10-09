// Application State
const state = {
    salary: 0,
    expenses: [],
    currency: 'INR'
};

// Global Variables
let expenseChart = null;
const exchangeRates = {};

// DOM Elements
const totalSalaryDisplay = document.getElementById('total-salary-display');
const totalExpensesDisplay = document.getElementById('total-expenses-display');
const remainingBalanceDisplay = document.getElementById('remaining-balance-display');
const remainingBalanceCard = document.getElementById('remaining-balance-card');
const lowBalanceWarning = document.getElementById('low-balance-warning');

const salaryForm = document.getElementById('salary-form');
const salaryInput = document.getElementById('salary-input');
const salaryError = document.getElementById('salary-error');

const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseNameError = document.getElementById('expense-name-error');
const expenseAmountError = document.getElementById('expense-amount-error');

const expenseList = document.getElementById('expense-list');
const emptyState = document.getElementById('empty-state');

const currencySelector = document.getElementById('currency-selector');
const resetBtn = document.getElementById('reset-btn');
const downloadPdfBtn = document.getElementById('download-pdf-btn');

// Initialization
function initializeApp() {
    loadState();
    setupEventListeners();
    fetchExchangeRates();
    renderDashboard();
}

// LocalStorage Management
function loadState() {
    const savedState = localStorage.getItem('cashFlowState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            Object.assign(state, parsedState);
            if (state.currency) {
                currencySelector.value = state.currency;
            }
        } catch (e) {
            console.error("Error parsing localStorage data", e);
        }
    }
}

function saveState() {
    localStorage.setItem('cashFlowState', JSON.stringify(state));
}

// Event Listeners
function setupEventListeners() {
    salaryForm.addEventListener('submit', handleSalarySubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    expenseList.addEventListener('click', handleExpenseListClick);
    resetBtn.addEventListener('click', resetData);
    currencySelector.addEventListener('change', handleCurrencyChange);
    downloadPdfBtn.addEventListener('click', downloadReport);
}

// Validation & Submission
function handleSalarySubmit(e) {
    e.preventDefault();
    salaryError.textContent = '';
    
    const salaryValue = parseFloat(salaryInput.value);
    
    if (isNaN(salaryValue) || salaryValue < 0) {
        salaryError.textContent = 'Please enter a valid positive number.';
        return;
    }
    
    state.salary = salaryValue;
    saveState();
    renderDashboard();
    salaryInput.value = '';
}

function handleExpenseSubmit(e) {
    e.preventDefault();
    expenseNameError.textContent = '';
    expenseAmountError.textContent = '';
    
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    
    let isValid = true;
    
    if (!name) {
        expenseNameError.textContent = 'Expense name is required.';
        isValid = false;
    }
    
    if (isNaN(amount) || amount <= 0) {
        expenseAmountError.textContent = 'Please enter a valid positive amount.';
        isValid = false;
    }
    
    if (!isValid) return;
    
    const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount
    };
    
    state.expenses.push(newExpense);
    saveState();
    renderDashboard();
    
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
}

// Delete Expense
function handleExpenseListClick(e) {
    if (e.target.classList.contains('btn-icon') || e.target.closest('.btn-icon')) {
        const button = e.target.closest('.btn-icon');
        const expenseId = Number(button.dataset.id);
        deleteExpense(expenseId);
    }
}

function deleteExpense(id) {
    state.expenses = state.expenses.filter(expense => expense.id !== id);
    saveState();
    renderDashboard();
}

// Calculations
function calculateTotalExpenses() {
    return state.expenses.reduce((total, expense) => total + expense.amount, 0);
}

function calculateRemainingBalance() {
    return state.salary - calculateTotalExpenses();
}

// Currency Conversion & Formatting
function getCurrencySymbol(currency) {
    const symbols = { 'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£' };
    return symbols[currency] || '₹';
}

function convertValue(amount, toCurrency) {
    if (toCurrency === 'INR' || !exchangeRates[toCurrency]) {
        return amount; // Base is INR
    }
    const rate = exchangeRates[toCurrency];
    return amount * rate;
}

function formatCurrency(amount) {
    const symbol = getCurrencySymbol(state.currency);
    const convertedAmount = convertValue(amount, state.currency);
    return `${symbol}${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Rendering
function renderDashboard() {
    renderSummary();
    renderExpenses();
    updateChart();
    checkBalanceWarning();
}

function renderSummary() {
    const totalExpenses = calculateTotalExpenses();
    const remainingBalance = calculateRemainingBalance();
    
    totalSalaryDisplay.textContent = formatCurrency(state.salary);
    totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
    remainingBalanceDisplay.textContent = formatCurrency(remainingBalance);
}

function renderExpenses() {
    expenseList.innerHTML = '';
    
    if (state.expenses.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        
        state.expenses.forEach(expense => {
            const li = document.createElement('li');
            li.className = 'expense-item';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'expense-info';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'expense-name';
            nameSpan.textContent = expense.name;
            
            const amountSpan = document.createElement('span');
            amountSpan.className = 'expense-amount';
            amountSpan.textContent = formatCurrency(expense.amount);
            
            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(amountSpan);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon';
            deleteBtn.setAttribute('aria-label', `Delete ${expense.name}`);
            deleteBtn.dataset.id = expense.id;
            deleteBtn.innerHTML = '🗑';
            
            li.appendChild(infoDiv);
            li.appendChild(deleteBtn);
            
            expenseList.appendChild(li);
        });
    }
}

// Chart.js
function updateChart() {
    const totalExpenses = calculateTotalExpenses();
    const remainingBalance = Math.max(0, calculateRemainingBalance());
    
    const convertedExpenses = convertValue(totalExpenses, state.currency);
    const convertedRemaining = convertValue(remainingBalance, state.currency);
    
    const ctx = document.getElementById('expense-chart');
    
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    if (totalExpenses === 0 && remainingBalance === 0) {
        expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No Data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#334155']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        return;
    }
    
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Expenses', 'Remaining'],
            datasets: [{
                data: [convertedExpenses, convertedRemaining],
                backgroundColor: ['#ef4444', '#10b981'],
                borderWidth: 1,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#f8fafc' }
                }
            }
        }
    });
}

// Balance Warning
function checkBalanceWarning() {
    const remainingBalance = calculateRemainingBalance();
    const threshold = state.salary * 0.10;
    
    if (state.salary > 0 && remainingBalance < threshold) {
        lowBalanceWarning.classList.remove('hidden');
        remainingBalanceCard.classList.add('danger-state');
    } else {
        lowBalanceWarning.classList.add('hidden');
        remainingBalanceCard.classList.remove('danger-state');
    }
}

// Reset Data
function resetData() {
    const confirmReset = confirm("Are you sure you want to reset all data? This cannot be undone.");
    if (confirmReset) {
        state.salary = 0;
        state.expenses = [];
        saveState();
        
        salaryInput.value = '';
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        salaryError.textContent = '';
        expenseNameError.textContent = '';
        expenseAmountError.textContent = '';
        
        renderDashboard();
    }
}

// Currency API
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        exchangeRates['USD'] = data.rates.USD;
        exchangeRates['EUR'] = data.rates.EUR;
        exchangeRates['GBP'] = data.rates.GBP;
        exchangeRates['INR'] = 1;
        
        // Enable dropdown on success
        currencySelector.removeAttribute('disabled');
        currencySelector.removeAttribute('title');
        
        if (state.currency !== 'INR') {
            renderDashboard();
        }
    } catch (error) {
        console.error('Error fetching currency data:', error);
        // Update UI for error state
        currencySelector.title = "Currency conversion unavailable";
        
        // Fallback to base currency to avoid symbol mismatch
        if (state.currency !== 'INR') {
            state.currency = 'INR';
            currencySelector.value = 'INR';
            renderDashboard();
        }
    }
}

function handleCurrencyChange(e) {
    state.currency = e.target.value;
    saveState();
    renderDashboard();
}

// PDF Generation
function downloadReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const totalExpenses = calculateTotalExpenses();
    const remainingBalance = calculateRemainingBalance();
    const dateStr = new Date().toLocaleString();
    
    doc.setFontSize(22);
    doc.text("CASH-FLOW REPORT", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${dateStr}`, 20, 30);
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(14);
    doc.text(`Total Salary: ${formatCurrency(state.salary)}`, 20, 50);
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 20, 60);
    doc.text(`Remaining Balance: ${formatCurrency(remainingBalance)}`, 20, 70);
    
    doc.line(20, 75, 190, 75);
    
    doc.text("Expenses:", 20, 90);
    
    let yPos = 100;
    doc.setFontSize(12);
    
    if (state.expenses.length === 0) {
        doc.text("No expenses recorded.", 20, yPos);
    } else {
        state.expenses.forEach((expense) => {
            const expenseText = `${expense.name} ........ ${formatCurrency(expense.amount)}`;
            doc.text(expenseText, 20, yPos);
            yPos += 10;
            
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
        });
    }
    
    doc.save("Cash-Flow-Report.pdf");
}

// Run app
initializeApp();
