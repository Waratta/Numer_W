import { useState } from "react";
import Plot from "react-plotly.js";

function LinearRegression() {
  const [xValues, setXValues] = useState("10,15,20,30,40,50,60,70,80");
  const [yValues, setYValues] = useState("5,9,15,18,22,30,35,38,43");
  const [Xpred, setXpred] = useState(65);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const x = xValues.split(",").map(Number);
    const y = yValues.split(",").map(Number);

    if (x.length !== y.length) {
      alert("จำนวนข้อมูลของ X และ Y ต้องเท่ากัน!");
      return;
    }

    const n = x.length;
    let sumx = 0,
      sumy = 0,
      sumxy = 0,
      sumx2 = 0;

    const table = [];

    for (let i = 0; i < n; i++) {
      const xi = x[i];
      const yi = y[i];
      const x2 = xi * xi;
      const xy = xi * yi;
      table.push({ xi, yi, x2, xy });

      sumx += xi;
      sumy += yi;
      sumxy += xy;
      sumx2 += x2;
    }

    const a1 = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
    const a0 = (sumy - a1 * sumx) / n;
    const Y = a0 + a1 * Xpred;

    const yLine = x.map((xi) => a0 + a1 * xi);

    setResult({
      table,
      sumx,
      sumy,
      sumx2,
      sumxy,
      a0,
      a1,
      Y,
      x,
      y,
      yLine,
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Simple Regression</h2>

      <label>
        ค่า X (คั่นด้วย ,):{" "}
        <input
          type="text"
          value={xValues}
          onChange={(e) => setXValues(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </label>

      <label>
        ค่า Y (คั่นด้วย ,):{" "}
        <input
          type="text"
          value={yValues}
          onChange={(e) => setYValues(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </label>

      <label>
       x value:{" "}
        <input
          type="number"
          value={Xpred}
          onChange={(e) => setXpred(Number(e.target.value))}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </label>

      <button onClick={calculate}>คำนวณ</button>

      {result && (
        <div style={{ marginTop: 30 }}>
          
          <div style={{ marginTop: 20 }}>
            <p>
             f(x) = {result.a0.toFixed(6)} +{" "}
              {result.a1.toFixed(6)}x
            </p>
            <p>
              f({Xpred}) = <strong>{result.Y.toFixed(6)}</strong>
            </p>
          </div>

          <Plot
            data={[
              {
                x: result.x,
                y: result.y,
                mode: "markers",
                name: "ข้อมูลจริง (x,y)",
                marker: { size: 8 },
              },
              {
                x: result.x,
                y: result.yLine,
                mode: "lines",
                name: "เส้น Regression",
                line: { dash: "solid" },
              },
              {
                x: [Xpred],
                y: [result.Y],
                mode: "markers+text",
                name: `จุดทำนาย f(${Xpred})`,
                marker: { color: "red", size: 10 },
                text: [`(${Xpred}, ${result.Y.toFixed(2)})`],
                textposition: "top center",
              },
            ]}
            layout={{
              title: "กราฟแสดงเส้นตรง Linear Regression",
              xaxis: { title: "X" },
              yaxis: { title: "Y" },
              height: 500,
            }}
          />
        </div>
      )}
    </div>
  );
}
export default LinearRegression;
