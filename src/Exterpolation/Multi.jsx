import { useState } from "react";
import Plot from "react-plotly.js";
//ค่าไม่ขึ้น
function Multi() {
  const [dataX] = useState([
    [1, 1, 0, 1],
    [1, 0, 1, 3],
    [1, 2, 4, 1],
    [1, 3, 2, 2],
    [1, 4, 1, 5],
    [1, 2, 3, 3],
    [1, 1, 6, 4],
  ]);

  const [dataY] = useState([4, -5, -6, 0, -1, -7, -20]);
  const [coeff, setCoeff] = useState(null);

  // Gaussian Elimination
  const gaussElimination = (A, B) => {
    const n = A.length;
    const X = new Array(n).fill(0);
    const M = A.map((r) => [...r]);
    const Y = [...B];

    for (let i = 0; i < n; i++) {
      // Pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      [Y[i], Y[maxRow]] = [Y[maxRow], Y[i]];

      // Elimination
      for (let k = i + 1; k < n; k++) {
        const factor = M[k][i] / M[i][i];
        for (let j = i; j < n; j++) M[k][j] -= factor * M[i][j];
        Y[k] -= factor * Y[i];
      }
    }

    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
      X[i] = Y[i];
      for (let j = i + 1; j < n; j++) X[i] -= M[i][j] * X[j];
      X[i] /= M[i][i];
    }

    return X;
  };

  const calculate = () => {
    const N = dataX.length;
    const P = dataX[0].length;
    const XT = Array.from({ length: P }, () => Array(P).fill(0));
    const XTY = new Array(P).fill(0);

    // Compute XT * X
    for (let i = 0; i < P; i++) {
      for (let j = 0; j < P; j++) {
        for (let k = 0; k < N; k++) {
          XT[i][j] += dataX[k][i] * dataX[k][j];
        }
      }
    }

    // Compute XT * Y
    for (let i = 0; i < P; i++) {
      for (let k = 0; k < N; k++) {
        XTY[i] += dataX[k][i] * dataY[k];
      }
    }

    const coeffs = gaussElimination(XT, XTY);
    setCoeff(coeffs);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Multiple Linear Regression</h1>
      <button onClick={calculate}>Calculate</button>

      {coeff && (
        <div style={{ marginTop: 20 }}>
          <h2>Regression Equation</h2>
          <p>
            f(x1, x2, x3) = {coeff[0].toFixed(4)} + {coeff[1].toFixed(4)}·x1 +{" "}
            {coeff[2].toFixed(4)}·x2 + {coeff[3].toFixed(4)}·x3
          </p>
        </div>
      )}

      {coeff && (
        <Plot
          data={[
            {
              x: dataX.map((d) => d[1]),
              y: dataX.map((d) => d[2]),
              z: dataY,
              mode: "markers",
              type: "scatter3d",
              marker: { color: "blue", size: 5 },
              name: "Data Points",
            },
            {
              type: "surface",
              x: Array.from({ length: 10 }, (_, i) => i),
              y: Array.from({ length: 10 }, (_, i) => i),
              z: Array.from({ length: 10 }, (_, i) =>
                Array.from({ length: 10 }, (_, j) => {
                  const x1 = i;
                  const x2 = j;
                  const x3 = (x1 + x2) / 2;
                  return (
                    coeff[0] +
                    coeff[1] * x1 +
                    coeff[2] * x2 +
                    coeff[3] * x3
                  );
                })
              ),
              opacity: 0.6,
              colorscale: "Viridis",
              name: "Regression Plane",
            },
          ]}
          layout={{
            title: "3D Multiple Regression Visualization",
            scene: {
              xaxis: { title: "x1" },
              yaxis: { title: "x2" },
              zaxis: { title: "f(x)" },
            },
            width: 700,
            height: 600,
          }}
        />
      )}
    </div>
  );
}

export default Multi;
