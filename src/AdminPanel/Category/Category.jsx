
import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Table, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import SubCategoryModal from '../Subcategory/SubCategoryModal';
// import SubCatEditModal from '../Subcategory/SubCatEdi  tModal'; 
import { Add, Fetch, Delete, Update, } from "../Functions/CategoryFunctions"
import { AddSub, GetSub, DeleteSub, UpdateSub, } from '../Functions/SubCategoryFunctions';
import './category.css';
import { v4 as uuidv4 } from 'uuid';

const { Header, Sider, Content } = Layout;

const Category = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSubItem, setEditingSubItem] = useState(null);

  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const handleFormSubmit = async (values) => {
    try {
      if (editingItem) {
        await Update(editingItem.key, values); // Update category
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category.key === editingItem.key ? { ...category, ...values } : category
          )
        );
      } else {
        await Add({
          ...values,
          createdAt: new Date().toISOString(),
          _id: uuidv4()
        }, null, fetchCategories); // Add new category
      }
      setEditingItem(null); // Reset editing item after submission
      setIsAddModalOpen(false); // Close modal after submission
    } catch (error) {
      console.error('Error saving or updating category:', error);
    }
  };
  const handleDelete = async (categoryId) => {
    try {
      console.log('categoryId', categoryId)
      await Delete(categoryId, fetchCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };
  const fetchCategories = async () => {
    const categoriesData = await Fetch();
    console.log('Fetched categories:', categoriesData);
    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchSubCategories = async () => {
    const categoriesData = await GetSub();
    console.log('Fetched categories:', categoriesData);
    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleSubFormSubmit = async (values) => {
    try {
      if (editingSubItem) {
        console.log("Editing subcategory:", editingSubItem);
        await UpdateSub(editingSubItem.categoryId, editingSubItem.key, values);
      } else {
        console.log("Adding subcategory:", values);

        const newSubcategory = {
          ...values,
          createdAt: new Date().toISOString(),
          _id: uuidv4(),
        };
        await AddSub(values.categoryId, newSubcategory, fetchSubCategories);

      }
      // Reset editing item and close modal
      setEditingSubItem(null);
      setIsSubModalOpen(false);
    } catch (error) {
      console.error('Error saving or updating subcategory:', error);
    }
  };

  const handleSubDelete = async (categoryId, subcategoryId) => {
    try {
      await DeleteSub(categoryId, subcategoryId);
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

  const handleSubEdit = (subItem) => {
    console.log(subItem, "subItem")
    setEditingSubItem(subItem);
    setIsSubModalOpen(true);
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
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
          { title: 'SubCategory', dataIndex: 'name', key: 'name' },
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
            render: (_, subRecord) => {
              console.log('subRecord', subRecord)
              return (
                <Space size="middle">
                  <a onClick={() => handleSubEdit(subRecord)}>Edits</a>
                  <a onClick={() => handleSubDelete(record.key, subRecord.key)}>Delete</a>
                </Space>
              )
            },
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
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />
       <SubCategoryModal
  isSubModalOpen={isSubModalOpen}
  setIsSubModalOpen={setIsSubModalOpen}
  handleSubFormSubmit={handleSubFormSubmit}
  categories={categories}
  editingSubItem={editingSubItem}
  setEditingSubItem={setEditingSubItem}
/>
      </Layout>
    </Layout>
  );
};

export default Category;
