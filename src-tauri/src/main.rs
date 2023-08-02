// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod apis;
mod editor_menu;

use apis::{greet, createDir,file_copy, writeFile};


fn main() {

    tauri::Builder::default()
        .menu(editor_menu::app_menu())
        .invoke_handler(tauri::generate_handler![greet,createDir, file_copy, writeFile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
