import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import {
  DollarOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { stripeCurrencyFormatter } from "../../utils/helpers";

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get("/api/instructor/balance");
    setBalance(data);
  };

  const handlePayoutSettings = () => {
    alert('Unavailable for standard and custom accounts')
  }

  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-2">
          <div
            className="col-md-8 offset-md-2 p-5 mt-4"
            style={{
              background: "#aac4de",
              color: "black",
              border: "3px solid #798798",
              boxShadow: "0 1px 15px"
            }}
          >
            <h2>
              Revenue report <DollarOutlined style={{ float: "right" }} />
            </h2>
            <small className="d-block">
              You get paid directly from Stripe to your bank account every 48
              hours.
            </small>
            <hr />
            <h4>
              Pending balance
              {balance.pending &&
                balance.pending.map((bp, i) => (
                  <span key={i} style={{ float: "right" }}>
                    {stripeCurrencyFormatter(bp)}
                  </span>
                ))}
            </h4>
            <small className="d-block">For the last 48 hours</small>
            <hr />
            <h4>
              Payouts{" "}
              <SettingOutlined
                className="pointer"
                style={{ float: "right" }}
                onClick={handlePayoutSettings}
              />
            </h4>
            <small className="d-block">
              Update your Stripe account details or view previous payouts.
            </small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;
