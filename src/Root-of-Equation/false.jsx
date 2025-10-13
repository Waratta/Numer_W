import { useState } from "react";

function False() {
  const [funcf, setFuncF] = useState("x**4 -13");
  const [xlf, setXlF] = useState(1.5);
  const [xrf, setXrF] = useState(2.0);
  const [errorf, setErrorF] = useState(0.000001);
  const [tolf, setTolF] = useState([]);
  const [finalx1, setFinalX1] = useState(null);
  const [interationf, setIterationF] = useState(0);

  const calculatF = () => {
    let f;
    try {
      f = new Function("x", `return ${funcf}`);
    } catch {
      alert("Function invalid!!");
      return;
    }

    let xlF = xlf;
    let xrF = xrf;
    let x1 = 0;
    let x1_old = null;
    let errorF = 1.0;
    let tolfVal = errorf;
    let iterf = 0;
    let resultsf = [];
    let x1List = [];

    while (errorF > tolfVal) {
      x1_old = x1;
      x1 = (xlF * f(xrF) - xrF * f(xlF)) / (f(xrF) - f(xlF));

      if (iterf > 0) {
        errorF = Math.abs(x1 - x1_old);
        resultsf.push({
          inter: iterf,
          xlF,
          xrF,
          x1,
          error: errorF,
        });
        x1List.push(x1);
      }

      if (f(xrF) * f(x1) < 0) {
        xlF = x1;
      } else {
        xrF = x1;
      }

      iterf++;
      if (iterf > 1000) break; 
    }


    let xVals = [];
    let yVals = [];
    let step = (xrf - xlf) / 200;
    for (let x = xlf - 1; x <= xrf + 1; x += step) {
      xVals.push(x);
      yVals.push(f(x));
    }

    setTolF(resultsf);
    setFinalX1(x1);
    setIterationF(iterf);
    setX1Points(x1List);
  };

  return (
    <>
      <h1>False Position Method</h1>
      <div className="input-section">
        <label>
          Function f(x):
          <input value={funcf} onChange={(e) => setFuncF(e.target.value)} />
        </label>
        <label>
          xl:
          <input
            type="number"
            value={xlf}
            onChange={(e) => setXlF(Number(e.target.value))}
          />
        </label>
        <label>
          xr:
          <input
            type="number"
            value={xrf}
            onChange={(e) => setXrF(Number(e.target.value))}
          />
        </label>
        <label>
          Tolerance:
          <input
            type="number"
            value={errorf}
            onChange={(e) => setErrorF(Number(e.target.value))}
          />
        </label>
        <button onClick={calculatF}>Calculate</button>
      </div>

      {tolf.length > 0 && (
        <div className="tol-section">
          <h2>Iterations:</h2>
          <table>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>xlF</th>
                <th>xrF</th>
                <th>x1</th>
                <th>error</th>
              </tr>
            </thead>
            <tbody>
              {tolf.map((row) => (
                <tr key={row.inter}>
                  <td>{row.inter}</td>
                  <td>{row.xlF.toFixed(6)}</td>
                  <td>{row.xrF.toFixed(6)}</td>
                  <td>{row.x1.toFixed(6)}</td>
                  <td>{row.error.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {finalx1 != null && (
        <h2>
          Final x1 = {finalx1.toFixed(6)} (Iterations: {interationf - 1})
        </h2>
      )}
    </>
  );
}

export default False;
