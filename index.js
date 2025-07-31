const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/add', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).send('Inputs must be numbers');
    }
    const sum = num1 + num2;
    res.send(`The sum is ${sum}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
