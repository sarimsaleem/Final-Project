import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Upload } from 'antd';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CategorySchema } from './CategorySchema'; // Import Yup validation
import './category.css'; // Import the CSS file

const CatEditModal = ({ isModalOpen, setIsModalOpen, handleFormSubmit, editingItem }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (editingItem && editingItem.images) {
      // Pre-fill the file list if editing an existing category with images
      setFileList(editingItem.images.map((image, index) => ({
        uid: index,
        name: `Image ${index + 1}`,
        status: 'done',
        url: image,
      })));
    }
  }, [editingItem]);

  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-5); // Restrict to 5 images
    setFileList(newFileList);
  };

  const onFinish = (values, { resetForm }) => {
    handleFormSubmit({ ...values, images: fileList.map(file => file.originFileObj || file.url) });
    resetForm(); // Reset the form fields after submission
    setFileList([]); // Clear file list after submit
    setIsModalOpen(false); // Close modal after submission
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close modal when cancelled
  };

  return (
    <Modal
      title="Edit Category"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Formik
        initialValues={{
          category: editingItem ? editingItem.category : '', // Pre-fill category name if editing
          images: editingItem ? editingItem.images : [],    // Pre-fill images if editing
        }}
        validationSchema={CategorySchema}
        onSubmit={onFinish}
        enableReinitialize // Ensures the form updates when editingItem changes
      >
        {({ setFieldValue }) => (
          <Form layout="vertical">
            <div className="form-item">
              <label htmlFor="category">Category Name</label>
              <Field
                name="category"
                as={Input}
                placeholder="Enter category name"
              />
              <ErrorMessage
                name="category"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-item">
              <label htmlFor="images">Category Images</label>
              <Upload
                multiple
                beforeUpload={() => false} // Prevent immediate upload
                fileList={fileList}
                onChange={(info) => {
                  handleFileChange(info);
                  setFieldValue('images', info.fileList.map(file => file.originFileObj || file.url));
                }}
                listType="picture-card"
                maxCount={5}
                className="custom-upload"
              >
                <Button icon={<UploadIcon />}>Upload Images</Button>
              </Upload>
              <ErrorMessage
                name="images"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-item">
              <Button type="primary" htmlType="submit">
                Update Category
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CatEditModal;
