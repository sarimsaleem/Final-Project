import React, { useState } from 'react';
import { Modal, Input, Button, Upload } from 'antd';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CategorySchema } from './CategorySchema'; // Import Yup validation
import './category.css'; // Import the CSS file

const CategoryModal = ({ isModalOpen, setIsModalOpen, handleFormSubmit }) => {
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-5);
    setFileList(newFileList);
  };

  const onFinish = (values) => {
    handleFormSubmit({ ...values, images: fileList.map(file => file.originFileObj) });
    setFileList([]);
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Add New Category"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Formik
        initialValues={{ category: '', images: [] }}
        validationSchema={CategorySchema}
        onSubmit={onFinish}
      >
        {({ setFieldValue }) => (
          <Form layout="vertical">
            <div className="form-item">
              <label htmlFor="category">Category Name</label>
              <Field
                name="category"
                as={Input} // Use Ant Design Input component
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
                beforeUpload={() => false}
                fileList={fileList}
                onChange={(info) => {
                  handleFileChange(info);
                  setFieldValue('images', info.fileList.map(file => file.originFileObj)); // Ensure correct file object is set
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
                Add Category
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CategoryModal;
