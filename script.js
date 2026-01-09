// onSubmit
const transactionForm = document.getElementById("transactionForm");
transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
});

// Update Transactions
const updateTransactions = () => {
    let transactionList = document.getElementById("transactionList");
    transactionList.innerHTML = "";
}

let monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Onload
document.addEventListener("DOMContentLoaded", (e) => {
    // Show all transactions when page load
    let months = document.getElementById("months");

    //  Get current month
    let date = new Date();
    let monthNum = date.getMonth();
    let currentMonth = monthsArray[monthNum];

    // Set dropdown value and displaying transactions
    months.value = currentMonth;
    displayTransactions();
    months.addEventListener("change", monthChange);
    dashboard();
});

// On month change Function
let months = document.getElementById("months");
const monthChange = () => {
    let transactionList = document.getElementById("transactionList");
    updateTransactions();
    displayTransactions();
    dashboard();

    // If No Transactions on selected month
    if (transactionList.innerHTML === "") {
        transactionList.innerHTML = '<div class="empty-state">No transactions found in this month. Add your first Transaction!</div>';
    }
}

// Display Transactions
const displayTransactions = () => {
    let transactionList = document.getElementById("transactionList");
    let months = document.getElementById("months");

    // LocalStoragen Setup
    !localStorage.getItem("transactions") ? localStorage.setItem("transactions", "[]") : "";
    let transactions = JSON.parse(localStorage.getItem("transactions"));

    // Sorting transactions in reverse
    transactions.sort((a, b) => b.id - a.id);

    // Displaying Transactions
    transactions.forEach((trans) => {
        if (trans.month === months.value) {
            transactionList.innerHTML += `<div class="transaction-item ${trans.type}-item">
            <div class="transaction-info">
            <h4>${trans.title}</h4>
            <p>${trans.category} • ${trans.date}</p>
            </div>
            <span class="transaction-amount ${trans.type}">
            ${trans.type === 'income' ? '+' : '-'} ${trans.amount + "₹"}
            </span>
            <button class="delete-btn" data-id="${trans.id}">X</button>
            </div>`
        }
    });

    // If No Transactions on selected month
    let monthTrans = transactions.filter((t) => {
        return t.month === months.value;
    });

    if (monthTrans.length === 0) {
        transactionList.innerHTML = '<div class="empty-state">No transactions found in this month. Add your first Transaction!</div>';
    }

    dashboard();
}

// Add Transaction
const addTransaction = document.getElementById("add-transaction");
addTransaction.addEventListener("click", (e) => {
    let title = document.getElementById("title");
    let amount = document.getElementById("amount");
    let type = document.getElementById("type");
    let date = document.getElementById("date");
    let category = document.getElementById("category");
    let transaction = JSON.parse(localStorage.getItem("transactions"));
    let input = document.querySelectorAll(".inp");

    // Checking empty fields
    let emptyFields = [...input].some(el => el.value === "");
    if (emptyFields) {
        return;
    }

    // Months
    let monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let newDate = new Date(date.value);
    let monthNum = newDate.getMonth();

    // New Transaction
    let newTransaction = {
        id: Date.now(),
        title: title.value,
        amount: amount.value,
        type: type.value,
        category: category.value,
        date: date.value,
        month: monthsArray[monthNum]
    }

    // Saving transaction in localStorage
    transaction.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transaction));

    // Clearing input
    title.value = "";
    amount.value = "";
    type.value = "";
    category.value = "";
    date.value = "";

    updateTransactions();
    displayTransactions();
    totalByCategory();
});

// Delete Transaction
const transactionList = document.getElementById("transactionList");
transactionList.addEventListener("click", (e) => {
    let transactions = JSON.parse(localStorage.getItem("transactions"));
    if (e.target.classList.contains("delete-btn")) {
        let transactionId = Number(e.target.dataset.id);
        let filteredTransactions = transactions.filter((item) => {
            return transactionId !== item.id;
        })
        localStorage.setItem("transactions", JSON.stringify(filteredTransactions));
        updateTransactions();
        displayTransactions()
        totalByCategory();
    }
});

