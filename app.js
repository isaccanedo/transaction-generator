const crypto = require('crypto')
const config = require('./config');
const { Pool } = require('pg');

// global variales
//const totalAccounts = 10_000_000;
//const totalTransactions = 100_000_000;
//const minimumAge = 1_000_000; // at least this many steps since creation of the account
const totalAccounts = 10_000;
const totalTransactions = 10_000;
const minimumAge = 5_000; // at least this many steps since creation of the account

const initialAmountMin = 100;
const initialAmountMax = 100000;
const inputsMax = 2;  // maximum number of inputs to consume per transaction
const outputsMax = 4; // maximum number of outputs to create per transaction

const pool = new Pool(config.postgres);

const randomString = () => {
    return crypto
	.createHash('sha256')
	.update(crypto.randomBytes(32).toString('base64'))
	.digest('hex');
};

const log = (ins, outs) => {
    console.log(JSON.stringify({ins: ins, outs: outs}));

}

const between = (min, max) => {
    return Math.floor(
	Math.random() * (max - min) + min
    );
};

const main = async () => {
    // initialize global step counter
    let step = 0;

    const client = await pool.connect();

    // clean out the database
    await client.query(`DELETE FROM accounts`);

    // create some accounts
    for (; step<totalAccounts; step++) {
	const initialAmount = between(initialAmountMin, initialAmountMax) * 100;
	const res = await client.query(`
          INSERT INTO accounts (
            step, address, amount
          )
          VALUES (
            $1, $2, $3
          )
          RETURNING address
          `,[step, randomString(), initialAmount]);

	log(['0000000000000000000000000000000000000000000000000000000000000000'], [[res.rows[0].address, initialAmount]]);

    }

    // create some transactions
    for (; step<(totalAccounts+totalTransactions); step++) {
	const res = await client.query(`
          SELECT *
          FROM accounts
          WHERE step < $1
            AND amount > 0
          ORDER BY RANDOM()
          LIMIT $2`, [step - minimumAge, inputsMax]);

	let ins = [];
	let outs = [];
	let total = 0;

	await client.query('BEGIN');
	const numInputs = between(1, inputsMax + 1);
	for (let i=0; i<numInputs; i++) {
	    await client.query(`
              UPDATE accounts
              SET amount = 0
              WHERE address = $1
              `, [res.rows[i].address]);
	    total += Number(res.rows[i].amount);
	    ins.push(res.rows[i].address);
	}

	const numOutputs = between(1, outputsMax + 1);
	for (let o=0; o<numOutputs; o++) {
	    const address = randomString();
	    let amount;

	    if (o == numOutputs - 1) // consume the rest in the last output
		amount = total;
	    else {
		amount = between(1, total/2); // don't consume too much!
		total -= amount;
	    }

	    await client.query(`
              INSERT INTO accounts
                (step, address, amount)
              VALUES
                ($1, $2, $3)
              `, [step, address, amount]);

	    outs.push([address, amount]);
	}
	await client.query('COMMIT');

	log(ins, outs);

    }

    // we're done
    await client.end();

}

main();
