document.addEventListener('DOMContentLoaded', () => {
    // Elements for authentication
    const authSection = document.getElementById('authSection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const registerUsername = document.getElementById('registerUsername');
    const registerPassword = document.getElementById('registerPassword');
    const loginSuccessMessage = document.getElementById('loginSuccessMessage');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    const registerSuccessMessage = document.getElementById('registerSuccessMessage');
    const registerErrorMessage = document.getElementById('registerErrorMessage');

    // Elements for CRUD operations
    const crudSection = document.getElementById('crudSection');
    const crudForm = document.getElementById('crudForm');
    const crudTableBody = document.getElementById('crudTableBody');
    const logoutButton = document.getElementById('logoutButton');
    const searchInput = document.getElementById('search');

    const USERS_KEY = 'users';
    const ITEMS_KEY = 'crudItems';
    const AUTH_KEY = 'authenticatedUser';

    // Function to get data from localStorage
    const getStorageData = (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    };

    // Function to save data to localStorage
    const setStorageData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    let items = getStorageData(ITEMS_KEY);

    // Function to save authentication state
    const saveAuthState = (username) => {
        localStorage.setItem(AUTH_KEY, username);
    };

    // Function to check authentication state
    const checkAuthState = () => {
        const authenticatedUser = localStorage.getItem(AUTH_KEY);
        if (authenticatedUser) {
            showCrudSection();
        }
    };

    // Function to show CRUD section and hide auth section
    const showCrudSection = () => {
        authSection.classList.add('hidden');
        crudSection.classList.remove('hidden');
    };

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = loginUsername.value;
        const password = loginPassword.value;
        const users = getStorageData(USERS_KEY);

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            saveAuthState(username);
            loginSuccessMessage.classList.remove('hidden');
            setTimeout(() => {
                loginSuccessMessage.classList.add('hidden');
                showCrudSection();
            }, 1000);
        } else {
            loginErrorMessage.classList.remove('hidden');
            setTimeout(() => {
                loginErrorMessage.classList.add('hidden');
            }, 1000);
        }
    });

    // Handle Registration form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = registerUsername.value;
        const password = registerPassword.value;
        const users = getStorageData(USERS_KEY);

        const userExists = users.some(user => user.username === username);

        if (userExists) {
            registerErrorMessage.classList.remove('hidden');
            setTimeout(() => {
                registerErrorMessage.classList.add('hidden');
            }, 1000);
        } else {
            users.push({ username, password });
            setStorageData(USERS_KEY, users);
            registerSuccessMessage.classList.remove('hidden');
            setTimeout(() => {
                registerSuccessMessage.classList.add('hidden');
                registerForm.reset();
            }, 1000);
        }
    });

    // Function to render the CRUD table
    const renderTable = (filteredItems = items) => {
        crudTableBody.innerHTML = '';
        filteredItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${item.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">${item.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-2" onclick="editItem(${index})">Edit</button>
                    <button class="text-red-600 hover:text-red-900" onclick="deleteItem(${index})">Delete</button>
                </td>
            `;
            crudTableBody.appendChild(row);
        });
    };

    // Function to CREATE an item to the CRUD table
    const addItem = (name, email) => {
        items.push({ name, email });
        setStorageData(ITEMS_KEY, items);
        renderTable();
    };

    // Function to EDITE an item
    window.editItem = (index) => {
        const item = items[index];
        document.getElementById('name').value = item.name;
        document.getElementById('email').value = item.email;
        crudForm.onsubmit = (e) => {
            e.preventDefault();
            updateItem(index);
        };
    };

    // Function to UPDATE an item
    const updateItem = (index) => {
        items[index].name = document.getElementById('name').value;
        items[index].email = document.getElementById('email').value;
        setStorageData(ITEMS_KEY, items);
        crudForm.onsubmit = handleFormSubmit;
        renderTable();
        crudForm.reset();
    };

    // Function to DELETE an item
    window.deleteItem = (index) => {
        items.splice(index, 1);
        setStorageData(ITEMS_KEY, items);
        renderTable();
    };

    // Handle CRUD form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        addItem(name, email);
        crudForm.reset();
    };

    // Real-time search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredItems);
    });

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(AUTH_KEY);
        crudSection.classList.add('hidden');
        authSection.classList.remove('hidden');
    });

    // Initialize
    checkAuthState();
    crudForm.onsubmit = handleFormSubmit;
    renderTable();
});