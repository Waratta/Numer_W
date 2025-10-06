import { useState } from "react";
import Plot from "react-plotly.js";

function OneP() {
  const [funco, setFuncO] = useState("(x + 7 / x) * 0.5");
  const [xo0, setXO0] = useState(1);
  const [xo, setXO] = useState(null);
  const [erroro, setErrorO] = useState(0.000001);
  const [tolO, setTolO] = useState([]);
  const [iterationO, setIterationO] = useState(0);
  const [plotDataO, setPlotDataO] = useState({ x: [], y: [] });
  const [xPointso, setXPoints] = useState([]);

  const calculateO = () => {
    let f;
    try {
      f = new Function("x", `return ${funco}`);
    } catch {
      alert("Function invalid!!");
      return;
    }

    let xO0 = parseFloat(xo0);
    let xO;
    let errorVal = 1;
    let iter = 0;
    const tol = parseFloat(erroro);
    const resultso = [];
    const pointso = [xO0];

    while (errorVal >= tol && iter < 1000) {
      xO = f(xO0);
      errorVal = Math.abs((xO - xO0) / xO);
      iter++;

      resultso.push({
        iter,
        xOld: xO0,
        xNew: xO,
        error: errorVal,
      });

      pointso.push(xO);
      xO0 = xO;
    }


    const minX = Math.min(...pointso) - 1;
    const maxX = Math.max(...pointso) + 1;
    const step = (maxX - minX) / 200 || 0.01;
    const xVals = [];
    const yVals = [];

    for (let x = minX; x <= maxX; x += step) {
      xVals.push(x);
      yVals.push(f(x));
    }

    setXO(xO);
    setIterationO(iter);
    setTolO(resultso);
    setPlotDataO({ x: xVals, y: yVals });
    setXPoints(pointso);
  };

  return (
    <>
      <h1>One-Point Iteration Method</h1>

      <div className="input-section">
        <label>
          Function g(x):
          <input value={funco} onChange={(e) => setFuncO(e.target.value)} />
        </label>
        <label>
          Initial x₀:
          <input
            type="number"
            value={xo0}
            onChange={(e) => setXO0(Number(e.target.value))}
          />
        </label>
        <label>
          Tolerance:
          <input
            type="number"
            value={erroro}
            onChange={(e) => setErrorO(Number(e.target.value))}
          />
        </label>
        <button onClick={calculateO}>Calculate</button>
      </div>

      {plotDataO.x.length > 0 && (
        <Plot
          data={[
            {
              x: plotDataO.x,
              y: plotDataO.y,
              type: "scatter",
              mode: "lines",
              name: "g(x)",
            },
            {
              x: plotDataO.x,
              y: plotDataO.x,
              type: "scatter",
              mode: "lines",
              name: "y = x",
              line: { dash: "dot", color: "gray" },
            },
            {
              x: xPointso,
              y: xPointso.map(() => 0),
              mode: "markers+lines",
              marker: { color: "red", size: 8 },
              name: "x points",
            },
            {
              x: [xo],
              y: [0],
              mode: "markers",
              marker: { color: "green", size: 12, symbol: "star" },
              name: "Final Root",
            },
          ]}
          layout={{
            title: "Graph of g(x) and Iteration Points",
            xaxis: { title: "x" },
            yaxis: { title: "g(x)" },
          }}
          style={{ width: "100%", height: "500px" }}
        />
      )}

      {tolO.length > 0 && (
        <div className="tol-section">
          <h2>Iterations:</h2>
          <table>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>xOld</th>
                <th>xNew</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {tolO.map((row) => (
                <tr key={row.iter}>
                  <td>{row.iter}</td>
                  <td>{row.xOld.toFixed(6)}</td>
                  <td>{row.xNew.toFixed(6)}</td>
                  <td>{row.error.toFixed(8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {xo != null && (
        <h2>
          Final Root ≈ {xo.toFixed(6)} (Iterations: {iterationO})
        </h2>
      )}
    </>
  );
}

export default OneP;
