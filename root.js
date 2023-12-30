const express = require('express');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded ({extended: true}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pages/index.html');
})

app.post('/', (req, res) => {
    const heightString = req.body.height;
    const weightString = req.body.weight;
    const ageString = req.body.age;

    const height = parseFloat(heightString);
    const weight = parseFloat(weightString);
    const age = parseFloat(ageString);

    if (isNaN(height) || isNaN(weight)) {
        res.status(400).send("Invalid height or weight");
        return;
    }
    if (isNaN(age)){
        res.status(400).send("Error: type your age");
        return;
    }

    const validator = require('validator');
    if (!validator.isFloat(heightString) || !validator.isFloat(weightString)) {
        res.status(400).send("Invalid height or weight");
        return;
    }

    let result;

    if (req.body.measurementSystem === 'imperial') {
        result = (weight / Math.pow(height, 2)) * 703;
    } else {
        result = weight / Math.pow(height / 100, 2);
    }

    result = result.toFixed(1)
    let category;

    if (result < 16) {
        category = "Severe Thinnes";
    } else if (result < 17) {
        category = "Moderat e Thinnes";
    } else if (result < 18.5) {
        category = "Mild Thinnes";
    } else if (result < 25) {
        category = "Normal";
    } else if (result < 30) {
        category = "Overweight";
    } else if (result < 35) {
        category = "Obese class I";
    } else if (result < 40) {
        category = "Obese class II";
    } else {
        category = "Obese class III";
    }

    res.redirect(`/result?bmiResult=${result}&resultCategory=${category}`);
});

app.get('/result', (req, res) => {
    const bmiResult = req.query.bmiResult;
    const resultCategory = req.query.resultCategory;

    res.sendFile(__dirname + '/public/pages/result.html');
});

app.listen(3000, ()=>{
    console.log("Server running on http://localhost:3000");
})