// Filter
const filterBtn = document.querySelectorAll(".filter-btn");
filterBtn.forEach((btn) => {
    let transactionList = document.getElementById("transactionList");
    btn.addEventListener("click", () => {
        // Income filter
        if (btn.innerHTML === "Income") {
            let transactions = JSON.parse(localStorage.getItem("transactions"));
            let filteredTrans = transactions.filter((t) => {
                return t.type === "income";
            });
            updateTransactions();


            // Sorting transactions in reverse
            filteredTrans.sort((a, b) => b.id - a.id);

            // Rendering Transactions
            filteredTrans.forEach((trans) => {
                if (trans.month === months.value) {
                    transactionList.innerHTML += `<div class="transaction-item ${trans.type}-item">
                    <div class="transaction-info">
                    <h4>${trans.title}</h4>
                    <p>${trans.category} • ${trans.date}</p>
                    </div>
                    <span class="transaction-amount ${trans.type}">
                    ${trans.type === 'income' ? '+' : '-'} ${trans.amount + "₹"}
                    </span>
                    <button class="delete-btn" data-id="${trans.id}">X</button>
                    </div>`
                }
            });
            transactionList.innerHTML === "" ? transactionList.innerHTML = '<div class="empty-state">No transactions found in this month. Add your first Transaction!</div>' : "";
        }

        // Expense filter
        else if (btn.innerHTML === "Expenses") {
            let transactions = JSON.parse(localStorage.getItem("transactions"));
            let filteredTrans = transactions.filter((t) => {
                return t.type === "expense";
            });
            updateTransactions();

            // Sorting transactions in reverse
            filteredTrans.sort((a, b) => b.id - a.id);

            filteredTrans.forEach((trans) => {
                if (trans.month === months.value) {
                    transactionList.innerHTML += `<div class="transaction-item ${trans.type}-item">
                    <div class="transaction-info">
                    <h4>${trans.title}</h4>
                    <p>${trans.category} • ${trans.date}</p>
                    </div>
                    <span class="transaction-amount ${trans.type}">
                        ${trans.type === 'income' ? '+' : '-'} ${trans.amount + "₹"}
                    </span>
                    <button class="delete-btn" data-id="${trans.id}">X</button>
                    </div>`
                }
            });
            transactionList.innerHTML === "" ? transactionList.innerHTML = '<div class="empty-state">No transactions found in this month. Add your first Transaction!</div>' : "";
        }
        else {
            updateTransactions();
            displayTransactions();
        }
    });
});

// Income/Expense Dashboard
const dashboard = () => {
    let totalExpense = document.getElementById("total-expense");
    let totalIncome = document.getElementById("total-income");
    let balance = document.getElementById("balance");
    let income = 0;
    let expense = 0;
    let leftBalance = 0;

    // Total Income
    const totalIncomeFunction = () => {
        let transaction = JSON.parse(localStorage.getItem("transactions")) || [];
        transaction.forEach((trans) => {
            if (trans.month === months.value && trans.type == "income") {
                income += Number(trans.amount);
            }
        });
        income > 0 ? totalIncome.innerHTML = "₹" + income : totalIncome.innerHTML = "₹0.00";
    }

    // Total Expense
    const totalExpenseFunction = () => {
        let transaction = JSON.parse(localStorage.getItem("transactions")) || [];
        transaction.forEach((trans) => {
            if (trans.month === months.value && trans.type == "expense") {
                expense += Number(trans.amount);
            }
        });
        expense > 0 ? totalExpense.innerHTML = "₹" + expense : totalExpense.innerHTML = "₹0.00";
    }

    totalIncomeFunction();
    totalExpenseFunction();

    // Total left balance
    leftBalance = income - expense;
    leftBalance > 0 || income >= 0 ? balance.innerHTML = "₹" + leftBalance : balance.innerHTML = "₹0.00";
}

// Setting for category when month change
let selectedMonths = document.getElementById("months")
selectedMonths.addEventListener("change", ()=>{
    totalByCategory();
});

