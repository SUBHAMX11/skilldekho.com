import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, Tooltip } from "antd";
import Link from "next/link";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get("/api/instructor-courses");
    console.log(data);
    setCourses(data);
  };

  const myStyle = { marginTop: "-15px", fontSize: "12px" };

  return (
    <InstructorRoute>
      <div className="container-fluid py-5  bg-primary jumbotron">
        <h1 className="display-5 fw-bold text-center jumbotron-text">
          Instructor Dashboard
        </h1>
      </div>
      {courses &&
        courses.map((course) => (
          <>
            <div
              className="container-fluid media pt-2 mb-4 mt-4"
              style={{ display: "flex", border: '2px solid', boxShadow: "0 0 10px ", marginTop: "10px" }}
            >
              <Avatar
                className="mt-3"
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              ></Avatar>
              <div className=" container-fluid media pt-2 ps-4">
                <div className="d-flex">
                  <div className="col">
                    <Link
                      legacyBehavior
                      href={`/instructor/course/view/${course.slug}`}
                      className="pointer"
                    >
                      <a
                        style={{ textDecoration: "none" }}
                        className="h5 mt-2 text-primary"
                      >
                        <h5>{course.name}</h5>
                      </a>
                    </Link>
                    <p style={{ marginTop: "-15px" }}>
                      {course.lessons.length}Lessons
                    </p>

                    {course.lessons.length < 5 ? (
                      <p style={myStyle} className="text-warning">
                        At least 5 lessons required to publish
                      </p>
                    ) : course.published ? (
                      <p style={myStyle} className="text-success">
                        Your course is live
                      </p>
                    ) : (
                      <p style={myStyle} className="text-success">
                        Your course is ready to publish
                      </p>
                    )}
                  </div>
                  <div
                    className="col-md-3 text-center"
                    style={{ marginTop: "15px" }}
                  >
                    {course.published ? (
                      <Tooltip title="Published">
                        <CheckCircleOutlined className="h5 pointer text-sucess" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Unpublished">
                        <CloseCircleOutlined className="h5 pointer text-warning" />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
    </InstructorRoute>
  );
};

export default InstructorIndex;
