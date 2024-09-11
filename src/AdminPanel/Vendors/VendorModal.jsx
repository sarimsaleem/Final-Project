import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().min(3).required('Vendor name is required'),
    contact: Yup.string().required('Vendor contact number is required'),
});

const VendorModal = ({ open, onClose, onSubmit }) => {
    const handleSubmit = (values, { resetForm }) => {
        onSubmit(values);
        resetForm();
    };

    return (
        <Modal
            title="Add Vendor"
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Formik
                initialValues={{ name: '', contact: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <FormikForm>
                        <Form.Item
                            label="Vendor Name"
                            validateStatus={errors.name && touched.name ? 'error' : ''}
                            help={errors.name && touched.name ? errors.name : ''}
                        >
                            <Field
                                name="name"
                                as={Input}
                                placeholder="Enter vendor name"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Vendor Contact Number"
                            validateStatus={errors.contact && touched.contact ? 'error' : ''}
                            help={errors.contact && touched.contact ? errors.contact : ''}
                        >
                            <Field
                                name="contact"
                                as={Input}
                                placeholder="Enter vendor contact number"
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginTop: '16px' }}
                        >
                            Submit
                        </Button>
                    </FormikForm>
                )}
            </Formik>
        </Modal>
    );
};

export default VendorModal;
