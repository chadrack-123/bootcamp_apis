// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Initial Prices
let callPrice = 2.75;
let smsPrice = 0.65;

// Routes

// Words Widget API
app.get('/api/word_game', (req, res) => {
    const sentence = req.query.sentence;
    if (!sentence) {
        return res.status(400).send({ error: 'Sentence query parameter is required' });
    }

    const words = sentence.split(' ').filter(word => word !== '');
    const longestWord = words.reduce((a, b) => a.length >= b.length ? a : b, '');
    const shortestWord = words.reduce((a, b) => a.length <= b.length ? a : b, '');
    const sum = words.reduce((total, word) => total + word.length, 0);

    res.json({
        longestWord: longestWord.length,
        shortestWord: shortestWord,
        sum: sum
    });
});

// Total Phone Bill API - Calculate Total
app.post('/api/phonebill/total', (req, res) => {
    const { bill } = req.body;

    if (!bill) {
        return res.status(400).send({ error: 'Bill parameter is required' });
    }

    const items = bill.split(',').map(item => item.trim().toLowerCase());
    let total = 0;

    items.forEach(item => {
        if (item === 'call') total += callPrice;
        else if (item === 'sms') total += smsPrice;
    });

    res.json({ total: total.toFixed(2) });
});

// Total Phone Bill API - Get Prices
app.get('/api/phonebill/prices', (req, res) => {
    res.json({ call: callPrice.toFixed(2), sms: smsPrice.toFixed(2) });
});

// Total Phone Bill API - Set Price
app.post('/api/phonebill/price', (req, res) => {
    const { type, price } = req.body;

    if (!type || price === undefined) {
        return res.status(400).send({ error: 'Type and price parameters are required' });
    }

    if (type === 'call') {
        callPrice = parseFloat(price);
        res.json({ status: 'success', message: `The call price was set to ${callPrice.toFixed(2)}` });
    } else if (type === 'sms') {
        smsPrice = parseFloat(price);
        res.json({ status: 'success', message: `The sms price was set to ${smsPrice.toFixed(2)}` });
    } else {
        res.status(400).send({ error: 'Invalid type. Must be "call" or "sms".' });
    }
});

// Enough Airtime API
app.post('/api/enough', (req, res) => {
    const { usage, available } = req.body;

    if (!usage || available === undefined) {
        return res.status(400).send({ error: 'Usage and available parameters are required' });
    }

    const items = usage.split(',').map(item => item.trim().toLowerCase());
    let totalCost = 0;

    items.forEach(item => {
        if (item === 'call') totalCost += callPrice;
        else if (item === 'sms') totalCost += smsPrice;
        else if (item === 'data') totalCost += 12; // Assuming data cost is fixed at 12
    });

    const balance = available - totalCost;
    const result = balance < 0 ? `R${(balance * -1).toFixed(2)}` : `R${balance.toFixed(2)}`;

    res.json({ result });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
