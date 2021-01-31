import React from "react";
import Menu from "./Menu";

const Base = ({
  title = "My Title",
  description = "My Desription",
  className = "bg-dark text-white p-4",
  children
}) => (
  <div>
    <Menu/>
    
    <div className="container-fluid">
      <div className="jumbotron bg-white text-white text-center">
        <h2 className="font-weight-bold text-lg text-success"> {title}</h2>
        <h5 className=" text-danger">{description}</h5>
      </div>
      <div className={className}>{children}</div>
    </div>
    <footer className="footer bg-white mt-auto py-3">
      <div className="container-fluid bg-success text-white text-center py-3">
        <h5>Feel free for any Suggestion</h5>
        <a href="mailto:vishuchhabra1016@gmail.com"><button className="btn btn-warning btn-lg">Contact Us</button></a>
      </div>
      <div className="container">
        <span className="text-success">
          <h6> <span className="text-danger">helpMe</span> - Small startUp At Panjab University</h6>
        </span>
      </div>
    </footer>
  </div>

);

export default Base;
