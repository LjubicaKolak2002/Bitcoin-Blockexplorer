import React from "react";
import { BeatLoader } from "react-spinners";

const LoadingComponent = () => {
  const loaderStyles = {
    display: "flex",
    justifyContent: "center", 
    alignItems: "center",     
    height: "100vh",          
  };

  return (
    <div style={loaderStyles}>
      <BeatLoader color="#14236e" size={20} />
    </div>
  );
};

export default LoadingComponent;
