import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Input, Upload, Form as AntForm } from 'antd';
import { Formik, Form, Field } from 'formik';
import { UploadOutlined as UploadIcon } from '@ant-design/icons';
import { productValidationSchema } from './ProductSchema';

const { Option } = Select;

const ProductEditModal = ({ open, onCancel, onEditProduct, product, categories, subcategories, vendors }) => {
  const [selectedCategory, setSelectedCategory] = useState(product?.category || '');
  const [fileList, setFileList] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);

  useEffect(() => {
    // Check if product is defined before setting state
    if (product) {
      setSelectedCategory(product.category || '');
      setFileList(product.images.map((url, index) => ({
        uid: index,
        name: `image-${index}`,
        url: url,
      })) || []);
    }
  }, [product]);

  const handleCategoryChange = (value, setFieldValue) => {
    setSelectedCategory(value);
    setFieldValue('category', value);
    setFieldValue('subCategory', '');
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
    setUploadFiles(fileList.filter(file => !file.url));
  };

  const handleRemove = (file) => {
    if (file.url) {
      setFileList((prevFileList) => prevFileList.filter((f) => f.url !== file.url));
    } else {
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
        onCancel();
      }}
      footer={null}
    >
      {product && (
        <Formik
          initialValues={{
            id: product.id || '',
            name: product.name || '',
            category: product.category || '',
            subCategory: product.subCategory || '',
            vendor: product.vendor || '',
            images: product.images || [],
          }}
          validationSchema={productValidationSchema}
          onSubmit={(values, { resetForm }) => {
            onEditProduct({
              ...values,
              images: [
                ...fileList.filter(file => file.url).map(file => file.url),
                ...uploadFiles.map(file => URL.createObjectURL(file.originFileObj || file)),
              ],
            });
            resetForm();
            setFileList([]);
            setUploadFiles([]);
            onCancel();
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
      )}
    </Modal>
  );
};

export default ProductEditModal;
