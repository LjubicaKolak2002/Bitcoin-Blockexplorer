import React, { useState } from 'react';
import './CompareBlocks.css'


const CompareBlocks = () => {
    const [block1, setBlock1] = useState("");
    const [block2, setBlock2] = useState("");
    const [comparisonResult, setComparisonResult] = useState(null);
    const [error, setError] = useState(null);

    async function handleCompare() {
        setError(null); 
        setComparisonResult(null);
        if (!block1 || !block2) {
            setError('Please enter both block identifiers.');
            return;
        }
        const block = await fetch(`http://localhost:5200/api/compareBlocks/${block1}/${block2}`);
        const blockJson = await block.json();
        const blockResult = await blockJson;
        setComparisonResult(blockResult);
    };

    return (
        <div className="main-content">
        <div className="parent-container">
            <p className="compare-blocks-title">Enter either block hash or block height for each block.</p><br/>

            <div className="input-container2">
                <input
                    type="text"
                    placeholder="Enter first block hash or height"
                    value={block1}
                    onChange={(e) => setBlock1(e.target.value)}
                    style={{ marginRight: '1rem' }}
                />
                <input
                    type="text"
                    placeholder="Enter second block hash or height"
                    value={block2}
                    onChange={(e) => setBlock2(e.target.value)}
                />
            </div><br/>
            <button onClick={handleCompare} style={{ marginBottom: '1rem' }}>
                Compare Blocks
            </button>

            {error && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {comparisonResult && (
                <div className="table-container2">
                    <h3>Comparison Results</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Block 1</th>
                                <th>Block 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Hash</td>
                                <td>{comparisonResult.block1.hash}</td>
                                <td>{comparisonResult.block2.hash}</td>
                            </tr>
                            <tr>
                                <td>Height</td>
                                <td>{comparisonResult.block1.height}</td>
                                <td>{comparisonResult.block2.height}</td>
                            </tr>
                            <tr>
                                <td>Number of transactions</td>
                                <td>{comparisonResult.block1.tx.length}</td>
                                <td>{comparisonResult.block2.tx.length}</td>
                            </tr>
                            <tr>
                                <td>Total fees</td>
                                <td>{comparisonResult.block1.stats?.totalfee || 'N/A'}</td>
                                <td>{comparisonResult.block2.stats?.totalfee || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Average fee </td>
                                <td>{comparisonResult.block1.stats?.avgfee || 'N/A'}</td>
                                <td>{comparisonResult.block2.stats?.avgfee || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Time mined</td>
                                <td>{new Date(comparisonResult.block1.time * 1000).toLocaleString()}</td>
                                <td>{new Date(comparisonResult.block2.time * 1000).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>Size</td>
                                <td>{comparisonResult.block1.size} B</td>
                                <td>{comparisonResult.block2.size} B</td>
                            </tr>
                            <tr>
                                <td>Weight </td>
                                <td>{comparisonResult.block1.weight}</td>
                                <td>{comparisonResult.block2.weight}</td>
                            </tr>
                            <tr>
                                <td>Confirmations </td>
                                <td>{comparisonResult.block1.confirmations}</td>
                                <td>{comparisonResult.block2.confirmations}</td>
                            </tr>
                            <tr>
                                <td>Difficulty</td>
                                <td>{comparisonResult.block1.difficulty}</td>
                                <td>{comparisonResult.block2.difficulty}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </div>
    );
};

export default CompareBlocks;