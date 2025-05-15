import { HTML5Backend } from "react-dnd-html5-backend";
import Editor from "../components/View/Editor";
import { DndProvider } from "react-dnd";
import React from "react";
import image from "../assets/images/image.jpg";
const Workshop = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Editor />
      <img
        src={image}
        alt="example"
        style={{
          width: "100px",
          height: "100px",
          position: "absolute",
          top: "50px",
          left: "50px",
        }}
      />
    </DndProvider>
  );
};

export default Workshop;
