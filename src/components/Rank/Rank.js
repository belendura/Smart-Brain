import React from "react";

const Rank = ({name, entries})=>{
    
    return(
             
        <div className="white f1">
          {`${name} your current rank is....`}
          <div>
          {entries} 
          </div>    
        </div>
           
        );
}

export default Rank;      