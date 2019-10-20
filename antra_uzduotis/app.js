
function sha256(ascii) {
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	let mathPow = Math.pow;
	let maxWord = mathPow(2, 32);
	let lengthProperty = 'length'
	let i, j; // Used as a counter across the whole file
	let result = ''

	let words = [];
	let asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	let hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	let k = sha256.k = sha256.k || [];
	let primeCounter = k[lengthProperty];
	/*/
	let hash = [], k = [];
	let primeCounter = 0;
	//*/

	let isComposite = {};
	for (let candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		let w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		let oldHash = hash;
		// This is now the undefinedworking hash", often labelled as letiables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			let i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			let w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			let a = hash[0], e = hash[4];
			let temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			let temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			let b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};




class User{
    constructor(){
        let alphanumerics = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
        
        this.balance = Math.floor(Math.random() * (1000000 - 100 + 1) + 100);
        
        this.name = "";
        for(let i = 0; i < 15; i++){
            this.name += alphanumerics[Math.floor(Math.random()*alphanumerics.length)]
        }
        
        this.public_key = "";
        for(let i = 0; i < 64; i++){
            this.public_key += alphanumerics[Math.floor(Math.random()*alphanumerics.length)]
        }
    }
}

class Block{
    constructor(prev_block, timestamp, version, nonce, dificulty_target,transactions = []){
        this.header = {
            prev_block : prev_block, 
            timestamp : timestamp,
            version : version,
            nonce : nonce,
            dificulty_target : dificulty_target,
        }
        this.body = {
            transactions : transactions,
        }
    }

    hashBlock(){
        return sha256(this.header.prev_block + this.header.timestamp + this.header.version + this.header.nonce + this.header.dificulty_target);
	}
	
	iterate_nonce(){
		this.header.nonce += 1;
	}

}

class Transaction{
    constructor(from_user, to_user, amount){
        this.from_user = from_user;
        this.to_user = to_user;
        this.amount = amount;
    }

    hashTransaction(){
        return sha256(JSON.stringify(this.to_user, this.from_user, this.amount));
    }
}


class Blockchain{
	constructor(userCount, transactionCount, version, diff_level){
		this.version = version;
		this.dificulty_target = diff_level;
		let genesisBlock = new Block(null,Date.now(),this.version,0,this.dificulty_target);
		this.chain = [];
		this.chain[genesisBlock.hashBlock()] = genesisBlock;
		this.users = this.generateUsers(userCount);
		this.transactions = this.generateTransactions(transactionCount);
	}

	generateUsers(count) {
		let users = [];
		for(let i = 0; i < count; i ++){
			let tempUser = new User();
			users.push(tempUser);
		}
		return users;
	}

	generateTransactions(count){
		let transactions = [];
		for(let i = 0; i < count; i++){
			let user1 = this.users[Math.floor(Math.random()*this.users.length)];
			let user2 = this.users[Math.floor(Math.random()*this.users.length)];
			
			let transaction = new Transaction(user1,user2,Math.floor(Math.random()*user1.balance))
			transactions.push(transaction);
		}
		return transactions;
	}


	mineBlock() {
		let block = new Block(this.chain[Object.keys(this.chain)[Object.keys(this.chain).length-1]].hashBlock(),Date.now(),this.version,0,this.dificulty_target);
		while(block.hashBlock().substring(0,this.dificulty_target) !== Array(this.dificulty_target+1).join("0")){
			block.iterate_nonce();
		}
		this.nextBlock = block;
	}

	addBlock(block,size){

		for(let i = 0; i < size; i++){
			let random = Math.floor(Math.random()*this.transactions.length);
			block.body.transactions.push(this.transactions[random]);
			this.transactions.splice(random,1);
		}

		this.chain[block.hashBlock()] = block;
	}

	populateChain(blockBodySize){
		while(this.transactions.length){
			this.mineBlock();
			this.addBlock(this.nextBlock,blockBodySize);
		}
	}
}


let myChain = new Blockchain(1000,10000,'0.1',2);

myChain.populateChain(100);

console.log(myChain);