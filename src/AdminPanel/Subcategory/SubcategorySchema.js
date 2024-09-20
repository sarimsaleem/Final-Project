// SubcategorySchema.js
import * as Yup from 'yup';

const SubCategorySchema = Yup.object().shape({
  categoryId: Yup.string().required('Please select a category!'),
  name: Yup.string().required('Please enter the subcategory name!'),
  images: Yup.array().min(1, 'Please upload at least one image!'),
});

export default SubCategorySchema;