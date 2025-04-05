const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const settingsPath = path.join(__dirname, 'data', 'settings.json');
const timesPath = path.join(__dirname, 'data', 'times.json');
const themesPath = path.join(__dirname, 'data', 'themes.json');
const algorithmsPath = path.join(__dirname, 'data', 'algorithms.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Endpoint to get current settings
app.get('/settings', (req, res) => {
    if (fs.existsSync(settingsPath)) {
        const settings = fs.readFileSync(settingsPath, 'utf-8');
        res.json(JSON.parse(settings));
    } else {
        res.json({});
    }
});

// Endpoint to update settings
app.post('/settings', (req, res) => {
    fs.writeFileSync(settingsPath, JSON.stringify(req.body, null, 4));
    res.sendStatus(200);
});

// Endpoint to get times
app.get('/times', (req, res) => {
    if (fs.existsSync(timesPath)) {
        const times = fs.readFileSync(timesPath, 'utf-8');
        res.json(JSON.parse(times));
    } else {
        res.json({});
    }
});

// Endpoint to add time to a category
app.post('/times', (req, res) => {
    const { category, time, date } = req.body;

    let times = {};
    if (fs.existsSync(timesPath)) {
        times = JSON.parse(fs.readFileSync(timesPath, 'utf-8'));
    }

    if (!times[category]) {
        times[category] = [];
    }

    times[category].push({ time, date });
    fs.writeFileSync(timesPath, JSON.stringify(times, null, 4));
    res.sendStatus(200);
});

// TODO: Endpoint to delete a time from a category

// Endpoint to get custom themes
app.get('/themes', (req, res) => {
    if (fs.existsSync(themesPath)) {
        const themes = fs.readFileSync(themesPath, 'utf-8');
        res.json(JSON.parse(themes));
    } else {
        res.json({});
    }
});

// TODO: Endpoint to add custom theme

// TODO: Endpoint to delete a custom theme

// Endpoint to get starred and complete algorithms
app.get('/algorithms', (req, res) => {
    if (fs.existsSync(algorithmsPath)) {
        const algorithms = fs.readFileSync(algorithmsPath, 'utf-8');
        res.json(JSON.parse(algorithms));
    } else {
        res.json({});
    }
});

// TODO: Endpoint to delete and add starred and complete algorithms

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
