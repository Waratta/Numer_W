import { useState } from "react";
import Plot from "react-plotly.js";

function secant() {
  const [func, setFunc] = useState("x*x - 7"); 
  const [x0, setX0] = useState(2);
  const [x1, setX1] = useState(3);
  const [tol, setTol] = useState(0.000001);
  const [iterations, setIterations] = useState([]);
  const [finalX, setFinalX] = useState(null);
  const [plotData, setPlotData] = useState({ x: [], y: [] });
  const [xPoints, setXPoints] = useState([]);

  const calculate = () => {
    let f;
    try {
      f = new Function("x", `return ${func}`);
    } catch {
      alert("Function invalid!");
      return;
    }

    let x0Val = x0;
    let x1Val = x1;
    let x2Val;
    let error = 1;
    let i = 0;
    const results = [];
    const points = [];

    while (error >= tol) {
      i++;
      x2Val = x1Val - (f(x1Val) * (x0Val - x1Val)) / (f(x0Val) - f(x1Val));
      error = Math.abs((x2Val - x1Val) / x2Val);

      results.push({
        iter: i,
        x0: x0Val,
        x1: x1Val,
        x2: x2Val,
        error,
      });

      points.push(x2Val);

      x0Val = x1Val;
      x1Val = x2Val;

      if (i > 1000) break; 
    }

    // Graph data
    const xVals = [];
    const yVals = [];
    const minX = Math.min(...points, x0, x1) - 1;
    const maxX = Math.max(...points, x0, x1) + 1;
    const step = (maxX - minX) / 200;

    for (let x = minX; x <= maxX; x += step) {
      xVals.push(x);
      yVals.push(f(x));
    }

    setIterations(results);
    setFinalX(x2Val);
    setPlotData({ x: xVals, y: yVals });
    setXPoints(points);
  };

  return (
    <>
      <h1>Secant Method</h1>
      <div>
        <label>
          Function f(x):
          <input value={func} onChange={(e) => setFunc(e.target.value)} />
        </label>
        <label>
          x0:
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(Number(e.target.value))}
          />
        </label>
        <label>
          x1:
          <input
            type="number"
            value={x1}
            onChange={(e) => setX1(Number(e.target.value))}
          />
        </label>
        <label>
          Tolerance:
          <input
            type="number"
            value={tol}
            onChange={(e) => setTol(Number(e.target.value))}
          />
        </label>
        <button onClick={calculate}>Calculate</button>
      </div>

      {plotData.x.length > 0 && (
        <Plot
          data={[
            {
              x: plotData.x,
              y: plotData.y,
              type: "scatter",
              mode: "lines",
              name: "f(x)",
            },
            {
              x: xPoints,
              y: xPoints.map(() => 0),
              mode: "markers+lines",
              marker: { color: "red", size: 8 },
              line: { dash: "dot", color: "red" },
              name: "Iterations",
            },
            {
              x: [finalX],
              y: [0],
              mode: "markers",
              marker: { color: "green", size: 12, symbol: "star" },
              name: "Final Root",
            },
          ]}
          layout={{
            title: "Secant Method - Graph of f(x)",
            xaxis: { title: "x" },
            yaxis: { title: "f(x)" },
          }}
          style={{ width: "100%", height: "500px" }}
        />
      )}

      {iterations.length > 0 && (
        <div>
          <h2>Iterations:</h2>
          <table>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>x0</th>
                <th>x1</th>
                <th>x2</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {iterations.map((row) => (
                <tr key={row.iter}>
                  <td>{row.iter}</td>
                  <td>{row.x0.toFixed(6)}</td>
                  <td>{row.x1.toFixed(6)}</td>
                  <td>{row.x2.toFixed(6)}</td>
                  <td>{row.error.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {finalX != null && <h2>Final Root = {finalX.toFixed(6)}</h2>}
    </>
  );
}

export default secant;