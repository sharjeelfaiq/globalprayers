import Layout from "./Components/Layout.js";
import "./App.css";

const App = () => {
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: "100vh" }}
    >
      <Layout />
    </div>
  );
};

export default App;
