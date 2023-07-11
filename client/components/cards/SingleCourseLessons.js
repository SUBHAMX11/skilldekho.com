import { useState } from "react";
import { List, Avatar } from "antd";

const SingleCourseLessons = ({
  lessons,
  setPreview,
  setShowModal,
  showModal
}) => {
  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col lesson-list">
          {lessons && <h3>{lessons.length}</h3>}
          <hr />
          <List
            itemLayout="horizontal"
            dataSource={lessons}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                />
                
                {item.video && item.video !== null && item.free_preview && (
                  <div
                    className="text-primary cursor-pointer"
                    onClick={() => {
                      setPreview(item.video.Location);
                      setShowModal(true);
                    }}
                  >
                    Preview
                  </div>
                )}
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleCourseLessons;
