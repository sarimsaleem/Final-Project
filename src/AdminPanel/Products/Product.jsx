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
  import ProductEditModal from './ProductEditModal'; 
  import { fetchCategoriesWithSubcategories, fetchProducts, addProduct, deleteProduct, updateProduct } from '../Functions/firebaseService';
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '../../Componentss/firebase/Firebase';

  const { Header, Sider, Content } = Layout;

  const Product = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false); // State for edit modal
    const [products, setProducts] = useState([]); // State for products
    const [categories, setCategories] = useState([]); // State for categories
    const [subcategories, setSubcategories] = useState([]); // State for subcategories
    const [vendors, setVendors] = useState([]); // State for vendors
    const [selectedProduct, setSelectedProduct] = useState(null); // Track the product being edited

    const navigate = useNavigate();
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Fetch categories and subcategories
    const fetchCategories = async () => {
      try {
        const categoriesData = await fetchCategoriesWithSubcategories();
        const flatSubcategories = categoriesData.reduce((acc, category) => {
          return [...acc, ...category.subCategories.map((sub) => ({
            ...sub,
            category: category,
          }))];
        }, []);
        setCategories(categoriesData);
        setSubcategories(flatSubcategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch vendors from Firestore
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vendors'));
        const vendorList = querySnapshot.docs.map((doc) => doc.data().name);
        setVendors(vendorList);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    // Fetch products from Firestore
    const fetchAllProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Load data on component mount
    useEffect(() => {
      fetchCategories();
      fetchVendors();
      fetchAllProducts(); // Fetch products on mount
    }, []);

    // Handle adding a new product
    const handleAddProduct = async (product) => {
      try {
        const selectedCategory = categories.find((category) => category.key === product.category);
        const selectedSubcategory = subcategories.find((sub) => sub.key === product.subCategory);
        const newProduct = {
          ...product,
          category: selectedCategory?.category || '',
          subCategory: selectedSubcategory?.subCategory || '',
          vendor: vendors.find(vendor => vendor === product.vendor) || 'Unknown Vendor',
          images: product.images || [],
        };
        await addProduct(newProduct, fetchAllProducts);
        setOpen(false);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };

    // Handle deleting a product
    const handleDeleteProduct = async (productId) => {
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };

    // Handle editing a product
    const handleEditProduct = async (updatedProduct) => {
      try {
        // Ensure that the updatedProduct includes all required fields, including images
        await updateProduct(updatedProduct.id, updatedProduct);
        
        // Update the state with the new product data
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          )
        );
        
        setEditOpen(false); // Close the edit modal
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };

    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Category', dataIndex: 'category', key: 'category' },
      { title: 'SubCategory', dataIndex: 'subCategory', key: 'subCategory' },
      { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
      {
        title: 'Images',
        dataIndex: 'images',
        key: 'images',
        render: (images) => (
          <div className="image-gallery">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <img
                  key={image} // Use image URL as the key if it's unique
                  src={image}
                  alt={`Product Image ${index}`}
                  className="product-image"
                />
              ))
            ) : (
              <span>No images available</span>
            )}
          </div>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                setSelectedProduct(record); 
                setEditOpen(true);
              }}
            >
              Edit
            </Button>
            <Button danger onClick={() => handleDeleteProduct(record.id)}>
              Delete
            </Button>
          </Space>
        ),
      }
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
          <Header className="header" style={{ padding: 0, background: colorBgContainer }}>
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

            {/* Product Modal for adding new product */}
            <ProductModal
              open={open}
              onClose={() => setOpen(false)}
              onSubmit={handleAddProduct}
              categories={categories}
              subcategories={subcategories}
              vendors={vendors}
            />

            {/* Product Edit Modal for editing product */}
            {selectedProduct && (
              <ProductEditModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSubmit={handleEditProduct}
                productData={selectedProduct}
                categories={categories}
                subcategories={subcategories}
                vendors={vendors}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    );
  };

  export default Product;
