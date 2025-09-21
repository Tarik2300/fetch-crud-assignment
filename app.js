let users = []; //global array til at gemme brugere

console.log("javascript virker"); // besked i konsolle
alert("eyyy"); // viser popup besked

// async funktion til at hente brugere
async function fetchUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users"); // henter API
    users = await response.json(); // gemmer i global aray
    console.log(users); // vis brugere i konsollen

    renderUsers(users) // kalder funktion til at vise brugertabel
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

    for (const user of users) { // løber gennem alle brugere
        html += `
        <tr>
            <td>${user.name}</td> 
            <td>${user.email}</td> 
            <td>${user.phone}</td>
            <td>${user.website}</td> 
        </tr>
`;
    }
    html += `</tbody>`;

    const usersTable = document.getElementById("usersTable"); // finder tabel i HTML
    usersTable.innerHTML = html; // indsætter HTML i tabel
}

const userForm = document.getElementById("userForm");

userForm.addEventListener("submit", async function(event) {
    event.preventDefault(); // stopper standard from aubmission

    // henter værdier fra form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const newUser = {name, email};

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST", //opretter ny bruger
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newUser) // sender data som JSON
        });

        const data = await response.json(); // modtager svar
        console.log("Bruger oprettet:", data);

        users.push(data); // tilføjer den nye bruger til global array
        renderUsers(users); // opdaterer tabel

        userForm.reset(); // rydder formfelter
    } catch (error) {
        console.error("Fejl ved oprettelse:", error);// fejl besked
    }
});

