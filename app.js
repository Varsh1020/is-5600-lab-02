let userData = [];
let stocksData = [];

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Parse the data only once
        userData = JSON.parse(userContent);
        stocksData = JSON.parse(stockContent);

        generateUserList(userData, stocksData);
    } catch (error) {
        console.error("Error parsing JSON data:", error);
    }
});

function generateUserList(users, stocksData) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; // Clear existing list

    users.forEach(({ user, id }) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${user.lastname}, ${user.firstname}`;
        listItem.setAttribute('id', id);
        userList.appendChild(listItem);
    });

    // Add event listener for user selection
    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocksData));
}

function handleUserListClick(event, users, stocksData) {
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);
    if (user) {
        populateForm(user);
        renderPortfolio(user, stocksData);
    }
}

function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
}

function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = ''; // Clear previous data

    portfolio.forEach(({ symbol, owned }) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.classList.add('portfolio-item');

        const symbolEl = document.createElement('p');
        const sharesEl = document.createElement('p');
        const actionEl = document.createElement('button');

        symbolEl.innerText = `Symbol: ${symbol}`;
        sharesEl.innerText = `Shares: ${owned}`;
        actionEl.innerText = 'View';
        actionEl.setAttribute('id', symbol);

        portfolioItem.appendChild(symbolEl);
        portfolioItem.appendChild(sharesEl);
        portfolioItem.appendChild(actionEl);
        portfolioDetails.appendChild(portfolioItem);
    });

    // Add event listener for stock selection
    portfolioDetails.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            viewStock(event.target.id, stocks);
        }
    });
}

function viewStock(symbol, stocks) {
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
        const stock = stocks.find(s => s.symbol == symbol);
        if (stock) {
            document.querySelector('#stockName').textContent = stock.name;
            document.querySelector('#stockSector').textContent = stock.sector;
            document.querySelector('#stockIndustry').textContent = stock.subIndustry;
            document.querySelector('#stockAddress').textContent = stock.address;
            document.querySelector('#logo').src = `logos/${symbol}.svg`;
        } else {
            console.warn(`Stock data not found for symbol: ${symbol}`);
        }
    }
}

// Add event listeners for buttons
document.querySelector('#deleteUserButton').addEventListener('click', (event) => {
    event.preventDefault();

    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);

    if (userIndex !== -1) {
        userData.splice(userIndex, 1); // Remove user from array
        generateUserList(userData, stocksData); // Refresh user list
        clearForm();
    } else {
        console.warn(`User ID ${userId} not found.`);
    }
});

document.querySelector('#saveUserButton').addEventListener('click', (event) => {
    event.preventDefault();

    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);

    if (userIndex !== -1) {
        const updatedUser = {
            id: userId,
            user: {
                firstname: document.querySelector('#firstname').value,
                lastname: document.querySelector('#lastname').value,
                address: document.querySelector('#address').value,
                city: document.querySelector('#city').value,
                email: document.querySelector('#email').value
            }
        };

        // Update the user data array
        userData[userIndex] = updatedUser;

        generateUserList(userData, stocksData); // Refresh user list
        clearForm();
    } else {
        console.warn(`User ID ${userId} not found.`);
    }
});

// Clear form function
function clearForm() {
    document.querySelector('#userID').value = '';
    document.querySelector('#firstname').value = '';
    document.querySelector('#lastname').value = '';
    document.querySelector('#address').value = '';
    document.querySelector('#city').value = '';
    document.querySelector('#email').value = '';
}


