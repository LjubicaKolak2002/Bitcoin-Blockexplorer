import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import './TransactionDetails.css';
import Search from "./Search";
import LoadingComponent from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons"; 

const TransactionDetails = () => {
  const { txid } = useParams();
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [block, setBlock] = useState("");
  const [time, setTime] = useState("");
  const [copiedTx, setCopiedTx] = useState("");
  const [coinbaseOpen, setCoinbaseOpen] = useState(false); 


  async function getTransactionById() {
    try {
      const transaction = await fetch(`http://localhost:5200/api/rawtransaction/${txid}`);
      const transactionJson = await transaction.json();
      setInfo(transactionJson);

      if (transactionJson.time) {
        const formatedTime = new Date(transactionJson.time * 1000).toLocaleString();
        setTime(formatedTime);
      }

      if (transactionJson.blockHeight) {
        setBlock(transactionJson.blockHeight);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (txid) {
      getTransactionById();
    }
  }, [txid]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedTx(id);
      setTimeout(() => setCopiedTx(null), 2000);
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  const toggleCoinbase = () => {
    setCoinbaseOpen(prevState => !prevState);
  };

  if (loading) return <LoadingComponent />;

  return (
    <>
      <Search />
      <div className="transaction-details-container">
        <h2>Transaction details</h2>
          <table className="table">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                  <td className="txId">
                    {info.txid}
                    <FontAwesomeIcon
                      icon={faCopy}
                      onClick={() => handleCopy(info.txid)}
                      style={{
                      display: "inline-flex",
                      cursor: "pointer", 
                      color: "#5191a8", 
                      marginLeft: "20px", 
                    }}
                    title="Copy to clipboard"
                  />
                  {copiedTx === info.txid && (
                    <span style={{ color: "grey", fontSize: "12px", marginLeft: "5px" }}>Copied</span>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">Size</th>
                <td>{info.size} B</td>
              </tr>
              <tr>
                <th scope="row">Confirmations</th>
                <td>{info?.confirmations || "No confirmations"}</td>
              </tr>
              <tr>
                <th scope="row">Virtual size</th>
                <td>{info.vsize} vB</td>
              </tr>
              <tr>
                <th scope="row">Weight</th>
                <td>{info.weight}</td>
              </tr>
              <tr>
                <th scope="row">Fee</th>
                <td>{info?.fee} BTC</td>
              </tr>
              <tr>
                <th scope="row">Date/Time</th>
                <td>{time || "Not included in block"}</td>
              </tr>
              <tr>
                <th scope="row">Included in block</th>
                <td>{info?.blockhash || "Not included in block"}</td>
              </tr>
              <tr>
                <th scope="row">Block height</th>
                <td>{block || "Not included in block"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="transaction-entries">
          <div className="entry left">
            <h3>FROM</h3>
            {info && info.inputs && info.inputs.length > 0 ? (
              <ul>
                {info.inputs.map((input, index) => (
                  <li key={index}>
                    <div className="index"><strong>#</strong> {index}</div>
                      {input.coinbase ? (
                      <div>
                        <p><strong>Coinbase</strong>
                          <FontAwesomeIcon
                            icon={coinbaseOpen ? faCaretUp : faCaretDown}
                            onClick={toggleCoinbase}
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                            title={coinbaseOpen ? "Hide Coinbase" : "Show Coinbase"}
                          />
                        </p>

                        {coinbaseOpen && (
                          <div className="coinbase-details">
                            <p className="coinbase">
                              <span className="coinbase-label">Coinbase: </span>
                              <span className="coinbase-value">{input.coinbase.coinbase}</span>
                            </p>
                            <p className="witness">
                              <span className="witness-label">Witness: </span>
                              <span className="witness-value">{input.coinbase.txinwitness}</span>
                            </p>
                            <p className="sequence">
                              <span className="sequence-label">Sequence:</span>
                              <span className="sequence-value">{`0x${input.coinbase.sequence.toString(16)}`}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="address-value-container">
                        <p className="address">{input.address ? input.address : "Unknown"}</p>
                        <p className="value">{input.value || 0} BTC</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              ) : (
              <p className="no-data">Ova transakcija nema ulaza.</p>
            )}
            {info && info.totalInputValue !== undefined && (
              <div>
                <p className="total-value"><strong>Total:</strong> {info.totalInputValue.toFixed(8)} BTC</p>
              </div>
            )}
          </div>

          <div className="entry right">
            <h3>TO</h3>
            {info && info.outputs && info.outputs.length > 0 ? (
              <ul>
                {info.outputs.map((output, index) => (
                  <li key={index}>
                    <p className="index"><strong>#</strong> {index}</p>
                    <p className="address">
                      {output.value === 0 ? "OP_RETURN" : output.address}
                    </p>
                    <p className="value">{output.value} BTC</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">Ova transakcija nema izlaza.</p>
            )}
            {info && info.totalOutputValue !== undefined && (
              <div>
                <p className="total-value"><strong>Total:</strong> {info.totalOutputValue.toFixed(8)} BTC</p>
              </div>
            )}
          </div>
        </div>
    </>
  );
};

export default TransactionDetails;
