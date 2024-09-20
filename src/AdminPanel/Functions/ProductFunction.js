import { db, imgDB } from '../../Componentss/firebase/Firebase';
import { addDoc, doc, collection, getDocs, deleteDoc, updateDoc,} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
export const Add = async (product, CB) => {
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
export const Get = async () => {
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
export const Delete = async (productId) => {
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

export const Update = async (productId, updatedProduct) => {
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
  
 