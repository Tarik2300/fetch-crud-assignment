let users = []; // global array til at gemme brugere

console.log("javascript virker"); // skriver besked i konsollen
alert("eyyy"); // viser en popup besked til brugeren

// async funktion til at hente brugere fra API
async function fetchUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users"); // henter data fra API
    users = await response.json(); // konverterer JSON til JavaScript-objekter og gemmer i global array
    console.log(users); // viser brugere i konsollen

    renderUsers(users) // kalder funktionen der viser brugerne i tabellen
}
fetchUsers(); // kalder fetchUsers når siden loader

// funktion til at vise brugere i tabel
function renderUsers(users) {
    let html = ` 
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Website</th>
        </tr>
    </thead>
    <tbody>
`;

    for (const user of users) { // løber gennem alle brugere i arrayet
        html += `
        <tr data-id="${user.id}"> <!-- gemmer brugerens id i data-id -->
            <td>${user.name}</td> 
            <td>${user.email}</td> 
            <td>${user.phone || ""}</td> <!-- hvis phone er tom, vis tom streng -->
            <td>${user.website || ""}</td>
            <td><button class="editBtn">Edit</button></td> <!-- knap til at redigere bruger --> 
            <td><button class="deleteBtn">Delete</button></td>
        </tr>
`;
    }
    html += `</tbody>`;

    const usersTable = document.getElementById("usersTable"); // finder tabel i HTML
    usersTable.innerHTML = html; // indsætter HTML i tabellen
}

const editState = {editing: false, userId: null}; // holder styr på om vi er i edit-mode og hvilken bruger der redigeres

// event listener til Edit-knapper
document.getElementById("usersTable").addEventListener("click", function(event){
    if (event.target.classList.contains("editBtn")){ // tjekker om knappen er Edit
        const row = event.target.closest("tr"); // finder den række knappen er i
        const id = row.getAttribute("data-id"); // henter bruger-id fra data-attribut
        const user = users.find(u => u.id == id); // finder brugeren i arrayet

        document.getElementById("name").value = user.name; // fylder form med navn
        document.getElementById("email").value = user.email; // fylder form med email
        document.getElementById("phone").value = user.phone || ""; // fylder form med email
        document.getElementById("website").value = user.website || ""; // fylder form med email

        editState.editing = true; // sætter edit-mode til true
        editState.userId = id; // gemmer id på den bruger vi redigerer
    } else if (event.target.classList.contains("deleteBtn")) {
        const row = event.target.closest("tr"); // find rækken
        const id = Number(row.getAttribute("data-id")); // hent bruger-id og konverter til tal
        users = users.filter(u => u.id !== id); // fjern brugeren fra array
        renderUsers(users); // opdater tabellen
    }
})

const userForm = document.getElementById("userForm"); // finder formen i HTML

// event listener til form submission
userForm.addEventListener("submit", async function(event) {
    event.preventDefault(); // stopper standard form submission

    // henter værdir fra form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const website = document.getElementById("website").value;

    const newUser = {name, email, phone, website}; // laver et nyt bruger-objekt

    try {
        let response;
        let data;

        if (editState.editing) {
            //opdaterer bruger
            response = await fetch(`https://jsonplaceholder.typicode.com/users/${editState.userId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUser)
            });
            data = await response.json();

            const index = users.findIndex(u => u.id == editState.userId);
            users[index] = data;

            editState.editing = false;
            editState.userId = null;

        } else {
            response = await fetch("https://jsonplaceholder.typicode.com/users", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUser)
            });
            data = await response.json();
            users.push(data);
        }

        renderUsers(users);
        userForm.reset();
    } catch (error) {
        console.error("fejl ved oprettelse eller opdatering", error);
    }
});
