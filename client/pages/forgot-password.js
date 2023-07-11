import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //Context
  const {
    state: { user },
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/forgot-password", { email });
      setSuccess(true);
      toast("Check Your Email for Code");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/reset-password", {
        email,
        code,
        newPassword,
      });
      setEmail("");
      setCode("");
      setNewPassword("");
      setLoading(false);
      toast("Greate! Now login with your New Password");
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  return (
    <>
      <div className="container-fluid py-5  bg-primary jumbotron">
        <h1 className="display-5 fw-bold text-center jumbotron-text">
          Forgot Password
        </h1>
      </div>

      <div className="container-fluid col-md-4 offset-md-4 pt-10 pb-5 p-4">
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter email"
            required
          />
          {success && (
            <>
              <input
                type="text"
                className="form-control mb-4 p-2"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Secret Code"
                required
              />

              <input
                type="password"
                className="form-control mb-4 p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </>
          )}
          <button
            type="submit"
            className="btn btn-block btn-primary p-2 "
            style={{ width: "100%" }}
            disabled={!email || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
