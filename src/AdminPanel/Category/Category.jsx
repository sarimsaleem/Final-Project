import React, { useState, useRef, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Table, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import SubCategoryModal from '../Subcategory/SubCategoryModal';
import { saveCategory, saveSubcategory, fetchCategoriesWithSubcategories } from '../Functions/firebaseService';
import './category.css';

const { Header, Sider, Content } = Layout;

const Category = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // State for editing items

  const formRef = useRef(null);

  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleFormSubmit = async (values) => {
    try {
      const categoryId = await saveCategory(values);
      if (categoryId) {
        setCategories((prevCategories) => [
          ...prevCategories,
          { ...values, key: categoryId, subCategories: [] },
        ]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
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
            <img key={`category-image-${index}`} src={image} alt={`Category ${index}`} width={50} style={{ marginRight: 10 }} />
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
                  <img key={`subcategory-image-${index}`} src={image} alt={`Subcategory ${index}`} width={50} style={{ marginRight: 10 }} />
                ))}
              </div>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <a onClick={() => handleSubEdit(record)}>Edit</a>
                <a onClick={() => handleSubDelete(record.key)}>Delete</a>
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
          <Button type="primary" onClick={() => setIsSubModalOpen(true)} disabled={categories.length === 0}>
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
          <Table columns={columns} dataSource={categories} expandable={expandable} rowKey="key" />
        </Content>

        <CategoryModal
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