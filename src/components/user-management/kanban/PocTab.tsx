import React, { useState } from "react";
import TinyMCEEditor from "./TinyMCEEditor";

interface PocTabProps {
  readOnly?: boolean;
}

const PocTab: React.FC<PocTabProps> = ({ readOnly = false }) => {
  const [content, setContent] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sint iste vitae doloremque, perferendis autem nemo, ratione laboriosam ad distinctio, nesciunt pariatur. Optio minima dolores eum ipsam libero delectus ullam "
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

export default PocTab;