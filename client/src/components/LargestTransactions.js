import React, { useState, useEffect } from "react";
import LoadingComponent from "./Loading";

const LargestTransactions = () => {
    const [trans, setTrans] = useState([]);

    async function getTrans() {
        const transaction = await fetch("http://localhost:5200/api/largestTransactions");
        const transactionJson = await transaction.json();
        setTrans(transactionJson); 

        transactionJson.forEach(tx => {
            if (tx.time) {
                const formattedTime = new Date(tx.time * 1000).toLocaleString();
                tx.formattedTime = formattedTime;
            }
        });
        setTrans(transactionJson);
    }

    useEffect(() => {
        getTrans(); 
    }, []);
  
    if (!trans || trans.length === 0) {
        return <LoadingComponent/>
    }

    return (
        <div>
            <div className="block-details-container">
                <h2>Top-Fee Transactions</h2>
                {trans && trans.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Tx ID</th>
                                    <th>Fee</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trans.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>#{index}</td>
                                        <td>{transaction.txid}</td>
                                        <td>{transaction.fee} BTC</td>
                                        <td>{transaction.formattedTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p>No transactions.</p>
                )}
            </div>
        </div>
    );
}

export default LargestTransactions;
