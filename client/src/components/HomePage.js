import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BitcoinPriceChart from "./BitcoinPriceChart";
import './HomePage.css';
import Search from "./Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [mempool, setMempool] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [info, setInfo] = useState("")
  const [txNum, setTxNum] = useState("")
  //paginacija
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10); 
  const [copiedTx, setCopiedTx] = useState("");


  async function getBlocks() {
    const blocks = await fetch("http://localhost:5200/api/last10blocks");
    const blocksJson = await blocks.json();
    setBlocks(blocksJson.blocksData);
  }

  async function getMempool() {
    const mempool = await fetch("http://localhost:5200/api/mempoolTransaction");
    const mempoolJson = await mempool.json();
    setMempool(mempoolJson);
  }

  async function getDifficulty() {
    const difficulty = await fetch("http://localhost:5200/api/getDifficulty");
    const diffJson = await difficulty.json();
    setDifficulty(diffJson.difficulty);
  }

  async function getInfo() {
    const info = await fetch("http://localhost:5200/api/getBlockchainInfo");
    const infoJson = await info.json();
    setInfo(infoJson);
  }

  async function getTxNum() {
    const txNum = await fetch("http://localhost:5200/api/transactionNum");
    const txNumJson = await txNum.json();
    setTxNum(txNumJson);
  }

  useEffect(() => {
    getDifficulty();
    getTxNum();
    getInfo();
    getBlocks();
    getMempool();
  }, []);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedTx(id); 
      setTimeout(() => setCopiedTx(null), 2000); 
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };
  
  

  //paginacija
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = mempool.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(mempool.length / transactionsPerPage);

  return (
    <>
       <Search />

        <div className="chart">
          <BitcoinPriceChart />
          <div className="homeInfo">
            <div className="info-item">
                <strong className="infoTitle">CHAIN</strong>
                <div className="value">{info.chain}</div>
              </div>
              <div className="info-item">
                <strong className="infoTitle">DIFFICULTY</strong>
                <div className="value">{difficulty}</div>
              </div>
              <div className="info-item">
                <strong className="infoTitle">Blocks number</strong>
                <div className="value">{info.blocks}</div>
              </div>
              <div className="info-item">
                <strong className="infoTitle">Transactions</strong>
                <div className="value">{txNum.txcount}</div>
              </div>
          </div>
        </div>

      <div className="layout">
        <div className="table-container">
          <h3>Last Blocks</h3>
          <table>
            <thead>
              <tr>
                <th>Height</th>
                <th>Transactions</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(blocks) && blocks.length > 0 ? (
                blocks.map((block, index) => (
                  <tr key={index}>
                  <td style={{ display: "flex" }}>
                      <Link to={`/blockDetails/${block.hash}`}>{block.height}</Link>
                    </td>
                    <td>{block.nTx}</td>
                    <td>{new Date(block.timestamp * 1000).toLocaleString()}</td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No blocks available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h3>Mempool Transactions  <Link to="/largestTransactions" style={{color: " #5191a8", fontSize: "12px" }}>View top10</Link></h3>
          <table>
            <thead>
              <tr>
                <th>Tx ID</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentTransactions) && currentTransactions.length > 0 ? (
                currentTransactions.map((tx, index) => (
                  <tr key={index}>
                  <td style={{ display: "flex"}}>
                    <Link to={`/transactionDetails/${tx}`} style={{ flex: 1 }}>
                      {tx}
                    </Link>
                    <FontAwesomeIcon
                      icon={faCopy}
                      onClick={() => handleCopy(tx)}
                      style={{ cursor: "pointer", color: "#5191a8" }}
                      title="Copy to clipboard"
                    />
                    {copiedTx === tx && (
                      <span style={{ color: "grey", fontSize: "12px", marginLeft: "5px" }}>Copied</span>
                    )}
                  </td>
                </tr>

                ))
              ) : (
                <tr>
                  <td>No transactions in the mempool.</td>
                </tr>
              )}
            </tbody>


          </table>
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            <span>{currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
