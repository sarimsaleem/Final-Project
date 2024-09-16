import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Table, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import SubCategoryModal from '../Subcategory/SubCategoryModal'; // Import the SubCategoryModal
import {
  saveCategory,
  saveSubcategory,
  fetchCategoriesWithSubcategories,
  deleteCategory,
  deleteSubcategory,
  updateCategory,
  updateSubcategory,
} from '../Functions/firebaseService';
import './category.css';
import CatEditModal from './CatEditModal';

const { Header, Sider, Content } = Layout;

const Category = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSubItem, setEditingSubItem] = useState(null);

  const navigate = useNavigate();

  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const handleFormSubmit = async (values) => {
    try {
      if (editingItem) {
        await updateCategory(editingItem.key, values);
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category.key === editingItem.key ? { ...category, ...values } : category
          )
        );
        setEditingItem(null);
        setIsEditModalOpen(false);
      } else {
        const categoryId = await saveCategory(values);
        if (categoryId) {
          setCategories(prevCategories => [
            ...prevCategories,
            { ...values, key: categoryId, subCategories: [] },
          ]);
        }
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving or updating category:', error);
    }
  };

  const handleSubFormSubmit = async (values) => {
    try {
      if (editingSubItem) {
        await updateSubcategory(editingSubItem.categoryKey, editingSubItem.key, values);
        const categoriesData = await fetchCategoriesWithSubcategories();
        setCategories(categoriesData);
        setEditingSubItem(null);
        setIsSubModalOpen(false);
      } else {
        await saveSubcategory(values.categoryKey, {
          ...values,
          key: new Date().toISOString(),
        });
        const categoriesData = await fetchCategoriesWithSubcategories();
        setCategories(categoriesData);
        setIsSubModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving or updating subcategory:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories(prevCategories =>
        prevCategories.filter(category => category.key !== categoryId)
      );
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSubDelete = async (categoryId, subcategoryId) => {
    try {
      await deleteSubcategory(categoryId, subcategoryId);
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.key === categoryId
            ? {
                ...category,
                subCategories: category.subCategories.filter(sub => sub.key !== subcategoryId),
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
    setIsEditModalOpen(true);
  };

  const handleSubEdit = (subItem) => {
    setEditingSubItem(subItem);
    setIsSubModalOpen(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await fetchCategoriesWithSubcategories();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

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
          {images && images.map((image, index) => (
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
                {images && images.map((image, index) => (
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
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
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
          isModalOpen={isAddModalOpen}
          setIsModalOpen={setIsAddModalOpen}
          handleFormSubmit={handleFormSubmit}
        />

        <CatEditModal
          isModalOpen={isEditModalOpen}
          setIsModalOpen={setIsEditModalOpen}
          item={editingItem}
          handleFormSubmit={handleFormSubmit}
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
