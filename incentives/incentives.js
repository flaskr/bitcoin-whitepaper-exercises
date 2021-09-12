"use strict";

var path = require("path");
var fs = require("fs");
var crypto = require("crypto");

const KEYS_DIR = path.join(__dirname,"keys");
const PUB_KEY_TEXT = fs.readFileSync(path.join(KEYS_DIR,"pub.pgp.key"),"utf8");

// The Power of a Smile
// by Tupac Shakur
var poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

const maxBlockSize = 4;
const blockFee = 5;
var difficulty = 16;

var Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push({
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
});

var transactionPool = [];

addPoem();
processPool();
countMyEarnings();


// **********************************

function addPoem() {
	// TODO: add lines of poem as transactions to the transaction-pool
	poem.forEach(line => {
		const randomFee = Math.floor(Math.random() * 10) + 1; //random 1 to 10
		const txn = {
			data: line,
			fee: randomFee
		}
		transactionPool.push(txn);
	});
}

function processPool() {
	// TODO: process the transaction-pool in order of highest fees
	transactionPool.sort((t1, t2) => t2.fee - t1.fee);
	let currentBlock = null;
	transactionPool.forEach(txn => {
		if (!currentBlock || currentBlock.data.length >= maxBlockSize) {
			if (currentBlock) {
				Blockchain.blocks.push(currentBlock);
			}
			currentBlock = createBlock(txn.data);
			currentBlock.blockFee = blockFee;
			currentBlock.hash = blockHash(currentBlock);
			currentBlock.account = PUB_KEY_TEXT;
			currentBlock.data = [];
		}
		currentBlock.data.push(txn);
	});
	Blockchain.blocks.push(currentBlock); //flush the block containing the last txn.

}

function countMyEarnings() {
	// TODO: count up block-fees and transaction-fees
	const blocksWithoutGenesis = Blockchain.blocks.slice(1);
	let sum = 0;
	blocksWithoutGenesis.forEach(block => {
		sum += block.blockFee;
		block.data.forEach(txn => {
			console.log("TxnFee: "+ txn.fee);
			sum += txn.fee
		});
	})
	console.log("Total fees: " + sum);

}

function createBlock(data) {
	var bl = {
		index: Blockchain.blocks.length,
		prevHash: Blockchain.blocks[Blockchain.blocks.length-1].hash,
		data,
		timestamp: Date.now(),
	};

	bl.hash = blockHash(bl);

	return bl;
}

function blockHash(bl) {
	while (true) {
		bl.nonce = Math.trunc(Math.random() * 1E7);
		let hash = crypto.createHash("sha256").update(
			`${bl.index};${bl.prevHash};${JSON.stringify(bl.data)};${bl.timestamp};${bl.nonce}`
		).digest("hex");

		if (hashIsLowEnough(hash)) {
			return hash;
		}
	}
}

function hashIsLowEnough(hash) {
	var neededChars = Math.ceil(difficulty / 4);
	var threshold = Number(`0b${"".padStart(neededChars * 4,"1111".padStart(4 + difficulty,"0"))}`);
	var prefix = Number(`0x${hash.substr(0,neededChars)}`);
	return prefix <= threshold;
}

function createTransaction(data) {
	var tr = {
		data,
	};

	tr.hash = transactionHash(tr);

	return tr;
}

function transactionHash(tr) {
	return crypto.createHash("sha256").update(
		`${JSON.stringify(tr.data)}`
	).digest("hex");
}