// Total Category Amount
const totalByCategory = () => {
    let transactions = JSON.parse(localStorage.getItem("transactions"));
    let totalExpense = 0;

    // Total Expense
    let transaction = JSON.parse(localStorage.getItem("transactions")) || [];
    let expense = 0;
    transaction.forEach((trans) => {
        if (trans.month === months.value && trans.type == "expense") {
            expense += Number(trans.amount);
        }
        totalExpense = expense;
    });

    // Food filter
    const foodCategory = () => {
        let foodMeter = document.getElementById("food-meter");
        let foodMoney = document.getElementById("food-money");
        let foodPrctg = document.getElementById("food-prctg");
        let foodFilter = transactions.filter((trans) => {
            if (trans.month == months.value) {
                return trans.category === "food";
            }
        });
        let foodExpense = 0;
        foodFilter.forEach((amt) => {
            foodExpense = foodExpense + Number(amt.amount);
        });
        let foodPresentage = (foodExpense / totalExpense) * 100;
        foodMeter.value = Number(foodPresentage.toFixed(2));
        foodMoney.innerHTML = "₹" + foodExpense;
        foodPrctg.innerHTML = Number(foodPresentage.toFixed(2)) + "% of total expense";
    }
    foodCategory();

    // Transport filter
    const transportCategory = () => {
        let transportMeter = document.getElementById("transport-meter");
        let transportMoney = document.getElementById("transport-money");
        let transportPrctg = document.getElementById("transport-prctg");
        let transportFilter = transactions.filter((trans) => {
            if (trans.month == months.value) {
                return trans.category === "transport";
            }
        });
        let transportExpense = 0;
        transportFilter.forEach((amt) => {
            transportExpense = transportExpense + Number(amt.amount);
        });
        let transportPresentage = (transportExpense / totalExpense) * 100;
        transportMeter.value = Number(transportPresentage.toFixed(2));

        transportMoney.innerHTML = "₹" + transportExpense;
        transportPrctg.innerHTML = Number(transportPresentage.toFixed(2)) + "% of total expense";
    }
    transportCategory();

    // Utilities filter
    const utilitiesCategory = () => {
        let utilitiesMeter = document.getElementById("utilities-meter");
        let utilitiesMoney = document.getElementById("utilities-money");
        let utilitiesPrctg = document.getElementById("utilities-prctg");

        let utilitiesFilter = transactions.filter((trans) => {
            if (trans.month == months.value) {
                return trans.category === "utilities";
            }
        });
        let utilitesExpense = 0;
        utilitiesFilter.forEach((amt) => {
            utilitesExpense = utilitesExpense + Number(amt.amount);
        });

        let utilitiesPresentage = (utilitesExpense / totalExpense) * 100;
        utilitiesMeter.value = Number(utilitiesPresentage.toFixed(2));

        utilitiesMoney.innerHTML = "₹" + utilitesExpense;
        utilitiesPrctg.innerHTML = Number(utilitiesPresentage.toFixed(2)) + "% of total expense";
    }
    utilitiesCategory();

    // Entertainment filter
    const entertainmentCategory = () => {
        let entmntMeter = document.getElementById("entertainment-meter");
        let entmntMoney = document.getElementById("entertainment-money");
        let entmntPrctg = document.getElementById("entertainment-prctg");

        let entertainmentFilter = transactions.filter((trans) => {
            if (trans.month == months.value) {
                return trans.category === "entertainment";
            }
        });
        let entertainmentExpense = 0;
        entertainmentFilter.forEach((amt) => {
            entertainmentExpense = entertainmentExpense + Number(amt.amount);
        });
        let entmntPresentage = (entertainmentExpense / totalExpense) * 100;
        entmntMeter.value = Number(entmntPresentage.toFixed(2));

        entmntMoney.innerHTML = "₹" + entertainmentExpense;
        entmntPrctg.innerHTML = Number(entmntPresentage.toFixed(2)) + "% of total expense";
    }
    entertainmentCategory();

    // Healthcare filter
    const healthcareCategory = () => {
        let healthcareMeter = document.getElementById("healthcare-meter");
        let healthcareMoney = document.getElementById("healthcare-money");
        let healthcarePrctg = document.getElementById("healthcare-prctg");

        let healthcareFilter = transactions.filter((trans) => {
            if (trans.month == months.value) {
                return trans.category === "healthcare";
            }
        });
        let healthcareExpense = 0;
        healthcareFilter.forEach((amt) => {
            healthcareExpense = healthcareExpense + Number(amt.amount);
        });
        let healthcarePresentage = (healthcareExpense / totalExpense) * 100;
        healthcareMeter.value = Number(healthcarePresentage.toFixed(2));

        healthcareMoney.innerHTML = "₹" + healthcareExpense;
        healthcarePrctg.innerHTML = Number(healthcarePresentage.toFixed(2)) + "% of total expense";
    }
    healthcareCategory();

    // Other filter
    const otherCategory = () => {
        let otherMeter = document.getElementById("other-meter");
        let otherMoney = document.getElementById("other-money");
        let otherPrctg = document.getElementById("other-prctg");

        let otherFilter = transactions.filter((trans) => {
            if (trans.month == months.value) {
                return trans.category === "other";
            }
        });
        let otherExpense = 0;
        otherFilter.forEach((amt) => {
            otherExpense = otherExpense + Number(amt.amount);
        });
        let otherPresentage = (otherExpense / totalExpense) * 100;
        otherMeter.value = Number(otherPresentage.toFixed(2));

        otherMoney.innerHTML = "₹" + otherExpense;
        otherPrctg.innerHTML = Number(otherPresentage.toFixed(2)) + "% of total expense";
    }
    otherCategory();
}
totalByCategory();