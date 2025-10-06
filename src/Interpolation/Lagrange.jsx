import { useState } from "react";
import Plot from "react-plotly.js";

function Lagrange() {
  const [xi] = useState([0, 80000]);
  const [yi] = useState([9.81, 9.5682]);
  const [xs, setXs] = useState(42235);
  const [yCalc, setYCalc] = useState(null);
  const [error, setError] = useState(null);

  // ฟังก์ชัน la(i, j, n, x, xi)
  const la = (i, j, n, x, xi) => {
    if (j === n) return 1.0;
    if (j === i) return la(i, j + 1, n, x, xi);
    return ((x - xi[j]) / (xi[i] - xi[j])) * la(i, j + 1, n, x, xi);
  };

  // ฟังก์ชัน la_r(x, xi, yi, n, i)
  const la_r = (x, xi, yi, n, i) => {
    if (i === n) return 0.0;
    return yi[i] * la(i, 0, n, x, xi) + la_r(x, xi, yi, n, i + 1);
  };

  // คำนวณค่า f(xs)
  const calculate = () => {
    const y2 = la_r(xs, xi, yi, 2, 0);
    const yTrue = 9.6879;
    const absErr = Math.abs((y2 - yTrue) / y2);
    setYCalc(y2);
    setError(absErr);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Lagrange Interpolation (Linear)</h1>
      <p>
        Using data points: (0, 9.81), (80000, 9.5682)
      </p>

      <div style={{ marginBottom: 10 }}>
        <label>Enter x value (xs): </label>
        <input
          type="number"
          value={xs}
          onChange={(e) => setXs(parseFloat(e.target.value))}
          step="1000"
        />
        <button onClick={calculate} style={{ marginLeft: 10 }}>
          Calculate
        </button>
      </div>

      {yCalc !== null && (
        <>
          <h3>f({xs}) = {yCalc.toFixed(6)}</h3>
          <h3>Error = {error.toExponential(6)}</h3>
        </>
      )}

      <Plot
        data={[
          {
            x: xi,
            y: yi,
            mode: "lines+markers",
            name: "Data Points",
            marker: { color: "blue", size: 8 },
          },
          yCalc !== null && {
            x: [xs],
            y: [yCalc],
            mode: "markers",
            name: `f(${xs}) = ${yCalc.toFixed(6)}`,
            marker: { color: "red", size: 12, symbol: "circle" },
          },
        ].filter(Boolean)}
        layout={{
          title: "Lagrange Interpolation (Linear) Graph",
          xaxis: { title: "x" },
          yaxis: { title: "f(x)" },
          width: 700,
          height: 450,
        }}
      />
    </div>
  );
}

export default Lagrange;
