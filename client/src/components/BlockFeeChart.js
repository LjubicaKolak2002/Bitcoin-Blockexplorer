import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import LoadingComponent from './Loading';

const FeeChart = () => {
  const [blockData, setBlockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5200/api/totalAndAvgFee');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setBlockData(data.blocksData); 
        setLoading(false);
      }
      catch (error) {
        console.error('Error fetching fees:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: blockData.map((block) => `${block.height}`),  
    datasets: [
      {
        label: 'Total Fee',
        data: blockData.map((block) => block.totalFee),  
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Avg Fee',
        data: blockData.map((block) => block.avgFee),  
        fill: false,
        borderColor: 'rgb(255, 99, 132)',  
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          min: 0,  
        },
      },
    },
  };

  if (loading) {
    return <LoadingComponent/>
  }

  return (
    <div>
      <h3>Fees in the last 10 blocks</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default FeeChart;
