import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link,Redirect } from "react-router-dom";
import { getCategories, getProduct, updateProduct } from "./helper/adminapicall";
import { isAutheticated } from "../auth/helper/index";
import { API } from "../backend";


const UpdateProduct = ({match}) => {
  const { user, token } = isAutheticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    amountDonated: "",
    address: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getaRedirect: false,
    formData: ""
  });

  const {
    name,
    description,
    amountDonated,
    address,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getaRedirect,
    formData
  } = values;

  const preload = (productId) => {
    getProduct(productId).then(data => {
      //console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ 
            ...values ,
            name:data.name,
            description:data.description,
            amountDonated : data.amountDonated,
            category:data.category._id,
            address : data.address,
            formData:new FormData()
            
        });
        preloadCategories();
      }
    });
  };
  const preloadCategories  =()=> {
       getCategories().then(data=>{
       if(data.error){
         setValues({ ...values, error: data.error });
       }
       else{
           setValues({
               categories:data, 
               formData : new FormData()
           })
       }

       })
  }

  useEffect(() => {
    preload(match.params.productId);
  }, []);

  const onSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    
    updateProduct(match.params.productId,user._id, token, formData).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error ,loading:false ,getaRedirect:true});
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          amountDonated: "",
          photo: "",
          address: "",
          loading: false,
          createdProduct: data.name,
          getaRedirect:true
        });
      }
    });
  };


  const handleChange = name => event => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: createdProduct ? "" : "none" }}

    >
      
    <h4>{createdProduct} Updated Successfully</h4>
      
    </div>
     
    
  );
  const warningMessage = () => {
    if (error) {
      return <h4 className="text-danger">Failed To Update This Post</h4>;
    }
  };
  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
  };

  const RedirectTime =() =>{
    setTimeout(function(){
      window.location.href = '#/admin/dashboard';
   }, 1000);
   }
  
   const redirect = () => {
     
       if( getaRedirect ){
         return  RedirectTime()
        } 
   }
  
  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("amountDonated")}
          type="number"
          className="form-control"
          placeholder="amountDonated"
          value={amountDonated}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Select Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("address")}
          type="text"
          className="form-control"
          placeholder="address"
          value={address}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Post
      </button>
    </form>
  );

  return (
    <Base
      title="Welcome helpMe"
      description="Update Posts here..."
      className="container bg-success p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {loadingMessage()}
          {redirect()}
          {successMessage()}
          {warningMessage()}
          {createProductForm()}
          
          </div>
      </div>
    </Base>
  );
};

export default UpdateProduct;
