import { useState } from "react";
import Plot from "react-plotly.js";

function TrapzoidalComposite() {
  const [fx, setFx] = useState("x**7 + 2*x**3 - 1");
  const [a, setA] = useState(-1);
  const [b, setB] = useState(2);
  const [n, setN] = useState(4);
  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState({ x: [], y: [] });

  const f = (x) => {
    try {
      return eval(fx);
    } catch (e) {
      return NaN;
    }
  };

  const TrapzoidalComposite = (a, b, n) => {
    const h = (b - a) / n;
    let sum = f(a) + f(b);

    for (let i = 1; i < n; i++) {
      const xi = a + i * h;
       sum += 2 * f(xi);
    }
    return (h / 2) * sum;
  };

  const calculate = () => {
    const A = parseFloat(a);
    const B = parseFloat(b);
    const N = parseInt(n);

    const approx = TrapzoidalComposite(A, B, N);

    const xPoints = [];
    const yPoints = [];
    const step = (B - A) / 200;
    for (let x = A - 1; x <= B + 1; x += step) {
      xPoints.push(x);
      yPoints.push(f(x));
    }

    setGraphData({ x: xPoints, y: yPoints });
    setResult({ approx });
  };
   return (
      <div>
        <h1>Trapezoidal Composite Rule</h1>
        <div style={{ marginBottom: "10px" }}>
          <label>f(x): </label>
          <input
            value={fx}
            onChange={(e) => setFx(e.target.value)}
            style={{ width: "220px", margin: "5px" }}
          />
        </div>
  
        <div style={{ marginBottom: "10px" }}>
          <label>a: </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            style={{ width: "80px", margin: "5px" }}
          />
  
          <label>b: </label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            style={{ width: "80px", margin: "5px" }}
          />
  
          <label>n: </label>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            style={{ width: "80px", margin: "5px" }}
          />
        </div>
        <button onClick={calculate}>calculate</button>
  
        {result && (
          <>
            <div style={{ marginTop: "25px" }}>
              <table
                style={{
                  margin: "0 auto",
                  borderCollapse: "collapse",
                  width: "60%",
                }}
              >
                <thead>
                    <th style={{marginTop: "20px"}}>Approximation</th>
                </thead>
                <tbody>
                  <tr>
                    <td style={{marginTop: "20px"}}>{result.approx.toFixed(6)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <div style={{ marginTop: "30px" }}>
              <Plot
                data={[
                  {
                    x: graphData.x,
                    y: graphData.y,
                    type: "scatter",
                    mode: "lines",
                    name: "f(x)",
                  },
                  {
                    x: graphData.x.filter((x) => x >= parseFloat(a) && x <= parseFloat(b)),
                    y: graphData.y.filter((_, i) => {
                      const x = graphData.x[i];
                      return x >= parseFloat(a) && x <= parseFloat(b);
                    }),
                    fill: "tozeroy",
                    type: "scatter",
                    mode: "none",
                    name: "Area under curve",
                    fillcolor: "rgba(0,123,255,0.2)",
                  },
                ]}
                layout={{
                  title: "Graph of f(x) and Integrated Area",
                  xaxis: { title: "x" },
                  yaxis: { title: "f(x)" },
                  width: 800,
                  height: 500,
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  }

export default TrapzoidalComposite;