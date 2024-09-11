import { db, imgDB } from '../../Componentss/firebase/Firebase'; 
import { addDoc, doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const vendorCollectionRef = collection(db, 'vendors');
const categoryCollectionRef = collection(db, 'category');

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
    const vendors = querySnapshot.docs.map((doc, index) => ({
      key: index + 1,
      ...doc.data(),
    }));
    return vendors;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
};

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