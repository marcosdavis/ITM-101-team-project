let passwords = JSON.parse(localStorage.getItem('myPasswords')) || [];

// Initial render
renderPasswords();

function addPassword() {
    const site = document.getElementById('siteInput');
    const pass = document.getElementById('passInput');

    if (site.value && pass.value) {
        passwords.push({ site: site.value, pass: pass.value });
        saveAndRender();
        site.value = '';
        pass.value = '';
    } else {
        alert("Please fill in both fields");
    }
}

function deletePassword(index) {
    passwords.splice(index, 1);
    saveAndRender();
}

function copyPassword(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Password copied to clipboard!");
    });
}

function editPassword(index) {
    const newPass = prompt("Enter new password:", passwords[index].pass);
    if (newPass !== null) {
        passwords[index].pass = newPass;
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('myPasswords', JSON.stringify(passwords));
    renderPasswords();
}

function renderPasswords() {
    const tableBody = document.getElementById('passwordTableBody');
    tableBody.innerHTML = '';

    passwords.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.site}</td>
                <td>•••••••• (Click edit to view/change)</td>
                <td>
                    <button class="copy-btn" onclick="copyPassword('${item.pass}')">Copy</button>
                    <button class="edit-btn" onclick="editPassword(${index})">Edit</button>
                    <button class="delete-btn" onclick="deletePassword(${index})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}