import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Upload } from 'antd';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CategorySchema } from '../Category/CategorySchema'; // Import Yup validation

const SubCatEditModal = ({ isModalOpen, setIsModalOpen, handleSubFormSubmit, editingSubItem, setEditingSubItem }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (editingSubItem) {
      // Pre-fill the file list if editing an existing subcategory with images
      setFileList(editingSubItem.images.map((image, index) => ({
        uid: index,
        name: `Image ${index + 1}`,
        status: 'done',
        url: image,
      })));
    }
  }, [editingSubItem]);

  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-5); // Limit to 5 files
    setFileList(newFileList);
  };

  const onFinish = (values, { resetForm }) => {
    handleSubFormSubmit({ ...values, images: fileList.map(file => file.originFileObj || file.url) });
    resetForm();
    setFileList([]);
    setEditingSubItem(null);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingSubItem(null);
  };

  return (
    <Modal
      title="Edit Subcategory"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Formik
        initialValues={{
          subCategory: editingSubItem ? editingSubItem.subCategory : '',
          images: editingSubItem ? editingSubItem.images : [],
        }}
        validationSchema={CategorySchema}
        onSubmit={onFinish}
        // enableReinitialize 
      >
        {({ setFieldValue }) => (
          <Form layout="vertical">
            <div className="form-item">
              <label htmlFor="subCategory">Subcategory Name</label>
              <Field
                name="subCategory"
                as={Input}
                placeholder="Enter subcategory name"
              />
              <ErrorMessage
                name="subCategory"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-item">
              <label htmlFor="images">Subcategory Images</label>
              <Upload
                multiple
                beforeUpload={() => false}
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
                Update Subcategory
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default SubCatEditModal;
