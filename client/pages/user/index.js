import { useContext, useEffect, useState } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Avatar } from "antd";
import Link from "next/link";
import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons";
import course from "../../../server/models/course";

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user-courses");
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      {loading && (
        <SyncOutlined
          spin
          className="d-flex container-fluid justify-content-center display-1 text-danger p-5"
        />
      )}
      <div className="container-fluid py-5  bg-primary jumbotron">
        <h1 className="display-5 fw-bold text-center jumbotron-text">
          User Dashboard
        </h1>
      </div>
      {/* show list of courses */}

      {courses &&
        courses.map((course) => (
          <div
            key={course._id}
            className="d-flex container-fluid media pt-2 pb-2"
          >
            <Avatar
              size={110}
              shape="square"
              src={course.image ? course.image.Location : "/course.png"}
            />

            <div className=" container-fluid media-body pl-4">
              <div className="row">
                <div className="col">
                  <Link
                    legacyBehavior
                    href={`/user/course/${course.slug}`}
                    className="pointer"
                  >
                    <a style={{ textDecoration: "none" }}>
                      <h5 className="mt-2 text-primary">{course.name}</h5>
                    </a>
                  </Link>
                  <p style={{ marginTop: "-10px" }}>
                    {course.lessons.length} lessons
                  </p>
                  <p
                    className="text-muted"
                    style={{ marginTop: "-15px", fontSize: "14px" }}
                  >
                    By {course.instructor.name}
                  </p>
                </div>
                <div className="col-md-3 mt-3 text-center">
                  <Link href={`/user/course/${course.slug}`} legacyBehavior>
                    <a>
                      <PlayCircleOutlined
                        className="h2 pointer"
                        style={{ color: "orange" }}
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
    </UserRoute>
  );
};

export default UserIndex;
