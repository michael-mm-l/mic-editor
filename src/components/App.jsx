import { useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";
import customCherry from "./CustomCherry";
import "cherry-markdown/dist/cherry-markdown.css";
import {
  newProcess,
  openProcess,
  saveProcess,
  viewProcess,
  exportProcess,
  installProcess,
  helpProcess,
  editProcess,
} from "./MenuProcess";

const App = () => {
  useEffect(() => {
    const unListen = appWindow.listen("tauri://menu", (event) => {
      if (event.payload === "New") {
        newProcess(customCherry);
      } else if (event.payload === "Open") {
        openProcess(customCherry);
      } else if (event.payload === "Save") {
        saveProcess(customCherry);
      } else if (event.payload === "Edit") {
        editProcess(customCherry);
      } else if (
        event.payload === "pdf" ||
        event.payload === "html" ||
        event.payload === "screenShot" ||
        event.payload === "markdown"
      ) {
        exportProcess(event, customCherry);
      } else if (event.payload === "Help") {
        helpProcess(customCherry);
      } else if (
        event.payload === "previewOnly" ||
        event.payload === "edit&preview" ||
        event.payload === "editOnly"
      ) {
        viewProcess(event, customCherry);
      } else if (
        event.payload === "Image" ||
        event.payload === "Audio" ||
        event.payload === "Video" ||
        event.payload === "PdfFile" ||
        event.payload === "Word"
      ) {
        installProcess(event, customCherry);
      }
    });

    return () => {
      unListen.then((f) => f());
    };
  }, []);

  return <></>;
};

export default App;
