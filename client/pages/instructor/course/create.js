import { useState} from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import { toast } from "react-toastify";
import { useRouter } from "next/router";


const CourseCreate = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "599",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
  });

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

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
      const { data } = await axios.post("/api/course", {
        ...values,
        image,
      });
      toast("Greate! Now start adding Lessons ");
      router.push("/instructor");
    } catch (err) {
      toast(err.respnse.data);
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid py-5  bg-primary jumbotron">
        <h1 className="display-5 fw-bold text-center jumbotron-text">
          Create Course
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
          handleImageRemove={handleImageRemove}
        />
      </div>
    </InstructorRoute>
  );
};

export default CourseCreate;
