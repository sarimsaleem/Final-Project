import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Table, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import SubCategoryModal from '../Subcategory/SubCategoryModal';
import {
  saveCategory,
  saveSubcategory,
  fetchCategoriesWithSubcategories,
  deleteCategory,
  deleteSubcategory,
  updateCategory, // Import updateCategory function
} from '../Functions/firebaseService';
import './category.css';
import CatEditModal from './CatEditModal';

const { Header, Sider, Content } = Layout;

const Category = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // State for editing items

  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleFormSubmit = async (values) => {
    try {
      if (editingItem) {
        // Update the existing category using the updateCategory function
        await updateCategory(editingItem.key, values);
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.key === editingItem.key ? { ...category, ...values } : category
          )
        );
        setEditingItem(null); // Clear editing state
      } else {
        // Save new category if not in editing mode
        const categoryId = await saveCategory(values);
        if (categoryId) {
          // Log values to check if image URL is correctly added
          console.log('New Category Values:', values);
          setCategories((prevCategories) => [
            ...prevCategories,
            { ...values, key: categoryId, subCategories: [] },
          ]);
        }
      }
      setIsModalOpen(false); // Close the modal after save/update
    } catch (error) {
      console.error('Error saving or updating category:', error);
    }
  };
  
  const handleSubFormSubmit = async (values) => {
    try {
      await saveSubcategory(values.categoryKey, {
        ...values,
        key: new Date().toISOString(), // Ensure this key is unique
      });
      const categoriesData = await fetchCategoriesWithSubcategories();
      setCategories(categoriesData);
      setIsSubModalOpen(false);
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      // Update local state to remove the deleted category
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.key !== categoryId)
      );
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSubDelete = async (categoryId, subcategoryId) => {
    try {
      await deleteSubcategory(categoryId, subcategoryId);
      // Update local state to remove the deleted subcategory
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.key === categoryId
            ? {
                ...category,
                subCategories: category.subCategories.filter(
                  (sub) => sub.key !== subcategoryId
                ),
              }
            : category
        )
      );
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await fetchCategoriesWithSubcategories();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, [categories]);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <div>
          {images &&
            images.map((image, index) => (
              <img
                key={`category-image-${index}`}
                src={image}
                alt={`Category ${index}`}
                width={50}
                style={{ marginRight: 10 }}
              />
            ))}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleDelete(record.key)}>Delete</a>
        </Space>
      ),
    },
  ];

  // Expandable table configuration for subcategories
  const expandable = {
    expandedRowRender: (record) => (
      <Table
        columns={[
          { title: 'SubCategory', dataIndex: 'subCategory', key: 'subCategory' },
          {
            title: 'Images',
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
              <div>
                {images &&
                  images.map((image, index) => (
                    <img
                      key={`subcategory-image-${index}`}
                      src={image}
                      alt={`Subcategory ${index}`}
                      width={50}
                      style={{ marginRight: 10 }}
                    />
                  ))}
              </div>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, subRecord) => (
              <Space size="middle">
                <a onClick={() => handleSubEdit(subRecord)}>Edit</a>
                <a onClick={() => handleSubDelete(record.key, subRecord.key)}>Delete</a>
              </Space>
            ),
          },
        ]}
        dataSource={record.subCategories}
        pagination={false}
        rowKey="key"
      />
    ),
    rowExpandable: (record) => record.subCategories && record.subCategories.length > 0,
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['2']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              onClick: () => navigate('/'),
              label: 'Product Adding Page',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              onClick: () => navigate('/category'),
              label: 'Category & Subcategory Page',
            },
            {
              key: '3',
              icon: <VideoCameraOutlined />,
              onClick: () => navigate('/vendor'),
              label: 'Vendors',
            },
            { key: '4', icon: <UploadOutlined />, label: 'SignOut' },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="header" style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <p>My name is Sarim</p>
        </Header>
        <div style={{ display: 'flex', gap: '10px', padding: '16px' }}>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add Category
          </Button>
          <Button
            type="primary"
            onClick={() => setIsSubModalOpen(true)}
            disabled={categories.length === 0}
          >
            Add SubCategory
          </Button>
        </div>
        <Content
          className="product-content"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Table
            columns={columns}
            dataSource={categories}
            expandable={expandable}
            rowKey="key"
          />
        </Content>

        <CategoryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleFormSubmit={handleFormSubmit}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />

        {/* CatEditModal is used for editing */}
        <CatEditModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleFormSubmit={handleFormSubmit}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />

        <SubCategoryModal
          isSubModalOpen={isSubModalOpen}
          setIsSubModalOpen={setIsSubModalOpen}
          handleSubFormSubmit={handleSubFormSubmit}
          categories={categories}
        />
      </Layout>
    </Layout>
  );
};

export default Category;