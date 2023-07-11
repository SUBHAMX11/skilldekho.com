import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";
// import '../public/css/styles.css'

const Index = ({ courses }) => {
  // const [courses, setCourses] = useState([]);

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     const { data } = await axios.get("/api/courses");
  //     setCourses(data);
  //   };
  //   fetchCourses();
  // }, []);

  return (
    <>
      <div className="landing-page-container">
        <div className="jumbotron">
          <h1 className="display-5 fw-bold text-center jumbotron-text">
            SkillsDekho.com
          </h1>
        </div>
        <div className="courses-container">
          <div className="container-fluid pt-4 ps-5 pe-5">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {courses.map((course) => (
                <div key={course._id} className="col">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data,
    },
  };
}

export default Index;
