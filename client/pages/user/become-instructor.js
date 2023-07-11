import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";

const BecomeInstructor = () => {
  //state
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructor = () => {
    setLoading(true);
    axios
      .post("/api/make-instructor")
      .then((res) => {
        console.log(res);
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err.response.status);
        toast("Stripe Onboarding Failed");
        setLoading(false);
      });
  };
  return (
    <>
      <div className="container-fluid py-5  bg-primary jumbotron">
        <h1 className="display-5 fw-bold text-center jumbotron-text">
          Become Instructor
        </h1>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on skillsDekho.com</h2>
              <p className="load text-warning">
                SkillsDekho.com partners with stripe to ttransfer to your bank
                account{" "}
              </p>
              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                on
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role.includes("Instructor")) ||
                  loading
                }
              >
                {loading ? "Processing..." : "Payout Setup"}
              </Button>
              <p className="lead">
                You will be redirected to stripe to complete onboarding process
              </p>
            </div>
          </div>
        </div>
      </div>
      <br/>
    </>
  );
};

export default BecomeInstructor;
