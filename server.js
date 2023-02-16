const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const notes = require('./db/notes');

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);



// GET request
app.get('/api/notes', (req, res) => {
    var options = { encoding: 'utf8', flag: 'r' };
    res.json(JSON.parse(fs.readFileSync('./db/notes.json', options)));
});

// POST request to add a review
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;

    // Check if there is anything in the response body
    if (title && text) {
        const newNote = {
            title,
            text,
        };

        // Obtain existing reviews
        fs.readFile('./db/notes.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write updated reviews back to the file
                fs.writeFile(
                    './db/notes.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });
        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);

    } else {
        res.status(500).json('Error in posting note');
    }
});






app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});


// const notesBtn = document.getElementById('notesBtn');

// const getNotes = () =>
//     reftch('/api/notes', {
//         method: 'GET',
//     })
//         .then((res) => res.json())
//         .then((data) => data);

// const buttonHandler = () =>
//     getNotes().then(response);

// notesBtn.addEventListener('click', buttonHandler);
// const petEl = document.getElementById('pets');
// const termButton = document.getElementById('term-btn');

// const getPets = () =>
//     fetch('/api/pets', {
//         method: 'GET',
//     })
//         .then((res) => res.json())
//         .then((data) => data);

// const renderPet = (pet) => {
//     const cardEl = document.createElement('div');
//     const cardImageEl = document.createElement('img');
//     const cardBodyEl = document.createElement('div');
//     const cardBodyTitle = document.createElement('div');

//     cardImageEl.classList.add('image', 'p-5');
//     cardEl.classList.add('card', 'p-5');
//     cardBodyEl.classList.add('card-body', 'p-5');
//     cardBodyTitle.classList.add('card-header', 'card-title', 'link');

//     cardImageEl.setAttribute('src', pet.image_url);
//     cardBodyTitle.innerHTML = pet.name;
//     cardBodyEl.innerText = pet.description;
//     cardEl.appendChild(cardBodyTitle);
//     cardEl.appendChild(cardBodyEl);
//     cardEl.appendChild(cardImageEl);
//     petEl.appendChild(cardEl);
// };