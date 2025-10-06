import { useState } from "react";
import Plot from "react-plotly.js";

function Spline() {
  // ข้อมูลเริ่มต้น
  const [x, setX] = useState([2, 4, 6, 8, 10]);
  const [y, setY] = useState([9.5, 8.0, 10.5, 39.5, 72.5]);
  const [xp, setXp] = useState(4.5);
  const [yp, setYp] = useState(null);

  // ฟังก์ชัน Linear Spline
  const linearSpline = (x, y, n, xp) => {
    for (let i = 0; i < n - 1; i++) {
      if (xp >= x[i] && xp <= x[i + 1]) {
        return y[i] + ((y[i + 1] - y[i]) * (xp - x[i])) / (x[i + 1] - x[i]);
      }
    }
    return null;
  };

  // คำนวณค่า f(xp)
  const handleCalculate = () => {
    const result = linearSpline(x, y, x.length, xp);
    setYp(result);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Linear Spline Interpolation</h1>
      <div style={{ marginBottom: 10 }}>
        <label>Enter x value (xp): </label>
        <input
          type="number"
          value={xp}
          step="0.1"
          onChange={(e) => setXp(parseFloat(e.target.value))}
        />
        <button onClick={handleCalculate} style={{ marginLeft: 10 }}>
          Calculate
        </button>
      </div>

      {yp !== null && (
        <h3>
          f({xp.toFixed(2)}) = {yp.toFixed(6)}
        </h3>
      )}

      <Plot
        data={[
          {
            x: x,
            y: y,
            mode: "lines+markers",
            name: "Data Points",
            line: { shape: "linear" },
            marker: { color: "blue", size: 8 },
          },
          yp !== null && {
            x: [xp],
            y: [yp],
            mode: "markers",
            name: `f(${xp}) = ${yp.toFixed(2)}`,
            marker: { color: "red", size: 12, symbol: "circle" },
          },
        ].filter(Boolean)}
        layout={{
          title: "Linear Spline Interpolation Graph",
          xaxis: { title: "x" },
          yaxis: { title: "f(x)" },
          width: 700,
          height: 450,
        }}
      />
    </div>
  );
}

export default Spline;
