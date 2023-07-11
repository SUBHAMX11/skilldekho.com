//ALMOST SAME AS REGISTER.JS EXCEPT FEW CHANGES

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("subhamrath011@gmail.com");
  const [password, setPassword] = useState("subham");
  const [loading, setLoading] = useState(false);

  //state
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  //router
  const router = useRouter();

  // using useeffect for not loading login page after user loggedin
  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //to prevent reloading on submit
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });
      dispatch({
        type: "LOGIN",
        payload: data,
      });

      //save user in local storage so as to not lose data on refresh or tab change
      window.localStorage.setItem("user", JSON.stringify(data));

      //REDIRECT
      router.push("/user");
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid py-5  bg-primary jumbotron">
        <h1 className="display-5 fw-bold text-center jumbotron-text">Login</h1>
      </div>
      <div
        className="container mt-5 pb-3 p-5 "
        style={{ marginBottom: "50px", width: '50%', justifyContent: "center" }}
      >
        <form onSubmit={handleSubmit}>
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
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
        <p className="text-center pt-3">
          Not yet Registered ?{" "}
          <Link href="/rigister" legacyBehavior>
            <a style={{ textDecoration: "none" }}>Register</a>
          </Link>
        </p>

        <p className="text-center ">
          <Link href="/forgot-password" legacyBehavior>
            <a style={{ textDecoration: "none" }} className="text-danger">
              Forgot Password
            </a>
          </Link>
        </p>
      </div>
      <br />
    </>
  );
};

export default Login;
