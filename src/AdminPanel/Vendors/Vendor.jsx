import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Space, Table, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import VendorModal from './VendorModal';
import VendorEditModal from './VendorEditModal';
import { Add, Fetch , Update, Delete } from '../Functions/VendorsFunctions'; 

const { Header, Sider, Content } = Layout;

const Vendor = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Function to handle adding new vendors
  const handleAddVendor = async (vendor) => {
    await Add(vendor);
    const updatedVendors = await Fetch();
    setVendors(updatedVendors);
    setOpen(false);
  };

  // Function to handle editing vendors
  const handleEditVendor = async (updatedVendor) => {
    try {
      // Check if selectedVendor has an ID to update
      if (selectedVendor && selectedVendor.id) {
        await Update(selectedVendor.id, updatedVendor); // Update the vendor in Firebase
        const updatedVendors = await Fetch();
        setVendors(updatedVendors);
        setEditOpen(false); // Close the modal after successful update
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
    }
  };

  // Function to delete vendors
  const handleDeleteVendor = async (vendorId) => {
    try {
      await Delete(vendorId);
      const updatedVendors = await Fetch();
      setVendors(updatedVendors);
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  useEffect(() => {
    const loadVendors = async () => {
      const initialVendors = await Fetch();
      setVendors(initialVendors);
    };
    loadVendors();
  }, []);

  const columns = [
    {
      title: 'Vendor Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setSelectedVendor(record); 
              setEditOpen(true); 
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteVendor(record.id)}>
            Delete
          </Button>
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
          defaultSelectedKeys={['3']}
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
          <Button type="primary" onClick={() => setOpen(true)}>
            Add Vendor
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
            dataSource={vendors}
            rowKey={(record) => record.id || `${record.name}-${record.contact}`}
          />
          <VendorModal open={open} onClose={() => setOpen(false)} onSubmit={handleAddVendor} />
          <VendorEditModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            onSubmit={handleEditVendor}
            initialValues={selectedVendor || { name: '', contact: '' }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Vendor;
