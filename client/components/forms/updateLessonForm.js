import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Progress, Switch } from "antd";
import ReactPlayer from "react-player";

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  uploadVideoButtonText,
  uploading,
  handleVideo,
  progress,
}) => {
  return (
    <div className="container-fluid">
      <form onSubmit={handleUpdateLesson}>
        <input
          type="text"
          onChange={(e) => setValues({ ...current, title: e.target.value })}
          className="form-control square"
          value={current.title}
          autoFocus
          required
        />
        <textarea
          className="form-control mt-3"
          cols="6"
          rows="6"
          value={current.content}
          onChange={(e) => setValues({ ...values, content: e.target.value })}
        ></textarea>

        <div className="d-flex justify-content-center">
          {!uploading && current.video && current.video.Location && (
            <div className="pt-1 d-flex-justify-content-center">
              <ReactPlayer
                url={current.video.Location}
                width="370px"
                height="220px"
                controls
              />
            </div>
          )}
        </div>

        <label
          style={{ width: "100%" }}
          className="btn btn-dark btn-block text-left mt-2"
        >
          {uploadVideoButtonText}
          <input onChange={handleVideo} type="file" accept="video/*" hidden />
        </label>

        {progress > 0 && (
          <Progress
            steps={10}
            status="active"
            percent={progress}
            className="d-flex justify-content-center pt-2"
          ></Progress>
        )}

        <div
          style={{ display: "flex" }}
          className="container-fluid justify-content-center"
        >
          <span className="pt-2">Preview</span>
          <Switch
            className="float-right ms-5 mt-2"
            defaultChecked={current.free_preview}
            name="free_preview"
            disabled={uploading}
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>

        <Button
          onClick={handleUpdateLesson}
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

export default UpdateLessonForm;
