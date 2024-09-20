import { db, imgDB } from '../../Componentss/firebase/Firebase';
import { addDoc, doc, updateDoc, collection, getDocs, deleteDoc,  } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const COLLECTION_NAME = "subCategories";
const categoryCollectionRef = collection(db, 'category');

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
  
 // Function to save subcategory inside a specific category
export const AddSub = async (categoryId, subcategoryData, CB) => {
  try {
    let imageUrls = [];
    if (subcategoryData.images && subcategoryData.images.length > 0) {
      imageUrls = await uploadImages(subcategoryData.images);
    }
    const subCategoryRef = collection(doc(categoryCollectionRef, categoryId), COLLECTION_NAME);
    
    await addDoc(subCategoryRef, { ...subcategoryData, images: imageUrls });
    CB && CB()
    console.log('Subcategory added successfully inside the category');
  } catch (error) {
    console.error('Error saving subcategory:', error);
  }
};

  // Function to fetch all categories and their subcategories
  export const GetSub = async () => {
    try {
      const querySnapshot = await getDocs(categoryCollectionRef);
      const categories = [];
  
      for (const categoryDoc of querySnapshot.docs) {
        const categoryData = categoryDoc.data();
        console.log('categoryDatav',categoryData)
        const subCategoriesSnapshot = await getDocs(collection(categoryDoc.ref, COLLECTION_NAME));
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
  
  // Function to delete a subcategory from Firebase
  export const DeleteSub = async (categoryId, subcategoryId) => {
    try {
      if (!categoryId || !subcategoryId) {
        console.error('Error: categoryId or subcategoryId is undefined or invalid.');
        return;
      }
      console.log(`Attempting to delete subcategory with ID: ${subcategoryId} from category with ID: ${categoryId}`);
      const subcategoryRef = doc(db, 'category', categoryId, COLLECTION_NAME, subcategoryId);
      await deleteDoc(subcategoryRef);
      console.log('Subcategory deleted successfully');
    } catch (error) {
      console.error('Error deleting subcategory:', error.message);
    }
  }
  
  // updadte subcategory 
  export const UpdateSub = async (categoryId, subcategoryId, updatedData) => {
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
        console.log(categoryId,"categoryId",subcategoryId,"subcategoryId",updatedData,"updatedData" )
      await updateDoc(categoryRef, {
        [`subCategories.${subcategoryId}`]: updatedData
      });
      console.log('Subcategory updated successfully');
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  };