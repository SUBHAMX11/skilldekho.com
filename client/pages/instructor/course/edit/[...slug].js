import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal } from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/updateLessonForm";

const CourseEdit = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "599",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
    lessons: [],
  });
  const { slug } = router.query;

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState("Upload Video");

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    //resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        console.log("Image Uploaded", data);
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast("Image upload failed, Try later");
      }
    });
  };

  const handleImageRemove = async (e) => {
    try {
      setValues({ ...values, loading: false });
      const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (error) {
      console.log(error);
      setValues({ ...values, loading: false });
      toast("image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast("Course Updated");
    } catch (err) {
      toast(err.respnse.data);
    }
  };

  const handleDrag = async (e, index) => {
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;

    let allLessons = values.lessons;
    let movingItem = allLessons[movingItemIndex];
    allLessons.splice(movingItemIndex, 1);
    allLessons.splice(targetItemIndex, 0, movingItem);

    setValues({ ...values, lessons: [...allLessons] });

    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
  };

  const handleDelete = async (index) => {
    const answer = window.confirm(
      "Are you sure you want to delete the lesson ?"
    );
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: [...allLessons] });

    //send req to server

    const { data } = await axios.put(`/api/course/${slug}/${removed._id}`);
  };

  const handleVideo = async (e) => {
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        current.video
      );
    }

    const file = e.target.files[0];
    setUploadButtonText(file.name);
    setUploading(true);

    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);

    //save prpgress and send video as form data to backend

    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );

    setVisible(false);
    setUploadVideoButtonText("Upload Video");
    toast("Lesson Updated");
    //update UI
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast("Lesson Updated");
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid py-5  bg-primary jumbotron">
        <h1 className="display-5 fw-bold text-center jumbotron-text">
          Update Course
        </h1>
      </div>
      <div className="container-fluid pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <hr />
      <div className="container-fluid pb-3">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <List.Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <List.Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></List.Item.Meta>

                <DeleteOutlined
                  className="text-danger float-right"
                  onClick={() => handleDelete(index)}
                />
              </List.Item>
            )}
          ></List>
        </div>
      </div>

      <Modal
        title="Update Lesson"
        centered
        onCancel={() => setVisible(false)}
        visible={visible}
        footer={null}
      >
        <br />
        <UpdateLessonForm
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          current={current}
          setCurrent={setCurrent}
          uploading={uploading}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
