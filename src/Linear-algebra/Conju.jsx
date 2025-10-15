import { useState } from "react";
import Plot from "react-plotly.js";

function Conju() {
  const [n, setN] = useState(4);
  const [A, setA] = useState(
    Array(4).fill(0).map(() => Array(4).fill(0))
  );
  const [b, setB] = useState(Array(4).fill(0));
  const [x0, setX0] = useState(Array(4).fill(0));
  const [eps, setEps] = useState(0.000001);
  const [iterations, setIterations] = useState([]);

  const handleSizeChange = (size) => {
    const newSize = parseInt(size);
    setN(newSize);
    setA(Array(newSize).fill(0).map(() => Array(newSize).fill(0)));
    setB(Array(newSize).fill(0));
    setX0(Array(newSize).fill(0));
    setIterations([]);
  };

  const handleAChange = (i, j, value) => {
    const newA = [...A];
    newA[i][j] = parseFloat(value) || 0;
    setA(newA);
  };

  const handleBChange = (i, value) => {
    const newB = [...b];
    newB[i] = parseFloat(value) || 0;
    setB(newB);
  };

  const handleX0Change = (i, value) => {
    const newX0 = [...x0];
    newX0[i] = parseFloat(value) || 0;
    setX0(newX0);
  };

  const calculate = () => {
    let x = [...x0];
    let r = b.map((bi, i) => bi - A[i].reduce((sum, aij, j) => sum + aij * x[j], 0));
    let p = [...r];
    let Ap = Array(n).fill(0);
    let rsold = r.reduce((sum, ri) => sum + ri * ri, 0);
    let results = [];

    for (let k = 0; k < 1000; k++) {
   
      for (let i = 0; i < n; i++) {
        Ap[i] = 0;
        for (let j = 0; j < n; j++) Ap[i] += A[i][j] * p[j];
      }

      const dot1 = p.reduce((sum, pi, i) => sum + pi * Ap[i], 0);
      const alpha = rsold / dot1;

      for (let i = 0; i < n; i++) x[i] += alpha * p[i];
      for (let i = 0; i < n; i++) r[i] -= alpha * Ap[i];

      const rsnew = r.reduce((sum, ri) => sum + ri * ri, 0);
      results.push({ iter: k + 1, x: [...x], norm: Math.sqrt(rsnew) });

      if (Math.sqrt(rsnew) < eps) break;

      const beta = rsnew / rsold;
      for (let i = 0; i < n; i++) p[i] = r[i] + beta * p[i];
      rsold = rsnew;
    }

    setIterations(results);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Conjugate Gradient Method</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <label>
          <b>Matrix Size (n×n):</b>{" "}
          <select
            value={n}
            onChange={(e) => handleSizeChange(e.target.value)}
          >
            {[2, 3, 4, 5, 6, 7, 8].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <label>
          <b>Tolerance:</b>{" "}
          <input
            type="number"
            step="any"
            value={eps}
            onChange={(e) => setEps(Number(e.target.value))}
            style={{ width: "100px" }}
          />
        </label>

       <button onClick={calculate}>Calculate</button>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3>Matrix A:</h3>
        <table
          border="1"
          cellPadding="5"
          style={{ margin: "0 auto", borderCollapse: "collapse" }}
        >
          <tbody>
            {A.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => handleAChange(i, j, e.target.value)}
                      style={{
                        width: "60px",
                        textAlign: "center",
                        border: "none",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Vector b:</h3>
        <div>
          {b.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={(e) => handleBChange(i, e.target.value)}
              style={{
                width: "60px",
                margin: "3px",
                textAlign: "center",
                border: "none",
              }}
            />
          ))}
        </div>

        <h3>Initial x (x₀):</h3>
        <div>
          {x0.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={(e) => handleX0Change(i, e.target.value)}
              style={{
                width: "60px",
                margin: "3px",
                textAlign: "center",
                border: "none",
              }}
            />
          ))}
        </div>
      </div>

      {iterations.length > 0 && (
        <>
          <h2 style={{ marginTop: "30px" }}>Iterations:</h2>
          <div style={{ overflowX: "auto" }}>
            <table
              border="1"
              cellPadding="5"
              style={{
                margin: "0 auto",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr style={{ background: "#e3e3e3" }}>
                  <th>Iteration</th>
                  {A.map((_, j) => (
                    <th key={j}>x{j + 1}</th>
                  ))}
                  <th>Residual Norm</th>
                </tr>
              </thead>
              <tbody>
                {iterations.map((row) => (
                  <tr key={row.iter}>
                    <td>{row.iter}</td>
                    {row.x.map((xi, j) => (
                      <td key={j}>{xi.toFixed(6)}</td>
                    ))}
                    <td>{row.norm.toExponential(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ marginTop: "30px" }}>Convergence Graph:</h2>
          <Plot
            data={A.map((_, j) => ({
              x: iterations.map((r) => r.iter),
              y: iterations.map((r) => r.x[j]),
              type: "scatter",
              mode: "lines+markers",
              name: `x${j + 1}`,
            }))}
            layout={{
              title: "Conjugate Gradient Convergence",
              xaxis: { title: "Iteration" },
              yaxis: { title: "x values" },
              width: 800,
              height: 500,
            }}
          />
        </>
      )}
    </div>
  );
}

export default Conju;
