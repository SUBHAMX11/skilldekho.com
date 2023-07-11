import { Modal } from "antd";
import ReactPlayer from "react-player";

const PreviewModal = ({showModal, setShowModal, preview}) => {
  return (
    <>
      <Modal
        title="Course Preview"
        destroyOnClose={true}
        onCancel={() => setShowModal(!showModal)}
        visible={showModal}
        width={720}
        footer={null}
      >
        <div className="wrapper">
          <ReactPlayer
            url={preview}
            width="100%"
            height="100%"
            controls={true}
            playing={showModal}
          />
        </div>
      </Modal>
    </>
  );
};

export default PreviewModal;
