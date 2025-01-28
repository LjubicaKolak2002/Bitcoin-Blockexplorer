import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import './style.css';
import './BlockDetails.css';
import Search from "./Search";
import LoadingComponent from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const BlockByHeight = () => {
    const { blockHeight } = useParams(); 
    const [info, setInfo] = useState("");   
    const [time, setTime] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 20; 
    const [copiedBlock, setCopiedBlock] = useState("");
    const [copiedTx, setCopiedTx] = useState(""); 
    const [lastBlock, setLastBlock] = useState("");
    const navigate = useNavigate(); 

    async function getBlockByHeight() {
        const block = await fetch(`http://localhost:5200/api/blockInfoWithStatsByHeight/${blockHeight}`);
        const blockJson = await block.json();
        const blockResult = await blockJson;
        setInfo(blockResult);
  
        if (blockJson.blockData.time) {
            const formatedTime = new Date(blockJson.blockData.time * 1000).toLocaleString();
            setTime(formatedTime);
        }
    }

    async function getLastBlock() {
        const block = await fetch("http://localhost:5200/api/lastBlock");
        const blockJson = await block.json();
        const blockResult = await blockJson;
        setLastBlock(blockResult.height);
    }
  
    useEffect(() => {
        if (blockHeight) {
            getBlockByHeight();
            getLastBlock();
        }
    }, [blockHeight]);
    
    if (!info) {
        return <LoadingComponent />;
    }

    const handleCopy = (id, type) => {
        navigator.clipboard.writeText(id).then(() => {
            if (type === "block") {
                setCopiedBlock(id);
                setTimeout(() => setCopiedBlock(null), 2000);
            } else if (type === "tx") {
                setCopiedTx(id);
                setTimeout(() => setCopiedTx(null), 2000);
            }
        }).catch((err) => {
            console.error("Failed to copy text: ", err);
        });
    };

    const handlePreviousBlock = () => {
        navigate(`/blockByHeight/${parseInt(blockHeight) - 1}`);
    };

    const handleNextBlock = () => {
        navigate(`/blockByHeight/${parseInt(blockHeight) + 1}`);
    };
      
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = info.blockData.tx.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(info.blockData.tx.length / transactionsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
  
    return (
        <>
        <Search />
        <div className="block-details-container">
            <div
                style={{
                    display: "flex",
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: "20px", 
                    position: "relative",
                }}
            >
                {info.blockData.height >= 1 && (
                    <FontAwesomeIcon 
                        icon={faArrowLeft} 
                        onClick={handlePreviousBlock} 
                        title="Previous block"
                        style={{
                            fontSize: "1.2rem",
                            color: "#5191a8",
                            cursor: "pointer",
                        }}
                    />
                )}
                <h2 className="block-details-title">Block details</h2>
                {info.blockData.height < lastBlock && (
                    <FontAwesomeIcon 
                        icon={faArrowRight} 
                        onClick={handleNextBlock} 
                        title="Next block"
                        style={{
                            fontSize: "1.2rem",
                            color: "#5191a8",
                            cursor: "pointer",
                        }}
                    />
                )}
            </div>

            <table className="table">
                <tbody>
                    <tr>
                        <th scope="row">Hash</th>
                        <td>
                            {info.blockData.hash}
                            <FontAwesomeIcon 
                                icon={faCopy}
                                onClick={() => handleCopy(info.blockData.hash, "block")}
                                style={{
                                    display: "inline-flex",
                                    cursor: "pointer", 
                                    color: "#5191a8", 
                                    marginLeft: "20px",
                                }}
                                title="Copy to clipboard"
                            />
                            {copiedBlock === info.blockData.hash && (
                                <span style={{ color: "grey", fontSize: "12px", marginLeft: "5px" }}>Copied</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Height</th>
                        <td className="block-height">{info.blockData.height}</td>
                    </tr>
                    <tr>
                        <th scope="row">Size</th>
                        <td>{info.blockData.size} B</td>
                    </tr>
                    <tr>
                        <th scope="row">Received time</th>
                        <td>{time}</td>
                    </tr>
                    <tr>
                        <th scope="row">Merkle root</th>
                        <td>{info.blockData.merkleroot}</td>
                    </tr>
                    <tr>
                        <th scope="row">Confirmations</th>
                        <td>{info.blockData.confirmations}</td>
                    </tr>
                    <tr>
                        <th scope="row">Number of transactions</th>
                        <td>{info.blockStats.txs}</td>
                    </tr>
                    <tr>
                        <th scope="row">Total fee</th>
                        <td>{info.blockStats.totalfee}</td>
                    </tr>
                    <tr>
                        <th scope="row">Reward</th>
                        <td>{info.reward} BTC</td>
                    </tr>
                    <tr>
                        <th scope="row">Difficulty</th>
                        <td>{info.blockData.difficulty}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div className="block-details-container">
            <h2>Block transactions</h2>
            {currentTransactions && currentTransactions.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Transaction</th>
                                <th></th> {/* copy icon */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((tx, index) => (
                                <tr key={index}>
                                    <td>#{indexOfFirstTransaction + index + 1}</td>
                                    <td>
                                        {indexOfFirstTransaction + index === 0 ? (
                                            <>
                                                <Link to={`/transactionDetails/${tx}`} style={{ textDecoration: 'none', color: '#5191a8' }}>
                                                    {tx}
                                                </Link>
                                                <span> (coinbase)</span>
                                            </>
                                        ) : (
                                            <Link to={`/transactionDetails/${tx}`} style={{ textDecoration: 'none', color: '#5191a8' }}>
                                                {tx}
                                            </Link>
                                        )}
                                    </td>
                                    <td>
                                        <FontAwesomeIcon 
                                            icon={faCopy}
                                            onClick={() => handleCopy(tx, "tx")} 
                                            style={{
                                                cursor: "pointer", 
                                                color: "#5191a8", 
                                                marginLeft: "10px",
                                            }}
                                            title="Copy to clipboard"
                                        />
                                        {copiedTx === tx && (
                                            <span style={{ color: "grey", fontSize: "12px", marginLeft: "5px" }}>Copied</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                        <span> Page {currentPage} of {totalPages} </span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </>
            ) : (
                <p>No transactions in this block.</p>
            )}
        </div>
    </>
    );
};

export default BlockByHeight;
