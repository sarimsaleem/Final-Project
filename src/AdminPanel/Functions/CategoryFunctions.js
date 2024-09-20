import { db, imgDB } from '../../Componentss/firebase/Firebase';
import { addDoc,setDoc, doc, updateDoc, collection, getDocs, getDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const COLLECTION_NAME = "category"
const categoryCollectionRef = collection(db, COLLECTION_NAME);



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


// Function to save category
export const Add = async (values, editingItem, CB) => {
  try {
    let imageUrls = [];
    console.log('values',values)
    if (values.images && values.images.length > 0) {
      imageUrls = await uploadImages(values.images);
    }
    const docRef = categoryCollectionRef;
    // addDoc(docRef, { ...values, images: imageUrls });
    setDoc(doc(db, COLLECTION_NAME, values?._id), { ...values, images: imageUrls });

    // const savedDoc = await saveOperation;
    console.log('Category added successfully');
    CB && CB()
  } catch (error) {
    console.error('Error saving category:', error);
  }
};
export const Fetch = async () => {
  try {
    const querySnapshot = await getDocs(categoryCollectionRef);
    const categories = [];

    for (const categoryDoc of querySnapshot.docs) {
      const categoryData = categoryDoc.data();
      console.log('categoryDatav',categoryData)
      const subCategoriesSnapshot = await getDocs(collection(categoryDoc.ref, 'subCategories'));
      const subCategories = subCategoriesSnapshot.docs.map((subDoc) => {
        console.log('subDoc',subDoc)
        return ({
          key: subDoc.id,
          ...subDoc.data(),
        })
      });

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

export const Delete = async (categoryId, CB) => {
  console.log(categoryId, "categoryId");
  try {
    if (!categoryId) {
      console.error('Error: categoryId is undefined or invalid.');
      return;
    }

    const categoryRef = doc(db, 'category', categoryId);
    console.log(`Attempting to delete category with path: ${categoryRef.path}`);

    await deleteDoc(categoryRef);
    CB && CB()
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error.message);
  }
};

export const Update = async (categoryId, updatedData) => {
  try {
    const categoryRef = doc(db, "category", categoryId);

    // Check if there are new images to upload
    if (updatedData.images && updatedData.images.length > 0) {
      const newImages = updatedData.images.filter(image => image instanceof File);
      const existingImages = updatedData.images.filter(image => typeof image === 'string');
      const uploadedImageUrls = await uploadImages(newImages);
      updatedData.images = [...existingImages, ...uploadedImageUrls];
    }

    await updateDoc(categoryRef, updatedData);
    console.log('Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};