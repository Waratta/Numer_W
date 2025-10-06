import { useState } from "react";
import Plot from "react-plotly.js";
//ค่าแปลก กราฟแปลก
function OneP() {
  const [funco, setFuncO] = useState("0.5 * (x + x / 7)");
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

    let xO0 = xo0;
    let xO = xO0;
    let errorVal = 1;
    let iter = 0;
    let resultso = [];
    let pointso = [];

    while (errorVal > erroro) {
      iter++;
      xO = f(xO0);
      errorVal = Math.abs(xO - xO0);
      resultso.push({
        iter,
        xOld: xO0,
        xNew: xO,
        error: errorVal,
      });
      pointso.push(xO);
      xO0 = xO;

      if (iter > 1000) break; 
    }

    // Graph data
    let xVals = [];
    let yVals = [];
    let step = (Math.max(...pointso) - Math.min(...pointso)) / 200 || 0.01;
    for (let x = Math.min(...pointso) - 1; x <= Math.max(...pointso) + 1; x += step) {
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
      <h1>One-Point Iteration Methods</h1>
      <div className="input-section">
        <label>
          Function g(x):
          <input value={funco} onChange={(e) => setFuncO(e.target.value)} />
        </label>
        <label>
          Initial x0:
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
              x: xPointso,
              y: xPointso.map(() => 0),
              mode: "markers+lines",
              marker: { color: "red", size: 8 },
              line: { dash: "dot", color: "red" },
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
            title: "One-Point Iteration - Graph of g(x)",
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
                  <td>{row.error.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {xo != null && (
        <h2>
          Final Root = {xo.toFixed(6)} (Iterations: {iterationO})
        </h2>
      )}
    </>
  );
}

export default OneP;