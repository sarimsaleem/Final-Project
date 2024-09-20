import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Upload } from 'antd';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CategorySchema } from './CategorySchema'; // Import Yup validation
import './category.css'; // Import the CSS file

const CategoryModal = ({ isModalOpen, setIsModalOpen, handleFormSubmit, editingItem, setEditingItem }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (editingItem) {
      // Set the fileList with the existing images if editing
      const initialFileList = editingItem.images.map((url, index) => ({
        uid: index,
        name: `image-${index}`,
        status: 'done',
        url: url,
        originFileObj: url,
      }));
      setFileList(initialFileList);
    } else {
      setFileList([]);
    }
  }, [editingItem]);

  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-5); // Limit the number of images to 5
    setFileList(newFileList);
  };

  const onFinish = (values, { resetForm }) => {
    // If editingItem exists, it's an edit operation; otherwise, it's an add operation
    handleFormSubmit({
      ...values,
      images: fileList.map(file => (file.originFileObj instanceof File ? file.originFileObj : file.url)), 
    });
    resetForm(); 
    setFileList([]); 
    setIsModalOpen(false);
    setEditingItem(null); 
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null); 
  };

  const initialValues = {
    name: editingItem ? editingItem.name : '', 
    images: [], 
  };

  return (
    <Modal
      title={editingItem ? 'Edit Category' : 'Add New Category'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={CategorySchema}
        onSubmit={onFinish}
        enableReinitialize // Enable reinitialization when editingItem changes
      >
        {({ setFieldValue, values, dirty }) => (
          <Form layout="vertical">
            <div className="form-item">
              <label htmlFor="category">Category Name</label>
              <Field
                name="name"
                as={Input} 
                placeholder="Enter category name"
              />
              <ErrorMessage
                name="name"
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
                  setFieldValue('images', info.fileList.map(file => file.originFileObj instanceof File ? file.originFileObj : file.url)); 
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
                {editingItem ? 'Update Category' : 'Add Category'}
              </Button>
              {/* disabled={!dirty}
              {dirty && <span className="changes-info">* You have unsaved changes</span>} */}
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CategoryModal;
