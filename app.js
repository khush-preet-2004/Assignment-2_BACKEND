const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Read tasks from JSON
const getTasks = () => {
    try {
        const data = fs.readFileSync('tasks.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Routes
app.get('/tasks', (req, res) => {
    const tasks = getTasks();
    res.render('tasks', { tasks });
});

app.get('/task', (req, res) => {
    const tasks = getTasks();
    const task = tasks.find(t => t.id == req.query.id);
    res.render('task', { task });
});

app.get('/addTask', (req, res) => {
    res.render('addTask');
});

app.post('/addTask', (req, res) => {
    const tasks = getTasks(); // Get current tasks

    const newTask = {
        id: tasks.length + 1,
        name: req.body.name,
        description: req.body.description
    };

    tasks.push(newTask);

    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));

    res.redirect('/tasks'); // Redirect back to task list
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
