import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  QuestionOutlined,
  UploadOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/addLessonForm";
import { toast } from "react-toastify";

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [students, setStudents] = useState(0);
  
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    console.log("STUDENT COUNT => ", data);
    setStudents(data.length);
  };

  //function for adding lessons
  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues({ ...values, title: "", content: "", video: {} });
      setProgress(0);
      setUploadButtonText("Upload video");
      setVisible(false);
      setCourse(data);
      console.log(data);
      toast("Lesson Added");
    } catch (error) {
      toast("Failed To Add Lesson");
    }
  };

  const handleVideo = async (e) => {
    // console.log("handle video upload");
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);
      //send the form-data to backend
      const videoData = new FormData();
      videoData.append("video", file);
      //save progress bar and send
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );

      //once response is recieved
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      setUploading(false);
      console.log(err);
      toast("video upload failed");
    }
  };

  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        "/api/course/video-remove",
        values.video
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setUploading(false);
      setProgress(0);
      setUploadButtonText("UPLOAD ANATHOR VIDEO");
    } catch (err) {
      setUploading(false);
      console.log(err);
      toast("video remove failed");
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "Once you Publish , It will be live in the marketplace for users to enroll"
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast("Your Course is Live");
    } catch (error) {
      toast("Your Course Couldnt get Live");
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "Once you Unpublish , It will not be available for users to enroll"
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      toast("Your course is Unpublished");
      setCourse(data);
    } catch (error) {
      toast("Failed to Unpublish");
    }
  };
  return (
    <InstructorRoute>
      <div className="container-fluid pt-4">
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div
            className="container-fluid pt-2"
            style={{ backgroundColor: "#f6f6f6" }}
          >
            <div className="container pt-2 " style={{ display: "flex", border: "4px solid #fff" }}>
              <Avatar
                className="mt-4"
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="container-fluid pt-3" style={{ display: "flex" }}>
                <div
                  className=" container-fluid "
                  style={{ display: "flex", flexWrap: "nowrap" }}
                >
                  <div className="container-fluid col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length}
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "18px" }}>
                      {course.category}
                    </p>
                  </div>
                  <div className="d-flex pt-4">
                    <Tooltip title={`${students} Enrolled`}>
                      <UserSwitchOutlined className="h5 pointer text-info me-4" />
                    </Tooltip>

                    <Tooltip title="Edit">
                      <EditOutlined
                        onClick={() =>
                          router.push(`/instructor/course/edit/${slug}`)
                        }
                        className="h5 pointer text-warning me-4"
                      />
                    </Tooltip>

                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title="Min 5 lessons required to publish">
                        <QuestionOutlined className="h5 pointer text-danger" />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title="Unpublish">
                        <CloseOutlined
                          onClick={(e) => handleUnpublish(e, course._id)}
                          className="h5 pointer text-success "
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Publish">
                        <CheckOutlined
                          onClick={(e) => handlePublish(e, course._id)}
                          className="h5 pointer text-success"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div>
              <div className="col container-fluid">
                <ReactMarkdown children={course.description} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
              style={{ border: "1px solid black" }}
                className="col-md-6"
                type="primary"
                icon={<UploadOutlined />}
                size="large"
                onClick={() => setVisible(true)}
              >
                Add Lesson
              </Button>
            </div>
            <br />
            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <hr />
              <AddLessonForm
                handleAddLesson={handleAddLesson}
                values={values}
                setValues={setValues}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>

            <div className="container-fluid pb-3">
              <div className="col lesson-list">
                <h4>
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></List.Item.Meta>
                    </List.Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
