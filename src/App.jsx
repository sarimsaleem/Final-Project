
// import LoginSignup from "./Componentss/Login/LoginSignup"
// import Success from "./Componentss/SuccessPage/Success"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
// import Header from "./Componentss/Header/Header";
// import Crousel from "./Componentss/Crousel/Crousel";
// import Footer from "./Componentss/Footer/Footer";
// import ForgetPassword from "./Componentss/Login/forgetPassword";

import Product from "./AdminPanel/Products/Product"
import Category from './AdminPanel/Category/Category';
import Vendor from "./AdminPanel/Vendors/Vendor";
function App() {

  return (
    <>
      <Router>
        <Routes>
         <Route path='/' element={<Product />} /> 
         <Route path='/category' element={<Category />} /> 
         <Route path='/vendor' element={<Vendor />} /> 
        </Routes>
      </Router>
      {/* <Footer /> */}
      {/* <Header/> */}
      {/* <Crousel /> */}
      {/* <Route path="/" element={<LoginSignup />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/uccess" element={<Success />} /> */}
    </>
  )
}

export default App
