import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { productValidationSchema } from './ProductSchema'; // Assuming this path to import the schema

const { Option } = Select;

const ProductModal = ({ open, onCancel, onAddProduct, categories, subcategories, vendors }) => {
  // State for selected category and filtered subcategories
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter((sub) => sub.categoryKey === selectedCategory);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      subCategory: '',
      vendor: '',
      images: [],
    },
    validationSchema: productValidationSchema, // Use the imported schema here
    onSubmit: (values, { resetForm }) => {
      onAddProduct(values);
      resetForm();
    },
  });

  return (
    <Modal
      open={open}
      title="Add Product"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={formik.handleSubmit}>
          Add Product
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Product Name" required>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
        </Form.Item>

        <Form.Item label="Category" required>
          <Select
            value={formik.values.category}
            onChange={(value) => {
              formik.setFieldValue('category', value);
              setSelectedCategory(value);
            }}
          >
            {categories.map((category) => (
              <Option key={category.key} value={category.key}>
                {category.name}
              </Option>
            ))}
          </Select>
          {formik.touched.category && formik.errors.category ? <div>{formik.errors.category}</div> : null}
        </Form.Item>

        <Form.Item label="Subcategory" required>
          <Select
            value={formik.values.subCategory}
            onChange={(value) => formik.setFieldValue('subCategory', value)}
            disabled={!selectedCategory}
          >
            {filteredSubcategories.map((sub) => (
              <Option key={sub.key} value={sub.key}>
                {sub.name}
              </Option>
            ))}
          </Select>
          {formik.touched.subCategory && formik.errors.subCategory ? <div>{formik.errors.subCategory}</div> : null}
        </Form.Item>

        <Form.Item label="Vendor" required>
          <Select
            value={formik.values.vendor}
            onChange={(value) => formik.setFieldValue('vendor', value)}
          >
            {vendors.map((vendor) => (
              <Option key={vendor} value={vendor}>
                {vendor}
              </Option>
            ))}
          </Select>
          {formik.touched.vendor && formik.errors.vendor ? <div>{formik.errors.vendor}</div> : null}
        </Form.Item>

        <Form.Item label="Images">
          <Upload
            multiple
            listType="picture"
            beforeUpload={(file) => {
              formik.setFieldValue('images', [...formik.values.images, file]); // Store file objects
              return false; // Prevents default upload behavior
            }}
            onRemove={(file) => {
              const newImages = formik.values.images.filter((img) => img !== file);
              formik.setFieldValue('images', newImages);
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
          {formik.touched.images && formik.errors.images ? <div>{formik.errors.images}</div> : null}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
