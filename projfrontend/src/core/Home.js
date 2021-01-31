import React,{useEffect,useState} from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import img from  '../logo_helpMe/image.jpg'

export default function Home() {
    

  return (
    <Base title="Welcome helpMe" description="Admin Dashboard">
      <div className="row text-center">
        <div className="col-12 text-center pd-3">
       <h5 className="text-white">
        HEY , WE ARE HERE TO SERVE OUR SOCIETY........
       </h5>
       <img src={img} width={300} alt="proble with image"/>
       </div>
       
      </div>
    </Base>
  );
}
