const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const notes = require('./db/notes');
const uuid = require('./helpers/uuid');

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
    res.json(JSON.parse(fs.readFileSync('./db/notes.json')));
});

// POST request to add a note and add it to html
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;

    // Check if there is anything in the response body
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        // Obtain existing notes in notes.json
        fs.readFile('./db/notes.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                // Write updated notes back to the file
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

// DELETE request to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {

    console.info(`${req.method} request received to delete a note`);

    fs.readFile('./db/notes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {

            const parsedNotes = JSON.parse(data);

            // new thing added, filter out the note with the specified ID
            const filterNotes = parsedNotes.filter(note => note.id !== req.params.id);


            if (filterNotes.length === parsedNotes.length) {
                // No notes were filtered out, so the specified ID was not found
                res.status(404).json('Note not found');
            } else {
                // Write updated notes back to the file
                fs.writeFile(
                    './db/notes.json',
                    JSON.stringify(filterNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully deleted note!')
                );

                const response = {
                    status: 'success',
                    body: filterNotes,
                };

                console.log(response);
                res.status(200).json(response);
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});