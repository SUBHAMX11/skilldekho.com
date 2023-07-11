import { useState, useEffect, createElement } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button, Menu, Avatar } from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";

const { Item } = Menu;

const SingleCourse = () => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updateState, setUpdateState] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    console.log("COMPLETED LESSONS => ", data);
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
    console.log(data);
    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  };

  const markIncompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log(data);
      const all = completedLessons;
      console.log("ALL => ", all);
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        console.log("ALL WITHOUT REMOVED => ", all);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: 320 }}>
          <Button
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary mt-1 mb-2"
            style={{ width: collapsed ? "80px" : "100%" }}
            block
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}{" "}
            {!collapsed && "Lessons"}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{
              height: "80vh",
              overflow: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "transparent transparent",
            }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                key={index}
                onClick={() => setClicked(index)}
                style={{ display: "flex" }}
              >
                <Avatar
                  style={{
                    backgroundColor: completedLessons.includes(lesson._id)
                      ? "blue"
                      : "grey",
                    color: completedLessons.includes(lesson._id)
                      ? "white"
                      : "white",
                  }}
                >
                  {index + 1}
                </Avatar>
                <span className="ps-1 pt-4 align" style={{ marginLeft: "8px" }}>
                  {lesson.title.substring(0, 30)}
                  {/* {completedLessons.includes(lesson._id) ? (
                    <CheckCircleFilled
                      className="text-primary ml-2"
                      style={{ marginLeft: "28px" }}
                    />
                  ) : (
                    <CloseCircleFilled
                      className="text-danger ml-2"
                      style={{ marginLeft: "28px" }}
                    />
                  )} */}
                </span>
              </Item>
            ))}
          </Menu>
        </div>

        <div className=" container-fluid col">
          {clicked !== -1 ? (
            <>
              <div
                className={`col alert ${
                  completedLessons.includes(course.lessons[clicked]._id)
                    ? "alert-success"
                    : "alert-danger"
                } square`}
              >
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span
                    className="float-right pointer"
                    style={{ float: "right", cursor: "pointer" }}
                    onClick={markIncompleted}
                  >
                    Mark as incomplete
                  </span>
                ) : (
                  <span
                    style={{ float: "right" }}
                    className="float-right pointer"
                    onClick={markCompleted}
                  >
                    Mark as completed
                  </span>
                )}
              </div>

              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <>
                    <div className="wrapper">
                      <ReactPlayer
                        className="player"
                        url={course.lessons[clicked].video.Location}
                        width="100%"
                        height="100%"
                        controls
                        onEnded={() => markCompleted()}
                      />
                    </div>
                  </>
                )}

              <ReactMarkdown
                className=" container-fluid single-post"
                escapeHtml={false}
              >
                {course.lessons[clicked].content}
              </ReactMarkdown>
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Clcik on the lessons to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
