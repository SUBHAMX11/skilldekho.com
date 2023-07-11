import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Register = () => {
  const [name, setName] = useState("subham");
  const [email, setEmail] = useState("subhamrath011@gmail.com");
  const [password, setPassword] = useState("subham");
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const router = useRouter();

  // using useeffect for not loading login page after user loggedin
  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //to prevent reloading on submit
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      toast.success("Registration Successful ! You can Login Now");
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid py-5  bg-primary jumbotron">
        <h1 className="display-5 fw-bold text-center jumbotron-text">
          Register
        </h1>
      </div>
      <div className="container mt-5 pb-2 p-4" style={{width: '55%', justifyContent: "center"}}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-4 "
            value={name}
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="form-control mb-4 "
            value={email}
            placeholder="Enter userEmail"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-4 "
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <br />
          <button
            type="submit"
            className="btn btn-block btn-primary p-2 "
            style={{ width: "100%" }}
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
        <p className="text-center p-3">
          Already Registered ?{" "}
          <Link href="/login" legacyBehavior>
            <a>Login</a>
          </Link>
        </p>
      </div>
      <br/>
    </>
  );
};

export default Register;
