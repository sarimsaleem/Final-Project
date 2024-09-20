import React, { useState, useEffect } from 'react';
import { Modal, Button, Upload, Input, Form as AntForm } from 'antd';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import SubCategorySchema from './SubcategorySchema';

const SubCategoryModal = ({
  isSubModalOpen,
  setIsSubModalOpen,
  handleSubFormSubmit,
  categories,
  editingSubItem,
  setEditingSubItem,
}) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // If editingSubItem exists, pre-fill fileList with existing images
    if (editingSubItem) {
      setFileList(
        editingSubItem.images.map((url, index) => ({
          uid: index,
          name: `Image-${index + 1}`,
          status: 'done',
          url,
        }))
      );
    } else {
      setFileList([]);
    }
  }, [editingSubItem]);

  const handleModalClose = () => {
    setIsSubModalOpen(false);
    setFileList([]);
    setEditingSubItem(null); // Reset editingSubItem when modal is closed
  };

  return (
    <Modal
      title={editingSubItem ? 'Edit SubCategory' : 'Add New SubCategory'}
      open={isSubModalOpen}
      onCancel={handleModalClose}
      footer={null}
    >
      <Formik
        initialValues={{
          categoryId: editingSubItem ? editingSubItem.categoryId : '',
          name: editingSubItem ? editingSubItem.name : '',
          images: editingSubItem ? editingSubItem.images : [],
        }}
        validationSchema={SubCategorySchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubFormSubmit(values);
          setSubmitting(false);
          resetForm();
          setFileList([]);
        }}
      >
        {({ setFieldValue }) => (
          <FormikForm>
            <AntForm.Item label="Category" name="categoryId">
              <Field as="select" name="categoryId">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="categoryId" component="div" style={{ color: 'red' }} />
            </AntForm.Item>

            <AntForm.Item label="SubCategory Name" name="name">
              <Field name="name">
                {({ field }) => <Input {...field} placeholder="Enter subcategory name" />}
              </Field>
              <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
            </AntForm.Item>

            <AntForm.Item label="SubCategory Images" name="images">
              <Upload
                multiple
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => {
                  setFileList(fileList);
                  setFieldValue(
                    'images',
                    fileList.map((file) => file.originFileObj || file.url)
                  );
                }}
                onRemove={(file) => {
                  const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
                  setFileList(updatedFileList);
                  setFieldValue(
                    'images',
                    updatedFileList.map((file) => file.originFileObj || file.url)
                  );
                }}
                listType="picture"
              >
                <Button icon={<UploadIcon />}>Upload Images</Button>
              </Upload>
              <ErrorMessage name="images" component="div" style={{ color: 'red' }} />
            </AntForm.Item>

            <AntForm.Item>
              <Button type="primary" htmlType="submit">
                {editingSubItem ? 'Update SubCategory' : 'Add SubCategory'}
              </Button>
            </AntForm.Item>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default SubCategoryModal;
