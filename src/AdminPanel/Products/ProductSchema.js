import * as Yup from 'yup';

export const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long')
    .required('Please enter the product name'),
  category: Yup.string().required('Please select a category'),
  subCategory: Yup.string().required('Please select a subcategory'),
  vendor: Yup.string().required('Please select a vendor'),
  // images: Yup.array()
  //   .of(Yup.mixed().required('An image is required')) // Validate each file
  //   .min(1, 'Please upload at least one image!')
  //   .max(5, 'You can only upload up to 5 images.')
});
