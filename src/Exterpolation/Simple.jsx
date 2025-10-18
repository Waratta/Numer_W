import { useState } from "react";
import Plot from "react-plotly.js";

function LinearRegression() {
  const[numPoints,setNumPoints] = useState(3);
  const [xValues, setXValues] = useState(Array(3).fill(0));
  const [yValues, setYValues] = useState(Array(3).fill(0));
  const [slope, setSlope] = useState(null);
  const [intercept, setIntercept] = useState(null);
 
  const handleNumPointsChange = (e) => {
    const n = Number(e.target.value);
    setNumPoints(n);
    setXValues(Array(n).fill(0));
    setYValues(Array(n).fill(0));
  };
  const handleXChange = (index, value) => {
    const newX = [...xValues];
    newX[index] = Number(value);
    setXValues(newX);
  };

  const handleYChange = (index, value) => {
    const newY = [...yValues];
    newY[index] = Number(value);
    setYValues(newY);
  };

  const handleCalculate = () => {
    if (xValues.length !== yValues.length || xValues.length < 2) {
      alert("Error");
      return;
    }

    const n = xValues.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((a, b, i) => a + b * yValues[i], 0);
    const sumX2 = xValues.reduce((a, b) => a + b * b, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    setSlope(m);
    setIntercept(b);
  };

  const generateLine = () => {
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const lineX = [minX, maxX];
    const lineY = lineX.map((xi) => slope * xi + intercept);
    return { lineX, lineY };
  };

  const { lineX, lineY } = slope !== null ? generateLine() : { lineX: [], lineY: [] };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>Linear Regression</h1>

      <div style={{ marginBottom: "15px" }}>
        <label>N : </label>
        <input
          type="number"
          min="2"
          value={numPoints}
          onChange={handleNumPointsChange}
          style={{ width: "60px", marginLeft: "5px" }}
        />
      </div>

      <div>
        <h4>กรองค่า X และ Y</h4>
        {xValues.map((_, i) => (
          <div key={i} style={{ marginBottom: "5px" }}>
            <label>X{i + 1}: </label>
            <input
              type="number"
              value={xValues[i]}
              onChange={(e) => handleXChange(i, e.target.value)}
              style={{ width: "80px", marginRight: "10px" }}
            />
            <label>Y{i + 1}: </label>
            <input
              type="number"
              value={yValues[i]}
              onChange={(e) => handleYChange(i, e.target.value)}
              style={{ width: "80px" }}
            />
          </div>
        ))}
      </div>

      <button onClick = {handleCalculate} > Calculate </button>

      {slope !== null && (
        <div style={{ marginTop: "20px" }}>
          <p>
            f(x): <b> = {slope.toFixed(6)}x + {intercept.toFixed(6)}</b>
          </p>

          <Plot
            data={[
              {
                x: xValues,
                y: yValues,
                mode: "markers",
                name: "ข้อมูลจริง",
                marker: { color: "blue", size: 8 },
              },
              {
                x: lineX,
                y: lineY,
                mode: "lines",
                name: "เส้นประมาณค่า",
                line: { color: "orange" },
              },
            ]}
            layout={{
              width: 700,
              height: 500,
              title: "Linear Regression",
              xaxis: { title: "X" },
              yaxis: { title: "Y" },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default LinearRegression;