"use strict";

var crypto = require("crypto");


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

// TODO: insert each line into blockchain
for (let line of poem) {
	let newBlock = {
		index: Blockchain.blocks.length,
		prevHash: Blockchain.blocks[Blockchain.blocks.length-1].hash,
		data: line,
		timestamp: Date.now(),
	}
	newBlock.hash = blockHash(newBlock);
	Blockchain.blocks.push(newBlock);
}

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);


// **********************************

function blockHash(bl) {
	return crypto.createHash("sha256").update(
		// TODO: use block data to calculate hash
		bl.index + bl.prevHash + bl.data + bl.timestamp
	).digest("hex");
}

function verifyChain(bc) {
	let counter = 0;
	bc.blocks.forEach( block => {
		if (!block.data) {
			return false;
		}
		if (counter == 0) {
			if (block.hash !== "000000") {
				return false;
			}
		}
		if (block.index < 0) {
			return false;
		}
		if (blockHash(block) !== block.hash) {
			return false;
		}
		counter++;

	})
	return true;
}