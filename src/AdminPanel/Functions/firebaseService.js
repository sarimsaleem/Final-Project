import { db, imgDB } from '../../Componentss/firebase/Firebase';
import { addDoc, doc, updateDoc, collection, getDocs, getDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const vendorCollectionRef = collection(db, 'vendors');
const categoryCollectionRef = collection(db, 'category');

// Function to handle image uploads
const uploadImages = async (images) => {
  const imageUrls = [];
  for (const image of images) {
    const imageRef = ref(imgDB, `images/${image.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);
    imageUrls.push(url);
  }
  return imageUrls;
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
    // Debugging step: Check if vendorId is correctly passed
    if (!vendorId) {
      console.error('Error: vendorId is undefined or invalid.');
      return;
    }

    console.log(`Attempting to delete vendor with ID: ${vendorId}`);

    // Correctly delete the document using the vendorId
    await deleteDoc(doc(db, 'vendors', vendorId));
    console.log('Vendor deleted successfully');
  } catch (error) {
    console.error('Error deleting vendor:', error);
  }
}

// update Vendor 
export const updateVendor = async (vendorId, updatedData) => {
  try {
    const vendorRef = doc(collection(db, 'vendors'), vendorId); // Reference to the specific vendor document
    await updateDoc(vendorRef, updatedData); // Update the document with new data
    console.log('Vendor updated successfully');
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};

// Function to save category
export const saveCategory = async (values, editingItem) => {
  try {
    let imageUrls = [];
    if (values.images && values.images.length > 0) {
      imageUrls = await uploadImages(values.images);
    }
    const docRef = editingItem ? doc(db, 'category', editingItem.key) : categoryCollectionRef;
    const saveOperation = editingItem
      ? updateDoc(docRef, { ...values, images: imageUrls })
      : addDoc(docRef, { ...values, images: imageUrls });

    const savedDoc = await saveOperation;
    console.log(editingItem ? 'Category updated successfully' : 'Category added successfully');
    return editingItem ? editingItem.key : savedDoc.id;
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

export const updateCategory = async (categoryId, updatedData) => {
  try {
    const categoryRef = doc(collection(db, "category"), categoryId)
    await updateDoc(categoryRef, updatedData)
    console.log('Category updated successfully');
  } catch (error) {
    console.error('Category updating vendor:', error);
    throw error
  }
}
