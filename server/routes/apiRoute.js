const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser")
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;
const HOST = process.env.RPC_HOST;
const PORT = process.env.RPC_PORT;

const Client = require('bitcoin-core');
const client = new Client({ 
    host: HOST,
    username: USER,
    password: PASS,
    port: PORT
  });

const app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});


app.use(express.json())
app.use(cors({origin: "*", credentials: true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());


function getReward(height) {
  const halvings = Math.floor(height / 210000); 
  if (halvings >= 64) {
    return 0; 
  }
  return 50 / Math.pow(2, halvings); 
}

router.route('/getBlockchainInfo').get(async (req, res) => {
  try {
    const response = await client.getBlockchainInfo();
    return res.json(response);
  }
  catch (err) {
    res.status(500).send(err.message); 
  }
});


router.route('/getDifficulty').get(async (req, res) => {
  try {
    const difficulty = await client.getDifficulty();
    res.json({ difficulty });
  }
  catch (err) {
    res.status(500).send(err);
  }
});


router.route('/transactionNum').get(async (req, res) => {
  try {
    const response = await client.getChainTxStats();
    return res.json(response);
  }
  catch (err) {
    res.status(500).send(err.message); 
  }
});


router.route('/blockInfoWithStats/:blockHash').get(async (req, res) => {
  try {
    const blockData = await client.getBlock(req.params.blockHash);
    const blockStats = await client.getBlockStats(req.params.blockHash);
    const reward = getReward(blockData.height);
    const response = { blockData, blockStats, reward, };
    return res.json(response);

  }
  catch (err) {
    console.error("Greska:", err);
    res.status(500).send({ error: "Doslo je do greske" });
  }
});


router.route('/blockInfoWithStatsByHeight/:height').get(async (req, res) => {
  try {
    const blockHash = await client.getBlockHash(parseInt(req.params.height));
    const blockData = await client.getBlock(blockHash);
    const blockStats = await client.getBlockStats(blockHash);
    const reward = getReward(blockData.height);
    const response = { blockData, blockStats, reward, };
    return res.json(response);

  } 
  catch (err) {
    console.error("Greska:", err);
    res.status(500).send({ error:"Doslo je do greske" });
  }
});



async function getDecodedTransaction(txid) {
  try {
    return await client.getRawTransaction(txid, true); // true za dekodirani format
  } 
  catch (err) {
    console.error(err);
    throw new Error('error');
  }
}

async function getBlockHeight(blockhash) {
  if (!blockhash) return null;
  try {
    const block = await client.getBlock(blockhash);
    return block.height;

  } catch (err) {
    console.error("error:", err);
    return null;
  }
}


async function getInputValues(transaction) {
  let totalInputValue = 0;
  const inputValues = [];

  for (const input of transaction.vin) {
    if (input.txid) {
      try {
        const previousTransaction = await client.getRawTransaction(input.txid, true);
        const previousOutput = previousTransaction.vout[input.vout];
        const address = previousOutput.scriptPubKey.address || "Unkown";

        totalInputValue += previousOutput.value;

        inputValues.push({
          txid: input.txid,
          address,
          vout: input.vout,
          value: previousOutput.value
        });
      } catch (err) {
        console.error(`greska za ${input.txid}:`, err);
      }
    }
  }
  return { totalInputValue, inputValues };
}

//naknada za transakciju
function calculateFee(totalInputValue, totalOutputValue) {
  return totalInputValue - totalOutputValue;
}

//vrijednost izlaza
function calculateTotalOutputValue(outputs) {
  return outputs.reduce((sum, output) => sum + output.value, 0);
}


router.route('/rawtransaction/:txid').get(async (req, res) => {
  try {
    const txid = req.params.txid;
    const transaction = await getDecodedTransaction(txid);
    const blockHeight = await getBlockHeight(transaction.blockhash); //visina bloka

    const isCoinbase = transaction.vin.length === 1 && transaction.vin[0].coinbase;
    let fee = null;

    if (!isCoinbase) {
      const { totalInputValue, inputValues } = await getInputValues(transaction);
      const totalOutputValue = calculateTotalOutputValue(transaction.vout);
      fee = calculateFee(totalInputValue, totalOutputValue);
      transaction.inputs = inputValues;
      transaction.totalInputValue = totalInputValue;
      transaction.totalOutputValue = totalOutputValue;
    } 
    else { //za coinbase
     
      transaction.inputs = [
        { txid: null, address: null, vout: null, value: null, coinbase: transaction.vin[0] }
      ];
      transaction.totalInputValue = 0;
      transaction.totalOutputValue = calculateTotalOutputValue(transaction.vout);
      fee = 0;
    }

    return res.json({
      ...transaction,
      blockHeight: blockHeight,
      fee: parseFloat(fee.toFixed(8)),
      inputs: transaction.inputs,
      outputs: transaction.vout.map(output => ({
        value: output.value,
        address: output.scriptPubKey.address || "OP_RETURN", 
        scriptPubKey: output.scriptPubKey 
      }))
    });
  }
  catch (err) {
    console.error("error", err);
    res.status(500).send({ error: "greska pri dohvacanju transakcije" });
  }
});


router.route('/last10blocks').get(async (req, res) => {
  try {
    const blockCount = await client.getBlockCount();
    const blockHashes = [];

    for (let i = 0; i < 10; i++) {
      const blockHashIndex = blockCount - i;
      blockHashes.push(client.getBlockHash(blockHashIndex)); 
    }

    //paralelno dohvacanje
    const hashes = await Promise.all(blockHashes); 

    const blocksDataPromises = hashes.map((hash) => {
      return client.getBlock(hash)
        .then(block => ({
          hash: hash,
          height: block.height,
          nTx: block.tx.length,
          timestamp: block.time
        }));
    });
    const blocksData = await Promise.all(blocksDataPromises);
    res.json({ blocksData });

  }
  catch (err) {
    console.error("Error fetching block data:", err);
    res.status(500).json({ error: err.message });
  }
});


router.route('/mempoolTransaction').get((req, res) => {
  client.getRawMempool().then((err, trans) => {
    if (err) {
      res.send(err)
    }
    else {
      return res.json({ transactions: trans })
    }
  })
})


router.route('/largestTransactions').get((req, res) => {
  client.getRawMempool()
      .then(txids => {
          const transactions = [];
          let completed = 0;

          txids.forEach(txid => {
              client.getMempoolEntry(txid)
                  .then(tx => {
                      transactions.push({ txid, fee: tx.fees.base, time: tx.time });

                      completed++;
                      if (completed === txids.length) {
                          const largestTransactions = transactions
                              .sort((a, b) => b.fee - a.fee) // po naknadi
                              .slice(0, 10); 

                          res.json(largestTransactions);
                      }
                  })
                  .catch(err => {
                      completed++;
                      if (completed === txids.length) {
                          console.error("error", err.message);
                          res.status(500).send("error");
                      }
                  });
          });
          if (txids.length === 0) {
              res.json([]);
          }
      })
      .catch(error => {
          console.error("error fetching mempool", error.message);
          res.status(500).send("error fetching mempool");
      });
});


//razlika u vremenu
router.route('/blockStats').get(async (req, res) => {
  try {
    const blockchainInfo = await client.getBlockchainInfo();
    let currentBlockHash = blockchainInfo.bestblockhash;

    const blockHeights = [];
    const blockTimes = [];

    for (let i = 0; i < 10; i++) {
      const blockStats = await client.getBlock(currentBlockHash); 
      blockHeights.push(blockStats.height);                    
      blockTimes.push(blockStats.time);                        
      currentBlockHash = blockStats.previousblockhash;          
      if (!currentBlockHash) break;                             
    }

    const timeDifferences = [];
    for (let i = 1; i < blockTimes.length; i++) {
      const diff = blockTimes[i - 1] - blockTimes[i]; 
      timeDifferences.push(diff);
    }

    res.json({ blockHeights, timeDifferences });
  }
  catch (error) {
    console.error("error", error);
    res.status(500).send(error.message); 
  }
});


router.route('/totalAndAvgFee').get(async (req, res) => {
  try {
    const blockCount = await client.getBlockCount();
    const blocksDataPromises = [];

    for (let i = 0; i < 10; i++) {
      const blockHeight = blockCount - i; //trenutni
      const blockHash = await client.getBlockHash(blockHeight);

      blocksDataPromises.push(
        client.getBlock(blockHash)
          .then(async (block) => {
            const blockStats = await client.getBlockStats(block.hash); 

            return {
              height: block.height,
              totalFee: blockStats.totalfee, 
              avgFee: blockStats.avgfee, 
            };
          })
          .catch(error => {
            console.error("error", error);
            return null; 
          })
      );
    }

    const blocksData = await Promise.all(blocksDataPromises);
    const validBlocks = blocksData.filter(block => block !== null); //zanemarit null

    res.json({ blocksData: validBlocks });

  }
  catch (err) {
    console.error("error fetching block data:", err);
    res.status(500).json({ error: err.message });
  }
});

router.route('/compareBlocks/:block1/:block2').get(async (req, res) => {
  try {
      const block1 = req.params.block1;
      const block2 = req.params.block2;

      const getBlockByIdentifier = async (identifier) => {
          if (!isNaN(identifier)) {
            //broj -> visina
            const hash = await client.getBlockHash(parseInt(identifier));
            const block = await client.getBlock(hash);
            const stats = await client.getBlockStats(hash); 
            return { ...block, stats }; 
          }
          else { 
            const block = await client.getBlock(identifier);
            const stats = await client.getBlockStats(identifier); 
            return { ...block, stats };
          }
      };

      const blockData1 = await getBlockByIdentifier(block1);
      const blockData2 = await getBlockByIdentifier(block2);
      res.json({ block1: blockData1, block2: blockData2 });
  }
  catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.route('/lastBlock').get((req, res) => {
  client.getBestBlockHash().then((blockHash) => {
    client.getBlock(blockHash).then((err, block) => {
      if (err) {
        res.send(err)
      }
      else {
        return res.json(block)
      }
    })
  })
});


const CoinGecko = require("coingecko-api");
const cg = new CoinGecko();

router.route('/bitcoinPrice24h').get(async (req, res) => {
  try {
    const response = await cg.coins.fetchMarketChart('bitcoin', {
      vs_currency: 'usd',
      days: '1', 
    });

    const prices = response.data.prices;
    
    const formattedPrices = prices.map((price) => {
      const timestamp = new Date(price[0]); 
      const priceInUSD = price[1];  

      //format
      const time = timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, 
      });

      return {
        time: time, 
        price: priceInUSD.toFixed(2),
      };
    });

    res.json(formattedPrices);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error' });
  }
});



module.exports = router;

