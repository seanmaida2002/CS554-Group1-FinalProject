import React from "react"
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notFoundDiv">
      <h1>Error: Page not Found!</h1>
      <Link to='/'>Go Home</Link>
    </div>
  )
};

export default NotFound;
