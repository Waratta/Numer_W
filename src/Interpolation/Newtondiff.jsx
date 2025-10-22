import { useState } from "react";
import Plot from "react-plotly.js";
function Newtondiff(){
    const[num,setNum] = useState(3);
    const[xValues,setXValues] = useState([0.0, 40000.0, 80000.0]);
    const[yValues,setYValues] = useState([9.81, 9.6879, 9.5682]);
    const[xEval,setXEval] = useState(42235.0);
    const[result,setResult] = useState(null);
    const[table,setTable] = useState([]);

    const handleNumPointsChange = (e) =>{
        const n = Number(e.target.value);
        setNum(n);
        setXValues(Array(n).fill(0));
        setYValues(Array(n).fill(0));
        setResult(null);
        setTable([]);
    };

    const handleXChange = (index, value) => {
        const newX = [...xValues];
        newX[index] = Number(value);
        setXValues(newX);
    };

    const handleYChange = (index,value) => {
        const newY = [...yValues];
        newY[index] = Number(value);
        setYValues(newY);
    };

    const buildDividedDiff = (x, y) => {
    const n = x.length;
    const diff = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) diff[i][0] = y[i];

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        diff[i][j] = (diff[i + 1][j - 1] - diff[i][j - 1]) / (x[i + j] - x[i]);
      }
    }

    return diff;
  };

    const evaluateNewton = (x, diff, xp) => {
    const n = x.length;
    let yp = diff[0][0];
    for (let i = 1; i < n; i++) {
      let term = diff[0][i];
      for (let k = 0; k < i; k++) term *= xp - x[k];
      yp += term;
    }
    return yp;
  };


     const handleCalculate = () => {
    if (xValues.length < 2 || xValues.length !== yValues.length) {
      alert("กรุณากรอกค่า X,Y ให้ครบอย่างน้อย 2 จุด");
      return;
    }
    const diff = buildDividedDiff(xValues, yValues);
    const yp = evaluateNewton(xValues, diff, xEval);
    setTable(diff);
    setResult(yp);
  };

  // สำหรับกราฟ
  const generateLine = () => {
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const lineX = [];
    const lineY = [];
    const steps = 100;
    const diff = table;
    for (let i = 0; i <= steps; i++) {
      const xi = minX + ((maxX - minX) * i) / steps;
      lineX.push(xi);
      lineY.push(evaluateNewton(xValues, diff, xi));
    }
    return { lineX, lineY };
  };

  const { lineX, lineY } =
    result !== null && table.length > 0
      ? generateLine()
      : { lineX: [], lineY: [] };

    return (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
            <h1>Newton Divided-Differences</h1>

            <div style={{marginBottom: "15px"}}>
                <label>n:</label>
                <input  
                type="number"
                min="2"
                value={num}
                onChange={handleNumPointsChange}
                style={{ width: "60px", marginLeft: "5px" }}
                /> 
            </div>

            <div>
                {xValues.map((_, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                    <label>X{i + 1}: </label>
                    <input
                    type="number"
                    value={xValues[i]}
                    onChange={(e) => handleXChange(i, e.target.value)}
                    style={{ width: "80px", marginRight: "10px" }}
                    />
                    <label>Y{i + 1}: </label>
                    <input
                    type="number"
                    value={yValues[i]}
                    onChange={(e) => handleYChange(i, e.target.value)}
                    style={{ width: "80px" }}
                    />
                </div>
                ))}

                <div style={{ marginBottom: "15px" }}>
                    <label> x = </label>
                    <input
                    type="number"
                    value={xEval}
                    onChange={(e) => setXEval(Number(e.target.value))}
                    style={{ width: "120px" }}
                    />
                </div>
            </div>

            <button onClick = {handleCalculate} > Calculate </button>

            {result !== null && (
                    <div style={{ marginTop: "20px" }}>
                      <h4>
                        ผลลัพธ์: x = {xEval.toFixed(4)} y ={" "}
                        <b>{result.toFixed(6)}</b>
                      </h4>
            
                      <Plot
                        data={[
                          {
                            x: xValues,
                            y: yValues,
                            mode: "markers",
                            name: "ข้อมูลจริง",
                            marker: { color: "blue", size: 8 },
                          },
                          {
                            x: lineX,
                            y: lineY,
                            mode: "lines",
                            name: "เส้นประมาณค่า",
                            line: { color: "orange" },
                          },
                          {
                            x: [xEval],
                            y: [result],
                            mode: "markers",
                            name: "ค่า P(x)",
                            marker: { color: "red", size: 10 },
                          },
                        ]}
                        layout={{
                          width: 700,
                          height: 500,
                          title: "Newton Divided Difference",
                          xaxis: { title: "X" },
                          yaxis: { title: "Y" },
                        }}
                      />
                    </div>
                  )}
        </div>
    );
}
export default Newtondiff;