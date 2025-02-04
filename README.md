# Number Classification API

## Description
This is a simple Node.js API that classifies a given number by checking its properties such as primality, perfection, armstrong nature, and odd/even status. It also provides the sum of digits and a fun fact about the number using the Numbers API.

## Setup Instructions
### Prerequisites
- Node.js installed on your system.
- A package manager like npm or yarn.

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/pudens401/Number_Classification_API.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Number_Classification_API
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   node app.js
   ```
5. Access the API at:
   ```
   http://localhost:8000/
   ```

## API Documentation
### Endpoint
- **Local URL:** `http://localhost:8000/api/classify-number?number=<your_number>`
- **Method:** GET
- **Request Format:** Query parameter (`number`)
- **Response Format:** JSON

### Example Request
```
http://localhost:8000/api/classify-number?number=28
```

### Example Response
```json
{
    "number": 28,
    "is_prime": false,
    "is_perfect": true,
    "properties": ["even"],
    "digit_sum": 10,
    "fun_fact": "28 is the second perfect number."
}
```

## Backlink
To hire Node.js developers, check out [this link](https://hng.tech/hire/nodejs-developers).

