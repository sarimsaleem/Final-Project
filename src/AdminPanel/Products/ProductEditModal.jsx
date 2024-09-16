import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Input, Upload, Form as AntForm } from 'antd';
import { Formik, Form, Field } from 'formik';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { productValidationSchema } from './ProductSchema'; 

const { Option } = Select;

const ProductEditModal = ({ open, onClose, onSubmit, productData, categories, subcategories, vendors }) => {
  const [selectedCategory, setSelectedCategory] = useState(productData.category || '');
  const [fileList, setFileList] = useState(productData.images.map((url, index) => ({
    uid: index,
    name: `image-${index}`,
    url: url,
  })) || []); // Display existing images
  const [uploadFiles, setUploadFiles] = useState([]); // For new files to be uploaded

  useEffect(() => {
    // Update selectedCategory when productData changes
    setSelectedCategory(productData.category || '');
    setFileList(productData.images.map((url, index) => ({
      uid: index,
      name: `image-${index}`,
      url: url,
    })) || []);
  }, [productData]);

  const handleCategoryChange = (value, setFieldValue) => {
    setSelectedCategory(value);
    setFieldValue('category', value);
    setFieldValue('subCategory', ''); // Reset subcategory when category changes
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
    setUploadFiles(fileList.filter(file => !file.url)); // New files that don't have a URL
  };

  const handleRemove = (file) => {
    if (file.url) {
      // If the file has a URL (existing image), remove it from the list
      setFileList((prevFileList) => prevFileList.filter((f) => f.url !== file.url));
    } else {
      // If it's a new file, remove it from uploadFiles
      setUploadFiles((prevUploadFiles) => prevUploadFiles.filter((f) => f.uid !== file.uid));
    }
  };

  return (
    <Modal
      title="Edit Product"
      open={open}
      onCancel={() => {
        setFileList([]); 
        setUploadFiles([]);
        onClose();
      }}
      footer={null}
    >
      <Formik
        initialValues={{
          id: productData.id || '', // Ensure ID is included
          name: productData.name || '',
          category: productData.category || '',
          subCategory: productData.subCategory || '',
          vendor: productData.vendor || '',
          images: productData.images || [], // Existing images
        }}
        validationSchema={productValidationSchema}
        onSubmit={(values, { resetForm }) => {
          // Collect existing images and newly uploaded files
          onSubmit({
            ...values,
            images: [
              ...fileList.filter(file => file.url).map(file => file.url), // Existing images
              ...uploadFiles.map(file => URL.createObjectURL(file.originFileObj || file)) // New images
            ]
          });
          resetForm(); 
          setFileList([]); 
          setUploadFiles([]);
          onClose();
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <AntForm.Item
              label="Product Name"
              validateStatus={errors.name && touched.name ? 'error' : ''}
              help={errors.name && touched.name ? errors.name : ''}
            >
              <Field name="name">
                {({ field }) => <Input {...field} placeholder="Enter product name" />}
              </Field>
            </AntForm.Item>

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
                    {subcategories
                      .filter((sc) => sc.categoryKey === selectedCategory)
                      .map((subcategory) => (
                        <Option key={subcategory.key} value={subcategory.key}>
                          {subcategory.subCategory}
                        </Option>
                      ))}
                  </Select>
                )}
              </Field>
            </AntForm.Item>

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

            <AntForm.Item label="Images">
              <Upload
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleUploadChange}
                onRemove={handleRemove}
                accept="image/*"
                multiple
              >
                <Button icon={<UploadIcon />}>Upload Images</Button>
              </Upload>
            </AntForm.Item>

            <AntForm.Item>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </AntForm.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ProductEditModal;
