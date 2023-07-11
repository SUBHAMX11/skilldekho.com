import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Progress, Tooltip } from "antd";

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploadButtonText,
  uploading,
  handleVideo,
  progress,
  handleVideoRemove,
}) => {
  return (
    <div className="container-fluid">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          className="form-control square"
          value={values.title}
          autoFocus
          required
        />
        <textarea
          className="form-control mt-3"
          cols="8"
          rows="8"
          value={values.content}
          placeholder="Content"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
        ></textarea>

        <div className="d-flex justify-content-center">
          <label
            style={{ width: "100%" }}
            className="btn btn-dark btn-block text-left mt-2"
          >
            {uploadButtonText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>

          {!uploading && values.video.Location && (
            <Tooltip  title="Remove">
              <span onClick={handleVideoRemove} className="ml-2 pt-3">
                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress
            steps={10}
            status="active"
            percent={progress}
            className="d-flex justify-content-center pt-2"
          ></Progress>
        )}

        <Button
          onClick={handleAddLesson}
          className="col mt-3"
          type="primary"
          size="large"
          style={{ marginLeft: "40%" }}
          loading={uploading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
