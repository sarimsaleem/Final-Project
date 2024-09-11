// SubCategoryModal.jsx
import React from 'react';
import { Modal, Button, Upload, Input, Form } from 'antd';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import SubCategorySchema from './SubcategorySchema'; 

const SubCategoryModal = ({ isSubModalOpen, setIsSubModalOpen, handleSubFormSubmit, categories }) => {
  return (
    <Modal
      title="Add New SubCategory"
      open={isSubModalOpen}
      onCancel={() => setIsSubModalOpen(false)}
      footer={null}
    >
      <Formik
        initialValues={{ categoryKey: '', subCategory: '', images: [] }}
        validationSchema={SubCategorySchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubFormSubmit(values);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ setFieldValue }) => (
          <FormikForm>
            <Form.Item
              label="Category"
              name="categoryKey"
              validateStatus="error"
            >
              <Field as="select" name="categoryKey">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.category}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="categoryKey" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item
              label="SubCategory Name"
              name="subCategory"
              validateStatus="error"
            >
              <Field name="subCategory">
                {({ field }) => <Input {...field} placeholder="Enter subcategory name" />}
              </Field>
              <ErrorMessage name="subCategory" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item
              label="SubCategory Images"
              name="images"
              validateStatus="error"
            >
              <Upload
                multiple
                beforeUpload={() => false}
                onChange={({ fileList }) => setFieldValue('images', fileList.map(file => file.originFileObj))}
                listType="picture"
              >
                <Button icon={<UploadIcon />}>Upload Images</Button>
              </Upload>
              <ErrorMessage name="images" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add SubCategory
              </Button>
            </Form.Item>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default SubCategoryModal;
