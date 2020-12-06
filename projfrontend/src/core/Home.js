import React,{useEffect,useState} from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";

export default function Home() {
    

  return (
    <Base title="WELCOME helpMe" description="Admin Dashboard">
      <div className="row text-center">
        <div className="col-12 text-center">
       <h3 className="text-white">
        HEY , WE ARE HERE TO SERVE OUR SOCIETY........
       </h3>
       </div>
       
      </div>
    </Base>
  );
}
