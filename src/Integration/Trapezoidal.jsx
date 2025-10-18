import { useState } from "react";
import Polt from "react-plotly.js"

function Trapezoidal (){
    const[fx,setFx] = useState("x**7 + 2*x**3 - 1");
    const[a,setA] = useState(-1);
    const[b,setB] = useState(2);
    const[result,setResult] = useState(null);
    const[graphData,setGraphData] = useState({x: [], y:[]});

    const f = (x) =>{
        try{
           return eval(fx);
        }catch(e){
            return NaN;
        }
    };

    const Trapezoidal = (a,b) =>{
        const h = b-a ;
        let sum = f(a) + f(b);
        return h /2 * sum;
    } 

    const Calculate = () => {
        const A = parseFloat(a);
        const B = parseFloat(b);
        const approx = Trapezoidal(A,B);

        const xPoints = [];
        const yPoints = [];
        const step = (B-A) /200;
        for(let x = A -1 ;x <= B + 1; x += step){
            xPoints.push(x);
            yPoints.push(f(x));
        }
        setGraphData({x: xPoints, y: yPoints});
        setResult({approx});
    };

    return (
        <div>
        <h1>Trapezoidal Rule</h1>

        <div style={{marginBottom: "10px"}}>
            <label>f(x):</label>
            <input value={fx} onChange={e => setFx(e.target.value)} style={{width: "220px",margin: "5px"}}/>
        </div>

        <div style={{marginBottom: "10px"}}>
            <label>a: </label>
            <input type="number" value={a} onChange={e => setA(e.target.value)} 
            style={{width: "80px",margin: "5px"}}/>

            <label>b: </label>
            <input type="number" value={b} onChange={e => setB(e.target.value)} 
            style={{width: "80px",margin: "5px"}}/>

        </div>
         <button onClick={Calculate}>calculate</button>

         {result &&(
            <>
            <div style={{marginTop: "20px"}}>
                <table
                style={{
                    margin: "0 auto",
                    borderCollapse: "collapse",
                    width: "60%",
                }}
                >
                <thead >
                    <th style={{marginTop: "20px"}}>Approximation</th>
                </thead>
                <tbody>
                    <tr>
                         <td style={{marginTop: "20px"}}>{result.approx.toFixed(6)}</td>
                    </tr>
                </tbody>
             </table>
            </div>

            <div style={{marginTop: "20px"}}>
                <Polt 
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
                    y: graphData.y.filter((_,i) =>{
                        const x =graphData.x[i];
                        return x >= parseFloat(a) && x <= parseFloat(b);
                    }),
                    fill: "tozeroy",
                    type: "scatter",
                    mode: "none",
                    name: "Area under curve",
                    fillcolor: "rgba(19, 44, 71, 0.2)",
                },
                ]}
                layout={{
                   title: "Graph of f(x) and Integrated Area" ,
                   xaxis: {title: "x"},
                   yaxis: {title: "f(x)"},
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
export default Trapezoidal;