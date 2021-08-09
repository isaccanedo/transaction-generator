# transaction-generator
Generates random valid looking transactions for use as test data. You can control the:

* Number of inputs (example: from 1 to 3)
* Number of outputs (example: from 1 to 5)
* Respend minimum (example: don't respend within 800k transactions)

Requires node.js with `npm` and PostgreSQL.

## Output Format
The output format is similar to https://github.com/anders94/dump-bitcoin-transactions
```
{
  "ins":[
    "<id>",
    "<id>",
    ...
  ],
  "outs":[
    ["<id>","<value>"],
    ["<id>","<value>"],
    ...
  ]
}
```


## Sample Output
```
{"ins":["0000000000000000000000000000000000000000000000000000000000000000"],"outs":[["0eea2459eca88fe67d5d243fc80aff57344a157ac8da42ee3b8d930961ad51d2",6142000]]}
{"ins":["0000000000000000000000000000000000000000000000000000000000000000"],"outs":[["448aabdd7a63c85969381aee4be4f60dff78293d4796af351151f8abf4271a95",8050500]]}
{"ins":["ee42c2d2e2169fdf9140f05ee94fce5befdd128d6ece2780238f332ee550ef71","e844f61ee7f1c835f98f5c6fefad2ba0f038a5c7f097ad58f4d0d9e5b536a218"],"outs":[["d2eb5df599ab7b12b98b4dc85cf9b1d3dd0ab6bad1c98810cdd9823d3c04cb5f",1979302],["cb6b8119842199c4c72dd8ebd732046d69f4a3745efde8454ee1685f02ce601d",544972],["acdddaf1c683243f0527455f929cdcba035ea3c9787eab89bd5e44ca5051c5e2",3854926]]}
{"ins":["a37bdb046bf3288df426d9286f69cacc72d504c4c33e70aa9bfff5060317f99b","9e53bde859862d7972b4f1f293a233040b560e05f6e31d6d4e8896bcebef3e81"],"outs":[["379709b23bc0807e48c4aea5b3bf20cb9c89464b11a3d7db28c3c30cdc01579c",353100],["075cbc25a54d173d8d5a9c7bdf59c665d26680d2fe6d0f3f1651df4d5c11c07a",475857],["92488dde980ea0f86f6ae8ac62ab2e61d83d9798a3cdeab72b0b4138db0cfa8d",6539443]]}
```

## Setup
Install the dependancies:
```
npm install
```

Install `db-migrate` globally so you have it in your path:
```
npm install -g db-migrate
```

Set environment variables to point to your PostgreSQL instance:
```
export PGHOST="127.0.0.1"
export PGDATABASE="transaction-generator_dev"
export PGUSERNAME="<username>"
export PGPASSWORD="<your-password-here>"
```

Run the database migrations:
```
db-migrate up
```

## Usage
Adjust the options near the top of `app.js`.

```
const totalAccounts = 1_000_000;
const totalTransactions = 100_000_000;
const minimumAge = 800_000; // respend delay - at least this many steps after output creation

const initialAmountMin = 100;
const initialAmountMax = 100000;
const inputsMax = 2;  // maximum number of inputs to consume per transaction
const outputsMax = 4; // maximum number of outputs to create per transaction
```

Run the app and capture the results from STDOUT.
```
node app > transactions.txt
```

## License
Copyright (c) 2020 Anders Brownworth

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
