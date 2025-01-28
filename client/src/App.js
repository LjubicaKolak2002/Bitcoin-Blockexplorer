import React from "react";
import {BrowserRouter as Router,Routes,Route
} from "react-router-dom";
import BlockDetails from "./components/BlockDetails";
import BlockByHeight from "./components/BlockByHeight";
import TransactionDetails from "./components/TransactionDetails";
import HomePage from "./components/HomePage";
import BitcoinPriceChart from "./components/BitcoinPriceChart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LargestTransactions from "./components/LargestTransactions";
import Statistics from "./components/Statistics";
import CompareBlocks from "./components/CompareBlocks";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/blockDetails/:blockHash" element={<BlockDetails />} />
            <Route path="/blockByHeight/:blockHeight" element={<BlockByHeight />} />
            <Route path="/transactionDetails/:txid" element={<TransactionDetails />} />
            <Route path="/chart" element={<BitcoinPriceChart/>}/>
            <Route path="/largestTransactions" element={<LargestTransactions/>}/>
            <Route path="/statistics" element={<Statistics/>}/>
            <Route path="/compareBlocks" element={<CompareBlocks/>}/>
          </Routes>
          <Footer/>
        </Router>
   
      </header>
    </div>
  );
}

export default App;