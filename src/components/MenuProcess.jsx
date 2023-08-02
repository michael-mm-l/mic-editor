import { invoke } from "@tauri-apps/api/tauri";
import { open, save, confirm } from "@tauri-apps/api/dialog";
import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

export const newProcess = async (customCherry) => {
  let storage = globalThis.window.localStorage;
  if (customCherry.getValue().length > 0) {
    let path = storage.getItem("openFilePath");
    if (path == undefined) {
      const confirmed = await confirm(
        "New file has be modified save changes?",
        "Save Changes"
      );
      if (confirmed) {
        const filePath = await save({
          filters: [
            {
              name: "Markdown",
              extensions: ["md"],
            },
          ],
        });
        await writeTextFile(filePath, customCherry.getValue(), {
          dir: BaseDirectory.Document,
        });
      }
    } else {
      await writeTextFile(path, customCherry.getValue(), {
        dir: BaseDirectory.Document,
      });
    }
  }

  let aa = await invoke("writeFile", {
    fileName: "temp.md",
    context: [],
  });

  const contents = await readTextFile(aa);
  customCherry.setValue(contents, true);
  storage.removeItem("openFilePath");
};

export const openProcess = async (customCherry) => {
  const selected = await open({
    multiple: false,
    filters: [
      {
        name: "Markdown",
        extensions: ["md"],
      },
    ],
  });
  console.log(selected);
  let storage = globalThis.window.localStorage;
  storage.setItem("openFilePath", selected);

  if (selected != null) {
    const contents = await readTextFile(selected, {
      dir: BaseDirectory.AppConfig,
    });
    customCherry.setValue(contents, true);
  }
};

export const saveProcess = async (customCherry) => {
  const filePath = await save({
    filters: [
      {
        name: "Markdown",
        extensions: ["md"],
      },
    ],
  });
  await writeTextFile(filePath, customCherry.getValue(), {
    dir: BaseDirectory.Document,
  });
};

export const exportProcess = async (event, customCherry) => {
  customCherry.export(event.payload);
};

export const viewProcess = async (event, customCherry) => {
  let status = customCherry.getStatus();
  console.log(status);
  customCherry.switchModel(event.payload);
  customCherry.refreshPreviewer();
};

export const installProcess = async (event, customCherry) => {
  const selected = await open({
    multiple: false,
    filters: [
      {
        name: "*",
        extensions: ["*"],
      },
    ],
  });
  console.log(selected);

  let nameArry = selected.split(".");
  const appDataDirPath = await appDataDir();

  let aa = await invoke("fileCopy", {
    path: appDataDirPath,
    file: selected,
    fileType: nameArry[nameArry.length - 1],
  });
  console.log(aa);
};

export const helpProcess = async () => {};

export const editProcess = async () => {};
