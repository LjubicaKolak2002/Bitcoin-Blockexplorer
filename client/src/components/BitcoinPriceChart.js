import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const BitcoinPriceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:5200/api/bitcoinPrice24h");
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  const filteredData = data.filter((item, index) => index % 5 === 0);

  const chartData = {
    labels: filteredData.map(item => item.time), 
    datasets: [
      {
        label: 'Bitcoin Price (USD) in Last 24 Hours',
        data: filteredData.map(item => item.price),
        borderColor: '#506bf2',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ width: '50%', maxWidth: '600px' }}>
      <Line data={chartData} />
    </div>
  );
};

export default BitcoinPriceChart;
