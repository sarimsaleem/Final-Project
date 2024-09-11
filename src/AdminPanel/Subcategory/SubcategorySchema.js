// SubcategorySchema.js
import * as Yup from 'yup';

const SubCategorySchema = Yup.object().shape({
  categoryKey: Yup.string().required('Please select a category!'),
  subCategory: Yup.string().required('Please enter the subcategory name!'),
  images: Yup.array().min(1, 'Please upload at least one image!'),
});

export default SubCategorySchema;
