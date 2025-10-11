import { useState } from "react";
import Plot from "react-plotly.js";

function Conju() {
  const [eps, setEps] = useState(1e-10);
  const [iterationsc, setIterations] = useState([]);

  const calculatec = () => {
    const A = [
      [5,2,0,0],
      [2,5,2,0],
      [0,2,5,2],
      [0,0,2,5],
    ];
    const bc = [12,17,14,7];
    let xc = [0,0,0,0];
    let rc = [...bc];
    let pc = [...rc];
    let Apc = [0,0,0,0];
    let iterc = 0;

    let rsoldc = rc.reduce((sum, rci) => sum + rci*rci, 0);
    const resultsc = [];

    for(let k=0;k<1000;k++){
      // Ap = A*p
      for(let i=0;i<4;i++){
        Apc[i]=0;
        for(let j=0;j<4;j++){
          Apc[i]+=A[i][j]*pc[j];
        }
      }

      const dot1 = pc.reduce((sum, pi, i) => sum + pi*Apc[i], 0);
      const alpha = rsoldc / dot1;

      for(let i=0;i<4;i++) xc[i]+=alpha*pc[i];
      for(let i=0;i<4;i++) rc[i]-=alpha*Apc[i];

      const rsnew = rc.reduce((sum, ri) => sum + ri*ri, 0);
      iterc++;

      resultsc.push({ iterc, xc: [...x], norm: Math.sqrt(rsnew) });

      if(Math.sqrt(rsnew)<eps) break;

      const beta = rsnew/rsoldc;
      for(let i=0;i<4;i++) pc[i]=rc[i]+beta*pc[i];
      rsoldc=rsnew;
    }

    setIterations(resultsc);
  };

  return (
    <div>
      <h1>Conjugate Gradient Method</h1>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Tolerance:
          <input type="number" value={eps} onChange={(e)=>setEps(Number(e.target.value))} />
        </label>
        <button onClick={calculatec}>Calculate</button>
      </div>

      {iterationsc.length > 0 && (
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
              {iterationsc.map(row => (
                <tr key={row.iterc}>
                  <td>{row.iterc}</td>
                  <td>{row.xc[0].toFixed(6)}</td>
                  <td>{row.xc[1].toFixed(6)}</td>
                  <td>{row.xc[2].toFixed(6)}</td>
                  <td>{row.xc[3].toFixed(6)}</td>
                  <td>{row.norm.toExponential(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Convergence Graph:</h2>
          <Plot
            data={[
              {
                x: iterationsc.map(rc=>rc.iterc),
                y: iterationsc.map(rc=>rc.xc[0]),
                type:"scatter", mode:"lines+markers", name:"x1"
              },
              {
                x: iterationsc.map(rc=>rc.iterc),
                y: iterationsc.map(rc=>rc.xc[1]),
                type:"scatter", mode:"lines+markers", name:"x2"
              },
              {
                x: iterationsc.map(rc=>rc.iterc),
                y: iterationsc.map(rc=>rc.xc[2]),
                type:"scatter", mode:"lines+markers", name:"x3"
              },
              {
                x: iterationsc.map(rc=>r.iterc),
                y: iterationsc.map(rc=>rc.xc[3]),
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
