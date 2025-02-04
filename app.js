const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors({ credentials: true }));
app.use(bodyParser.json());

app.get('/api/classify-number', async (req, res) => {
    try {
        const number = parseInt(req.query.number);

        // Input validation
        if (isNaN(number)) {
            return res.status(400).json({ number: "alphabet", error: true });
        }

        // Check cache first
        const cachedData = cache.get(number);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        // Parallel processing
        const funFactPromise = axios.get(`http://numbersapi.com/${number}/math`);
        const properties = [];

        if (isArmstrong(number)) properties.push("armstrong");
        properties.push(isOdd(number) ? "odd" : "even");

        const [funFactResponse] = await Promise.all([funFactPromise]);

        const responseData = {
            number: number,
            is_prime: isPrime(number),
            is_perfect: isPerfectNumber(number),
            properties: properties,
            digit_sum: digitalSum(number),
            fun_fact: funFactResponse.data
        };

        // Cache the response
        cache.set(number, responseData);

        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Connected to server on ${PORT}`);
});

function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function isPerfectNumber(num) {
    if (num <= 1) return false;
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num;
}

function digitalSum(num) {
    return Math.abs(num).toString().split('').reduce((sum, digit) => sum + +digit, 0);
}

function isArmstrong(num) {
    const numStr = Math.abs(num).toString();
    const power = numStr.length;
    const sum = numStr.split('').reduce((acc, digit) => acc + Math.pow(+digit, power), 0);
    return sum === Math.abs(num);
}

function isOdd(num) {
    return num % 2 !== 0;
}
