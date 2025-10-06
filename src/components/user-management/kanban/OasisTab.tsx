import React, { useState } from "react";
import TinyMCEEditor from "./TinyMCEEditor";

interface OasisTabProps {
  readOnly?: boolean;
}

const OasisTab: React.FC<OasisTabProps> = ({ readOnly = false }) => {
  const [content, setContent] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi fugit cumque, voluptas obcaecati hic nam similique velit provident voluptatum eos, ut quo unde, est dolor. Cumque corrupti fugiat culpa sit."
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <TinyMCEEditor 
          value={content} 
          onChange={setContent} 
          height={400} 
          readOnly={readOnly} 
        />
      </div>
    </div>
  );
};

export default OasisTab;