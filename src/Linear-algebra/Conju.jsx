import { useState } from "react";
import Plot from "react-plotly.js";

function Conju() {
  const [eps, setEps] = useState(1e-10);
  const [iterations, setIterations] = useState([]);

  const calculate = () => {
    const A = [
      [5,2,0,0],
      [2,5,2,0],
      [0,2,5,2],
      [0,0,2,5],
    ];
    const b = [12,17,14,7];
    let x = [0,0,0,0];
    let r = [...b];
    let p = [...r];
    let Ap = [0,0,0,0];
    let iter = 0;

    let rsold = r.reduce((sum, ri) => sum + ri*ri, 0);
    const results = [];

    for(let k=0;k<1000;k++){
      // Ap = A*p
      for(let i=0;i<4;i++){
        Ap[i]=0;
        for(let j=0;j<4;j++){
          Ap[i]+=A[i][j]*p[j];
        }
      }

      const dot1 = p.reduce((sum, pi, i) => sum + pi*Ap[i], 0);
      const alpha = rsold / dot1;

      for(let i=0;i<4;i++) x[i]+=alpha*p[i];
      for(let i=0;i<4;i++) r[i]-=alpha*Ap[i];

      const rsnew = r.reduce((sum, ri) => sum + ri*ri, 0);
      iter++;

      results.push({ iter, x: [...x], norm: Math.sqrt(rsnew) });

      if(Math.sqrt(rsnew)<eps) break;

      const beta = rsnew/rsold;
      for(let i=0;i<4;i++) p[i]=r[i]+beta*p[i];
      rsold=rsnew;
    }

    setIterations(results);
  };

  return (
    <div>
      <h1>Conjugate Gradient Method</h1>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Tolerance (eps):
          <input type="number" value={eps} onChange={(e)=>setEps(Number(e.target.value))} />
        </label>
        <button onClick={calculate}>Calculate</button>
      </div>

      {iterations.length > 0 && (
        <>
          <h2>Iterations:</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Iteration</th>
                <th>x1</th><th>x2</th><th>x3</th><th>x4</th>
                <th>Residual Norm</th>
              </tr>
            </thead>
            <tbody>
              {iterations.map(row => (
                <tr key={row.iter}>
                  <td>{row.iter}</td>
                  <td>{row.x[0].toFixed(6)}</td>
                  <td>{row.x[1].toFixed(6)}</td>
                  <td>{row.x[2].toFixed(6)}</td>
                  <td>{row.x[3].toFixed(6)}</td>
                  <td>{row.norm.toExponential(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Convergence Graph:</h2>
          <Plot
            data={[
              {
                x: iterations.map(r=>r.iter),
                y: iterations.map(r=>r.x[0]),
                type:"scatter", mode:"lines+markers", name:"x1"
              },
              {
                x: iterations.map(r=>r.iter),
                y: iterations.map(r=>r.x[1]),
                type:"scatter", mode:"lines+markers", name:"x2"
              },
              {
                x: iterations.map(r=>r.iter),
                y: iterations.map(r=>r.x[2]),
                type:"scatter", mode:"lines+markers", name:"x3"
              },
              {
                x: iterations.map(r=>r.iter),
                y: iterations.map(r=>r.x[3]),
                type:"scatter", mode:"lines+markers", name:"x4"
              }
            ]}
            layout={{
              title:"Conjugate Gradient Convergence",
              xaxis:{title:"Iteration"},
              yaxis:{title:"x values"},
              width:800, height:500
            }}
          />
        </>
      )}
    </div>
  );
}

export default Conju;
