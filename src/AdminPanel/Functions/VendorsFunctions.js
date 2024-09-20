import { db, imgDB } from '../../Componentss/firebase/Firebase';
import { addDoc, doc, updateDoc, collection, getDocs, getDoc, deleteDoc, query, where } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const vendorCollectionRef = collection(db, 'vendors');


// Function to add a new vendor
export const Add = async (vendor) => {
  try {
    await addDoc(vendorCollectionRef, vendor);
    console.log('Vendor added successfully');
  } catch (error) {
    console.error('Error adding vendor:', error);
  }
};

// Function to fetch all vendors
export const Fetch = async () => {
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
export const Delete = async (vendorId) => {
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
export const Update = async (vendorId, updatedData) => {
  try {
    const vendorRef = doc(collection(db, 'vendors'), vendorId);
    await updateDoc(vendorRef, updatedData);
    console.log('Vendor updated successfully');
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};