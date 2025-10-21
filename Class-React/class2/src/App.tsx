import "./App.css";
import { Link } from "react-router";
import { AppRouter } from "./Router/AppRouter";
// 4 componnetes 1 publico(login), 2 privados(dashboard,products), 1 admin)
function App() {
  return (
    <>
      <nav>
        <Link to={"/home"}>Home</Link>
        <Link to={"/admin"}>Admin</Link>
        <Link to={"/analytics"}>analytics</Link>
        <Link to={"/home"}>Home</Link>
      </nav>
      <AppRouter />
    </>
  );
}

export default App;
