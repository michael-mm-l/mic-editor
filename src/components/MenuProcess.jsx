import { invoke } from "@tauri-apps/api/tauri";
import { open, save, confirm } from "@tauri-apps/api/dialog";
import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { getCurrent } from "@tauri-apps/api/window";

export const newProcess = async (customCherry) => {
  let storage = globalThis.window.localStorage;
  let flg = storage.getItem("flg");
  if (customCherry.getValue().length > 0) {
    let path = storage.getItem("name");
    if (flg == undefined || flg == 1) {
      const confirmed = await confirm(
        "New file has be modified save changes?",
        "Save Changes"
      );
      if (confirmed) {
        path = await save({
          filters: [
            {
              name: "Markdown",
              extensions: ["md"],
            },
          ],
        });
      }
    }
    await writeTextFile(path, customCherry.getValue(), {
      dir: BaseDirectory.Document,
    });
  }
  customCherry.setValue("", true);
  let currentWin = getCurrent();
  currentWin.setTitle("untitled.md");
  storage.setItem("name", "untitled.md");
  storage.setItem("flg", 1);
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
  if (selected != null) {
    const contents = await readTextFile(selected, {
      dir: BaseDirectory.AppConfig,
    });
    customCherry.setValue(contents, true);

    let currentWin = getCurrent();
    currentWin.setTitle(selected);

    let storage = globalThis.window.localStorage;
    storage.setItem("name", selected);
    storage.setItem("flg", 0);
  }
};

export const saveProcess = async (customCherry) => {
  let storage = globalThis.window.localStorage;
  let flg = storage.getItem("flg");
  let path = "";
  if (flg == 1) {
    path = await save({
      filters: [
        {
          name: "Markdown",
          extensions: ["md"],
        },
      ],
    });
  } else {
    path = storage.getItem("name");
  }

  await writeTextFile(path, customCherry.getValue(), {
    dir: BaseDirectory.Document,
  });
  storage.setItem("name", path);
  let win = getCurrent();
  win.setTitle(path);
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

export const helpProcess = async () => {
  let aa = getCurrent();
  aa.setTitle("aaa *");
};

export const editProcess = async () => {};
