import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import LoadingComponent from './Loading';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function BlockTime() {
  const [timeDifferences, setTimeDifferences] = useState([]);
  const [blockHeights, setBlockHeights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlockStats = async () => {
      try {
        const response = await fetch("http://localhost:5200/api/blockStats");
        if (!response.ok) {
          throw new Error('error');
        }
        const data = await response.json();
        setTimeDifferences(data.timeDifferences);
        setBlockHeights(data.blockHeights);
        setLoading(false);
      } catch (error) {
        console.error("error:", error);
      }
    };

    fetchBlockStats();
  }, []);

  const data = {
    labels: blockHeights, 
    datasets: [
      {
        label: 'difference',
        data: [0, ...timeDifferences], 
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
  
  if (loading) {
    return <LoadingComponent/>
  }
  

  return (
    <div className="App">
      <h3>Difference in seconds between blocks</h3>
        <Line data={data} />
    </div>
  );
}

export default BlockTime;
