import { CloudSyncOutlined, FrownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute"; // to protect it for login users only
import { Typography, Result } from "antd";
const { Title, Paragraph } = Typography;

const StripeCancel = () => {
  return (
    <UserRoute showNav={false}>
      <div className="container-fluid text-center justify-content-center">
        <div className="col-md-9 mt-4">
          <Result
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "72px", color: "#FF4D4F" }}
              />
            }
            title={<Title level={1}>Payment Failed</Title>}
            subTitle="We're sorry, but your payment was not successful."
            extra={
              <Paragraph>
                Please try again or contact customer support for assistance.
              </Paragraph>
            }
          />
        </div>
      </div>
    </UserRoute>
  );
};

export default StripeCancel;
