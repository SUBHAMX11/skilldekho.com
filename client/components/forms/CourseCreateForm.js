import { Select, Button, Avatar, Badge } from "antd";

const { Option } = Select;

const CourseCreateForm = ({
  handleChange,
  handleImage,
  handleSubmit,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => {
  const children = [];
  for (let i = 299; i <= 1299; i = i + 50) {
    children.push(<Option key={i.toFixed(1)}>Rs {i.toFixed(1)}</Option>);
  }

  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div className="form-group pt-3">
            <textarea
              name="description"
              cols="7"
              rows="7"
              value={values.description}
              className="form-control"
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            ></textarea>
          </div>
          <div className="form-row pt-3" style={{ display: "flex" }}>
            <div className="col">
              <div className="form-group">
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>
            {values.paid && (
              <div className="col ms-5">
                <div className="form-group">
                  <Select
                    defaultValue="Rs 399"
                    style={{ width: "96%" }}
                    onChange={(v) => setValues({ ...values, price: v })}
                    tokenSeparators={[,]}
                    size="large"
                  >
                    {children}
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="form-group pt-3">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              value={values.category}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div className="form-row pt-3" style={{ display: "flex" }}>
            <div className="col">
              <div className="form-group">
                <label
                  style={{ width: "100%" }}
                  className="btn btn-outline-secondary btn-block text-left"
                >
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>

            {preview && (
              <Badge count="X" onClick={handleImageRemove} className="pointer">
                <Avatar className="mt-2 ms-2 me-1" width={250} src={preview} />
              </Badge>
            )}

            {editPage && values.image && (
              <Avatar
                className="mt-2 ms-2 me-1"
                width={250}
                src={values.image.Location}
              />
            )}
          </div>
          <div className="row pt-3">
            <div className="col">
              <Button
                size="large"
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary"
                loading={values.loading}
                type="primary"
                shape="round"
                style={{ width: "100%" }}
              >
                {values.loading ? "Saving....." : "Save & Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
