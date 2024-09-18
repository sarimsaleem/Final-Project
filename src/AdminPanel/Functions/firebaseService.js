import { db, imgDB } from '../../Componentss/firebase/Firebase';
import { addDoc, doc, updateDoc, collection, getDocs, getDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const vendorCollectionRef = collection(db, 'vendors');
const categoryCollectionRef = collection(db, 'category');
const productCollectionRef = collection(db, 'products');

// Function to handle image uploads
export const uploadImages = async (images) => {
  const imageUrls = [];
  for (const image of images) {
    const imageRef = ref(imgDB, `images/${image.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);
    imageUrls.push(url);
  }
  return imageUrls;
};
// Function to add a new product
export const addProduct = async (product, CB) => {
  try {
    // Upload each image and get the URLs
    const imageUrls = product.images ? await uploadImages(product.images) : [];

    // Add the product to Firestore with the image URLs
    const productWithImages = { ...product, images: imageUrls };
    await addDoc(productCollectionRef, productWithImages);

    console.log('Product added successfully');
    CB && CB();
  } catch (error) {
    console.error('Error adding product:', error);
  }
};
// Function to fetch all products
export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(productCollectionRef);
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Ensure the id field is included
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Function to delete a product
export const deleteProduct = async (productId) => {
  try {
    if (!productId) {
      console.error('Error: productId is undefined or invalid.');
      return;
    }
    console.log(`Attempting to delete product with ID: ${productId}`);
    await deleteDoc(doc(db, 'products', productId));
    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

// Function to update a product
// export const updateProduct = async (productId, updatedProduct) => {
//   try {
//     const productRef = doc(db, 'products', productId);
//     await updateDoc(productRef, updatedProduct);
//     console.log('Product updated successfully');
//   } catch (error) {
//     console.error('Error updating product:', error);
//     throw error;
//   }
// };

export const updateProduct = async (productId, updatedProduct) => {
  try {
    const productRef = doc(db, 'products', productId);

    // Check if there are new images to upload
    if (updatedProduct.images && updatedProduct.images.length > 0) {
      const newImages = updatedProduct.images.filter(image => image instanceof File);
      const existingImages = updatedProduct.images.filter(image => typeof image === 'string');
      const uploadedImageUrls = await uploadImages(newImages);
      updatedProduct.images = [...existingImages, ...uploadedImageUrls];
    }
    await updateDoc(productRef, updatedProduct);
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Function to add a new vendor
export const addVendor = async (vendor) => {
  try {
    await addDoc(vendorCollectionRef, vendor);
    console.log('Vendor added successfully');
  } catch (error) {
    console.error('Error adding vendor:', error);
  }
};

// Function to fetch all vendors
export const fetchVendors = async () => {
  try {
    const querySnapshot = await getDocs(vendorCollectionRef);
    const vendors = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Ensure the id field is included
      ...doc.data(),
    }));
    return vendors;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
};

// Function to delete vendors
export const deleteVendor = async (vendorId) => {
  try {
    if (!vendorId) {
      console.error('Error: vendorId is undefined or invalid.');
      return;
    }
    console.log(`Attempting to delete vendor with ID: ${vendorId}`);

    await deleteDoc(doc(db, 'vendors', vendorId));
    console.log('Vendor deleted successfully');
  } catch (error) {
    console.error('Error deleting vendor:', error);
  }
}

// update Vendor 
export const updateVendor = async (vendorId, updatedData) => {
  try {
    const vendorRef = doc(collection(db, 'vendors'), vendorId);
    await updateDoc(vendorRef, updatedData);
    console.log('Vendor updated successfully');
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};

// Function to save category
export const saveCategory = async (values, editingItem, CB) => {
  try {
    let imageUrls = [];
    if (values.images && values.images.length > 0) {
      imageUrls = await uploadImages(values.images);
    }
    const docRef = editingItem ? doc(db, 'category', editingItem.key) : categoryCollectionRef;
    const saveOperation = editingItem
      ? updateDoc(docRef, { ...values, images: imageUrls })
      : addDoc(docRef, { ...values, images: imageUrls });

    // const savedDoc = await saveOperation;
    console.log(editingItem ? 'Category updated successfully' : 'Category added successfully');
    CB && CB()
    // return editingItem ? editingItem.key : savedDoc.id;
  } catch (error) {
    console.error('Error saving category:', error);
  }
};

// Function to save subcategory inside a specific category
export const saveSubcategory = async (categoryId, subcategoryData) => {
  try {
    let imageUrls = [];
    if (subcategoryData.images && subcategoryData.images.length > 0) {
      imageUrls = await uploadImages(subcategoryData.images);
    }
    const subCategoryRef = collection(doc(db, 'category', categoryId), 'subCategories'); // Sub-collection inside the category
    await addDoc(subCategoryRef, { ...subcategoryData, images: imageUrls });
    console.log('Subcategory added successfully inside the category');
  } catch (error) {
    console.error('Error saving subcategory:', error);
  }
};

// Function to fetch all categories and their subcategories
export const fetchCategoriesWithSubcategories = async () => {
  try {
    const querySnapshot = await getDocs(categoryCollectionRef);
    const categories = [];

    for (const categoryDoc of querySnapshot.docs) {
      const categoryData = categoryDoc.data();
      const subCategoriesSnapshot = await getDocs(collection(categoryDoc.ref, 'subCategories'));
      const subCategories = subCategoriesSnapshot.docs.map((subDoc) => ({
        key: subDoc.id,
        ...subDoc.data(),
      }));

      categories.push({
        key: categoryDoc.id,
        ...categoryData,
        subCategories,
      });
    }

    return categories;
  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    return [];
  }
};

// delete category 
export const deleteCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      console.error('Error: categoryId is undefined or invalid.');
      return;
    }
    console.log(`Attempting to delete category with ID: ${categoryId}`);

    await deleteDoc(doc(db, 'category', categoryId));
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error.message);
  }
}

// Function to delete a subcategory from Firebase
export const deleteSubcategory = async (categoryId, subcategoryId) => {
  try {
    if (!categoryId || !subcategoryId) {
      console.error('Error: categoryId or subcategoryId is undefined or invalid.');
      return;
    }
    console.log(`Attempting to delete subcategory with ID: ${subcategoryId} from category with ID: ${categoryId}`);

    // Reference to the specific subcategory document
    const subcategoryRef = doc(db, 'category', categoryId, 'subcategories', subcategoryId);

    // Delete the subcategory document
    await deleteDoc(subcategoryRef);
    console.log('Subcategory deleted successfully');
  } catch (error) {
    console.error('Error deleting subcategory:', error.message);
  }
}

// Function to update a category
// export const updateCategory = async (categoryId, updatedData) => {
//   try {
//     const categoryRef = doc(db, "category", categoryId); 
//     await updateDoc(categoryRef, updatedData);
//     console.log('Category updated successfully');
//   } catch (error) {
//     console.error('Error updating category:', error);
//     throw error;
//   }
// };
export const updateCategory = async (categoryId, updatedData) => {
  try {
    const categoryRef = doc(db, "category", categoryId);

    // Check if there are new images to upload
    if (updatedData.images && updatedData.images.length > 0) {
      const newImages = updatedData.images.filter(image => image instanceof File);
      const existingImages = updatedData.images.filter(image => typeof image === 'string');

      // Upload new images and get their URLs
      const uploadedImageUrls = await uploadImages(newImages);

      // Merge the uploaded image URLs with existing ones
      updatedData.images = [...existingImages, ...uploadedImageUrls];
    }

    // Update the category document in Firestore with new data
    await updateDoc(categoryRef, updatedData);
    console.log('Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// updadte subcategory 

export const updateSubcategory = async (categoryId, subcategoryId, updatedData) => {
  try {
    // Reference to the category document
    const categoryRef = doc(db, "category", categoryId);

    // Check if there are new images to upload
    if (updatedData.images && updatedData.images.length > 0) {
      const newImages = updatedData.images.filter(image => image instanceof File);
      const existingImages = updatedData.images.filter(image => typeof image === 'string');

      // Upload new images and get their URLs
      const uploadedImageUrls = await uploadImages(newImages);

      // Merge the uploaded image URLs with existing ones
      updatedData.images = [...existingImages, ...uploadedImageUrls];
    }

    // Update the subcategory document within the category
    await updateDoc(categoryRef, {
      [`subCategories.${subcategoryId}`]: updatedData
    });
    console.log('Subcategory updated successfully');
  } catch (error) {
    console.error('Error updating subcategory:', error);
    throw error;
  }
};