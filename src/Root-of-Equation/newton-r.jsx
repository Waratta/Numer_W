import { useState } from "react";
import Plot from "react-plotly.js";
//กราฟแปลก
function newton() {
  const [func, setFunc] = useState("x - ((x*x)-7)/(2*x)"); 
  const [x0, setX0] = useState(2);
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

    let xVal = x0;
    let error = 1;
    let i = 0;
    const results = [];
    const points = [];

    while (error >= tol) {
      i++;
      const xNew = f(xVal);
      error = Math.abs((xNew - xVal) / xNew);
      results.push({
        iter: i,
        xOld: xVal,
        xNew,
        error,
      });
      points.push(xNew);
      xVal = xNew;

      if (i > 1000) break; 
    }

    const xVals = [];
    const yVals = [];
    const minX = Math.min(...points, x0) - 1;
    const maxX = Math.max(...points, x0) + 1;
    const step = (maxX - minX) / 200;

    for (let x = minX; x <= maxX; x += step) {
      xVals.push(x);
      yVals.push(f(x));
    }

    setIterations(results);
    setFinalX(xVal);
    setPlotData({ x: xVals, y: yVals });
    setXPoints(points);
  };

  return (
    <>
      <h1>Newton-Raphson Method</h1>
      <div>
        <label>
          Function f(x):
          <input value={func} onChange={(e) => setFunc(e.target.value)} />
        </label>
        <label>
          Initial x0:
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(Number(e.target.value))}
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
            title: "Newton-Raphson Method - Graph of f(x)",
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
                <th>xOld</th>
                <th>xNew</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {iterations.map((row) => (
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

      {finalX != null && <h2>Final Root = {finalX.toFixed(6)}</h2>}
    </>
  );
}

export default newton;
