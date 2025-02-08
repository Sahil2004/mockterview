// src/components/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to My App</h1>
      <p>Choose an option:</p>
      <Link to="/login">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Login</button>
      </Link>
      <Link to="/signup">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Signup</button>
      </Link>
    </div>
  );
};

export default Home;