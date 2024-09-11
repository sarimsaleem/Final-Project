// CategorySchema.js
import * as Yup from 'yup';

export const CategorySchema = Yup.object().shape({
  category: Yup.string().required('Please enter the category name!'),
  images: Yup.array()
    .min(1, 'Please upload at least one image!')
    .max(5, 'You can only upload up to 5 images.')
});
