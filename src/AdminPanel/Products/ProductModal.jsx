
import React, { useState } from 'react';
import { Modal, Select, Button, Input, Upload, Form as AntForm } from 'antd';
import { Formik, Form, Field } from 'formik';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { productValidationSchema } from './ProductSchema'; // Ensure your schema path is correct

const { Option } = Select;

const ProductModal = ({ open, onClose, onSubmit, categories, subcategories, vendors }) => { 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleCategoryChange = (value, setFieldValue) => {
    setSelectedCategory(value);
    setFieldValue('category', value);
    setFieldValue('subCategory', ''); // Clear the subcategory when category changes
  };


  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Modal
      title="Add Product"
      open={open}
      onCancel={() => {
        setFileList([]);
        onClose();
      }}
      footer={null}
    >
      <Formik
        initialValues={{
          name: '',
          category: '',
          subCategory: '',
          vendor: '',
          images: [],
        }}
        validationSchema={productValidationSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit({ ...values, images: fileList.map((file) => file.originFileObj) });
          resetForm(); // Reset the form on submit
          setFileList([]);
          onClose();
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            {/* Product Name */}
            <AntForm.Item
              label="Product Name"
              validateStatus={errors.name && touched.name ? 'error' : ''}
              help={errors.name && touched.name ? errors.name : ''}
            >
              <Field name="name">
                {({ field }) => (
                  <Input {...field} placeholder="Enter product name" />
                )}
              </Field>
            </AntForm.Item>

            {/* Category Selection */}
            <AntForm.Item
              label="Category"
              validateStatus={errors.category && touched.category ? 'error' : ''}
              help={errors.category && touched.category ? errors.category : ''}
            >
              <Field name="category">
                {({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select category"
                    value={values.category}
                    onChange={(value) => handleCategoryChange(value, setFieldValue)}
                  >
                    {categories.map((category) => (
                      <Option key={category.key} value={category.key}>
                        {category.category}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
            </AntForm.Item>

            {/* Subcategory Selection */}
            <AntForm.Item
              label="Subcategory"
              validateStatus={errors.subCategory && touched.subCategory ? 'error' : ''}
              help={errors.subCategory && touched.subCategory ? errors.subCategory : ''}
            >
              <Field name="subCategory">
                {({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select subcategory"
                    value={values.subCategory}
                    onChange={(value) => setFieldValue('subCategory', value)}
                    disabled={!selectedCategory}
                  >
                    {(subcategories.filter((sc) => sc.categoryId === selectedCategory.id) || []).map(
                      (subcategory) => (
                        <Option key={subcategory.key} value={subcategory.key}>
                          {subcategory.subCategory}
                        </Option>
                      )
                    )}
                  </Select>
                )}
              </Field>
            </AntForm.Item>

            {/* Vendor Selection */}
            <AntForm.Item
              label="Vendor"
              validateStatus={errors.vendor && touched.vendor ? 'error' : ''}
              help={errors.vendor && touched.vendor ? errors.vendor : ''}
            >
              <Field name="vendor">
                {({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select vendor"
                    value={values.vendor}
                    onChange={(value) => setFieldValue('vendor', value)}
                  >
                    {vendors.map((vendor, index) => (
                      <Option key={index} value={vendor}>
                        {vendor}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
            </AntForm.Item>

            {/* Image Upload */}
            <AntForm.Item
              label="Images"
              validateStatus={errors.images && touched.images ? 'error' : ''}
              help={errors.images && touched.images ? errors.images : ''}
            >
              <Upload
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleUploadChange}
                accept="image/*"
                multiple
              >
                <Button icon={<UploadIcon />}>Upload Images</Button>
              </Upload>
            </AntForm.Item>

            {/* Submit Button */}
            <AntForm.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </AntForm.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ProductModal;
