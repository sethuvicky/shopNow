import React from "react";
import { Link } from "react-router-dom";
import Logo from "../src/images/headerlogo.png"
const Footer = () => {
  return (
    <div className="Footer flex space__around pz__15" style={{"borderTop":".3px solid rgba(21,21,21,0.5)"}}>
      {/* Footer 1st part */}
      <div className="footer1st">
        <img
        alt='logo'
          src={`${Logo}`}
          style={{ cursor: "pointer",width:"100px" }}
        />
     
 


   
      </div>
      {/* Footer 2nd part */}
  
    </div>
  );
};

export default Footer;
