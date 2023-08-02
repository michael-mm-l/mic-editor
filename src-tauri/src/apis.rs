use std::collections::HashMap;
use std::path::Path;
use std::fs::{self, File};
use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;
use std::io::{Write, BufReader, BufRead, Error};
/// 创建文件夹
#[tauri::command]
pub fn createDir(path: String)->String{
    let newPath = format!("{}/{}", path, "Data".to_string());
    let dataDir = Path::new(&newPath);
    if !dataDir.exists() {
      fs::create_dir_all(dataDir).unwrap();
    }
    newPath
}

#[tauri::command]
pub fn writeFile(context: Vec<u8>, fileName: String)->String{
  
   let source_path = Path::new("/");
    if !source_path.exists() {
      fs::create_dir_all(source_path).unwrap();
    }
   
   let tat = format!("/{}",&fileName);
   File::create(&tat).unwrap();
   fs::write(&tat, context).unwrap();
   tat
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn file_copy(path: String, file: String, fileType: String)-> String{
    let source = format!("{}{}", path, "Source".to_string());
    let source_path = Path::new(&source);
    if !source_path.exists() {
      fs::create_dir_all(source_path).unwrap();
    }
    println!("{}",&source);
    let rand_string: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(10)
        .map(char::from)
        .collect();
    let newFile = format!("{}\\{}.{}", source, &rand_string,fileType);
    fs::copy(file,&newFile).unwrap();
    newFile
}