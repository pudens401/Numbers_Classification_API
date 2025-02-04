const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({limit:'100mb',extended:true}))
app.use(cors({credentials:true}))
app.use(bodyParser.json())

app.get('/api/classify-number', async(req,res) => {
    try {
        const number = parseInt(req.query.number);
        
        // Input validation
        if (isNaN(number)) {
            return res.status(400).json({
                "number":"alphabet",
                "error":true
            });
        }

        const response = await axios.get(`http://numbersapi.com/${number}/math`)
        const properties = [];

        if(isArmstrong(number)) properties.push("armstrong")

        if(isOdd(number)) properties.push("odd")
        else properties.push("even")

        return res.status(200).json({
            "number": number,
            "is_prime": isPrime(number),
            "is_perfect": isPerfectNumber(number),
            "properties": properties,
            "digit_sum": digitalSum(number),
            "fun_fact": response.data
        })
        
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Connected to server on ${PORT}`)
})

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
            // Only add the pair if it's different from i
            if (i !== num / i) {
                sum += num / i;
            }
        }
    }
    return sum === num;
}


// Fucntion to add all digits of a number
function digitalSum(num) {
    return String(num)
        .split('')
        .reduce((sum, digit) => sum + parseInt(digit), 0);
}

// Function to check if a number is armstrong or  not
function isArmstrong(num) {
    const numStr = String(num);
    const power = numStr.length;
    const sum = numStr
        .split('')
        .reduce((acc, digit) => acc + Math.pow(parseInt(digit), power), 0);
    return sum === parseInt(num);
}

// function to  find if a number is odd or not
function isOdd(num) {
    return num % 2 !== 0;
}
