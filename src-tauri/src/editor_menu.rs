use tauri::{CustomMenuItem, Menu , Submenu};   
 
pub fn app_menu() -> Menu{
    let export = Submenu::new("Export", Menu::new()
        .add_item(CustomMenuItem::new("pdf".to_string(), "PDF"))
        .add_item(CustomMenuItem::new("html".to_string(), "HTML"))
        .add_item(CustomMenuItem::new("screenShot".to_string(), "IMG"))
        .add_item(CustomMenuItem::new("markdown".to_string(), "MD")));

    let view = Submenu::new("View", Menu::new()
        .add_item(CustomMenuItem::new("previewOnly", "Preview"))
        .add_item(CustomMenuItem::new("edit&preview", "Edit|Preview"))
        .add_item(CustomMenuItem::new("editOnly", "Edit")));

    let menu = Menu::new().add_item(CustomMenuItem::new("New", "New"))
        .add_item(CustomMenuItem::new("Open", "Open"))
        .add_item(CustomMenuItem::new("Save", "Save"))
        .add_submenu(export)
        .add_submenu(view)
        .add_item(CustomMenuItem::new("Help", "Help"));

    menu
}   
