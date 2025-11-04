import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/store";
import {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
} from "../store/contador/slice";

const CounterPage = () => {
  const count = useAppSelector((state) => state.contador.value); // ← Cambia a 'contador'
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState(0);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Counter Page</h1>
      <h2>Current Count: {count}</h2>

      <div style={{ margin: "10px" }}>
        <button onClick={() => dispatch(increment())}>Increment +1</button>
        <button
          onClick={() => dispatch(decrement())}
          style={{ marginLeft: "10px" }}
        >
          Decrement -1
        </button>
      </div>

      <div style={{ margin: "10px" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
        />
        <button
          onClick={() => dispatch(incrementByAmount(amount))}
          style={{ marginLeft: "10px" }}
        >
          Increment by Amount
        </button>
        <button
          onClick={() => dispatch(decrementByAmount(amount))}
          style={{ marginLeft: "10px" }}
        >
          Decrement by Amount
        </button>
      </div>
    </div>
  );
};

export default CounterPage;
