const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors({ credentials: true }));
app.use(bodyParser.json());

app.get('/api/classify-number', async (req, res) => {
    try {
        const number = Number(req.query.number);

        // Input validation
        if (isNaN(number) || !Number.isInteger(number)) {
            return res.status(400).json({
                "number": "invalid",
                "error": true
            });
        }

        const response = await axios.get(`http://numbersapi.com/${number}/math`);
        const properties = [];

        if (number >= 0) {
            if (isArmstrong(number)) properties.push("armstrong");
            if (isOdd(number)) properties.push("odd");
            else properties.push("even");
        } else {
            if (isOdd(number)) properties.push("odd");
            else properties.push("even");
        }

        return res.status(200).json({
            "number": number,
            "is_prime": number > 1 ? isPrime(number) : false,
            "is_perfect": number > 0 ? isPerfectNumber(number) : false,
            "properties": properties,
            "digit_sum": digitalSum(number),
            "fun_fact": response.data
        });

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
    for (let i = 2; i <= Math.sqrt(num); i++) {
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
            if (i !== num / i) {
                sum += num / i;
            }
        }
    }
    return sum === num;
}

function digitalSum(num) {
    const digits = String(Math.abs(num)).split('').map(Number);
    const sum = digits.reduce((acc, digit) => acc + digit, 0);
    return num < 0 ? -sum : sum;
}

function isArmstrong(num) {
    if (num < 0) return false;
    const numStr = String(num);
    const power = numStr.length;
    const sum = numStr
        .split('')
        .reduce((acc, digit) => acc + Math.pow(parseInt(digit), power), 0);
    return sum === num;
}

function isOdd(num) {
    return num % 2 !== 0;
}