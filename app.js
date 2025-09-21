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

        editState.editing = true; // sætter edit-mode til true
        editState.userId = id; // gemmer id på den bruger vi redigerer
    }
})

const userForm = document.getElementById("userForm"); // finder formen i HTML

// event listener til form submission
userForm.addEventListener("submit", async function(event) {
    event.preventDefault(); // stopper standard form submission

    // henter værdir fra form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const newUser = {name, email}; // laver et nyt bruger-objekt

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST", // opretter ny bruger
            headers: {"Content-Type": "application/json"}, // fortæller server at vi sender JSON
            body: JSON.stringify(newUser) // sender brugerdata som JSON
        });

        const data = await response.json(); // modtager svar fra API
        console.log("Bruger oprettet:", data); // viser i konsollen

        users.push(data); // tilføjer den nye bruger til global array
        renderUsers(users); // opdaterer tabellen

        userForm.reset(); // clear felterne
    } catch (error) {
        console.error("Fejl ved oprettelse:", error); // fejlbesked hvis fejl
    }
});
