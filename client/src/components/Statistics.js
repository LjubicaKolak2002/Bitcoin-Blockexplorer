import React from "react";
import {Link} from "react-router-dom";
import BlockTime from "./BlockTimeComparison";
import BlockFeesChart from "./BlockFeeChart";
import './Statistics.css'
const Statistics = () => {
    return (
      <>
        <div className="container">
        <div className="block-time-container">
          <BlockTime />
        </div>
        <div className="block-fee-container">
          <BlockFeesChart />
        </div>
        </div>
          <p className="text">If you want to further compare blocks go to <Link to ="/compareBlocks" style={{color: "rgb(77, 77, 244)"}}>Compare Blocks.</Link></p>  
        </>
    );
};
  

export default Statistics;
