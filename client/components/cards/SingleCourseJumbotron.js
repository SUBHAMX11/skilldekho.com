import { useState, useEffect } from "react";
import SingleCourse from "../../pages/course/[...slug]";
import { Badge, Modal, Button } from "antd";
import { currencyFormatter } from "../../utils/helpers";
import ReactPlayer from "react-player";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";

const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  preview,
  setPreview,
  loading,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  enrolled,
  setEnrolled,
}) => {
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="container-fluid py-2  bg-primary jumbotron">
      <div className="row ">
        <div className="col-md-8 pe-2">
          <h1 className="text-light font-weight-bold">{name}</h1>
          <p className="lead text-light container">
            {" "}
            {description && description.substring(0, 150)}...
          </p>
          <Badge
            count={category}
            className="pb-4 ms-1"
            color="orange"
            style={{ fontSize: "20px" }}
          />
          <p className="text-light"> Created By {instructor.name}</p>
          <h4 className="text-light">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: "INR",
                })
              : "Free"}
          </h4>
        </div>
        <div className="col-md-4 mt-4 text-light container-fluid">
          {isClient &&
            (lessons[0].video && lessons[0].video.Location ? (
              <div
                onClick={() => {
                  setPreview(lessons[0].video.Location);
                  setShowModal(!showModal);
                }}
              >
                <ReactPlayer
                  className="react-player-div"
                  url={lessons[0].video.Location}
                  light={image.Location}
                  width="100%"
                  height="240px"
                />
              </div>
            ) : (
              <>
                {image && (
                  <img
                    src={image.Location}
                    alt={name}
                    className="img img-fluid"
                  />
                )}
              </>
            ))}
          {loading ? (
            <div className="d-flex justify-content-center">
              <LoadingOutlined className="h1 text-danger" />
            </div>
          ) : (
            <Button
              className="mb-3 mt-3"
              type="danger"
              block
              shape="round"
              icon={<SafetyOutlined />}
              size="large"
              disabled={loading}
              onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
            >
              {user
                ? enrolled.status
                  ? "Go to course"
                  : "Enroll"
                : "Login to enroll"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
