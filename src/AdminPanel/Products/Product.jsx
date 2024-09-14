
import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Space, Table, theme } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import './product.css';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';
import { fetchCategoriesWithSubcategories } from '../Functions/firebaseService'; 
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Componentss/firebase/Firebase'; 

const { Header, Sider, Content } = Layout;

const Product = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  // const [categoryLookup, setCategoryLookup] = useState({});

  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategoriesWithSubcategories();

        // Create a lookup table for category names
        // const categoryLookup = categoriesData.reduce((acc, category) => {
        //   acc[category] = category.name;
        //   return acc;
        // }, {});

        // Flatten subcategories and create a lookup table for subcategory names
        const flatSubcategories = categoriesData.reduce((acc, category) => {
          return [...acc, ...category.subCategories.map((sub) => ({
            ...sub,
            category: category, // Associate subcategory with its parent category
          }))];
        }, []);
        
        setCategories(categoriesData);
        // console.log(categoriesData,"categoriesData")
        setSubcategories(flatSubcategories);
        // console.log(flatSubcategories,"category")
        // setCategoryLookup(categoryLookup); // Set category lookup table
        // console.log(categoryLookup,"categoryLookup")
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // get vendors
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vendors'));
        const vendorList = querySnapshot.docs.map((doc) => doc.data().name);
        setVendors(vendorList);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchData();
    fetchVendors();
  }, []);


  const handleAddProduct = (product) => {
    // console.log(product,"product")
    setProducts((prevProducts) => [
      ...prevProducts,
      { ...product, key: prevProducts.length + 1 },
      // console.log(prevProducts,"prevProducts")
    ]);
    setOpen(false);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      // render: (value) => console.log(value,"value") ,
    },
    {
      title: 'SubCategory',
      dataIndex: 'subCategory',
      key: 'subCategory',
      
    },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <div className="image-gallery">
          {images &&
            images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Product Image ${index}`}
                className="product-image"
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
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
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
        <Header
          className="header"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <p>My name is Sarim</p>
        </Header>
        <Button onClick={() => setOpen(true)}>Add Product</Button>
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
          <Table columns={columns} dataSource={products} />
          <ProductModal
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleAddProduct}
            categories={categories}
            subcategories={subcategories}
            vendors={vendors}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Product;
