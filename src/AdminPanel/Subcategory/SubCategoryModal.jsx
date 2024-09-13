import React, { useState, useEffect } from 'react';
import { Modal, Button, Upload, Input, Form as AntForm } from 'antd';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import SubCategorySchema from './SubcategorySchema';

const SubCategoryModal = ({ isSubModalOpen, setIsSubModalOpen, handleSubFormSubmit, categories }) => {
  const [fileList, setFileList] = useState([]);

  // Function to handle closing the modal and resetting the file list
  const handleModalClose = () => {
    setIsSubModalOpen(false);
    setFileList([]); // Reset the file list when the modal is closed
  };

  // Effect to clear fileList when the modal is opened
  useEffect(() => {
    if (!isSubModalOpen) {
      setFileList([]);
    }
  }, [isSubModalOpen]);

  return (
    <Modal
      title="Add New SubCategory"
      open={isSubModalOpen}
      onCancel={handleModalClose}
      footer={null}
    >
      <Formik
        initialValues={{ categoryKey: '', subCategory: '', images: [] }}
        validationSchema={SubCategorySchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubFormSubmit(values);
          setSubmitting(false);
          resetForm(); // Reset the form fields after submission
          setFileList([]); // Clear the file list after form submission
        }}
      >
        {({ setFieldValue, resetForm }) => (
          <FormikForm>
            <AntForm.Item label="Category" name="categoryKey" validateStatus="error">
              <Field as="select" name="categoryKey">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.category}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="categoryKey" component="div" style={{ color: 'red' }} />
            </AntForm.Item>

            <AntForm.Item label="SubCategory Name" name="subCategory" validateStatus="error">
              <Field name="subCategory">
                {({ field }) => <Input {...field} placeholder="Enter subcategory name" />}
              </Field>
              <ErrorMessage name="subCategory" component="div" style={{ color: 'red' }} />
            </AntForm.Item>

            <AntForm.Item label="SubCategory Images" name="images" validateStatus="error">
              <Upload
                multiple
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => {
                  setFileList(fileList); // Update the state with the new file list
                  setFieldValue('images', fileList.map((file) => file.originFileObj));
                }}
                onRemove={() => {
                  setFieldValue('images', []); // Clear images from Formik when files are removed
                  setFileList([]); // Reset the file list
                }}
                listType="picture"
              >
                <Button icon={<UploadIcon />}>Upload Images</Button>
              </Upload>
              <ErrorMessage name="images" component="div" style={{ color: 'red' }} />
            </AntForm.Item>

            <AntForm.Item>
              <Button type="primary" htmlType="submit">
                Add SubCategory
              </Button>
            </AntForm.Item>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default SubCategoryModal;
