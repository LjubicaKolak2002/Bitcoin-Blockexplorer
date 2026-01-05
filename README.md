# Bitcoin-Blockexplorer

Application for viewing and searching basic data from a blockchain network.

## **Table of Contents**
- [Overview](#overview)
- [Key Features](#key-features)
- [Detailed Information](#detailed-information)
- [Technologies](#technologies)

## **Overview**
Blockchain Data Viewer is a web application that offers a simple and clear interface for viewing basic blockchain data such as blocks and transactions. It allows users to search for blocks by hash or height and transactions by ID, providing real-time insights into the blockchain network.

<img width="940" height="326" alt="image" src="https://github.com/user-attachments/assets/771f8a9a-5c40-4543-8355-fa154dced5e5" />
Homepage View

## **Key Features**
- <strong>Search Blocks</strong> by hash and height.
- <strong>Search Transactions</strong> by transaction ID.
- <strong>Latest Mined Blocks</strong> – View the most recently mined blocks.
- <strong>Mempool Transactions</strong> – See all transactions waiting to be included in a block.
- <strong>Transaction Fee Ranking</strong> – View the top 10 transactions with the highest fees in the mempool.
- <strong>Blockchain Statistics</strong> – View graphs displaying data on recent blocks, including time intervals and fee statistics.
- <strong>Compare Blocks</strong> – Compare two blocks and see detailed differences.
- <strong>Bitcoin Price Graph</strong> – See the 24-hour Bitcoin price trend on the homepage.

## **Detailed Information**
1. <strong>Block Details</strong>:
For each block, the following information is displayed: hash, height, size, received time, merkle root, total fee, reward, transactions included in the block...
<img width="793" height="374" alt="image" src="https://github.com/user-attachments/assets/553af1a7-7c32-4e91-a527-f70e92e42d2d" />

3. <strong>Transaction Details</strong>:
For each transaction, the following details are shown: size, confirmations, virtual size, weight, fee, date/time, included in block, inputs and outputs...
<img width="794" height="326" alt="image" src="https://github.com/user-attachments/assets/541ae906-8d2b-4141-8689-97ec832e4a47" />

4. <strong>Statistics for the last blocks</strong>:
A graph showing the time intervals between consecutive blocks in seconds.
A graph showing the total and average fee for the last 10 blocks.

  <img width="400" height="263" alt="image" src="https://github.com/user-attachments/assets/fd942de2-ec3b-4f30-9bd7-54efd23a8713" />
  <img width="440" height="263" alt="image" src="https://github.com/user-attachments/assets/53d9a6e2-1f04-4b3c-8275-701c324349e1" />
  
5. <strong>Top 10 mempool transactions</strong>:
The application provides a view of the top 10 transactions with the highest fees in the mempool, showing the transactions that will likely be processed first.
   <img width="736" height="354" alt="image" src="https://github.com/user-attachments/assets/65befba4-ada8-44a0-a6e9-63c8f0c6eef2" />


## **Technologies**
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)  ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)  ![Chart.js](https://img.shields.io/badge/Chart.js-F5B300?style=for-the-badge&logo=chartdotjs&logoColor=white) 
![Bitcoin RPC API](https://img.shields.io/badge/Bitcoin%20RPC%20API-FF9900?style=for-the-badge&logo=bitcoin&logoColor=white)  ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white) ![CoinGecko API](https://img.shields.io/badge/CoinGecko%20API-1C8B56?style=for-the-badge&logo=coingecko&logoColor=white)
