// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
use db::{Todo, get_todos, add_todo, update_todo, delete_todo};

#[tauri::command]
fn get_all_todos() -> Result<Vec<Todo>, String> {
    get_todos().map_err(|err| err.to_string())
}

#[tauri::command]
fn create_todo(title: String, description: Option<String>, completed: bool) -> Result<i32, String> {
    let todo = Todo{
        id: None,
        title,
        description,
        completed: Some(false),
        created_at: None,
    };

    add_todo(todo).map_err(|err| err.to_string())
}

#[tauri::command]
fn toggle_todo(id: i32, completed: bool, title: String, description: Option<String>) -> Result<(), String> {
    let todo = Todo{
        id: Some(id),
        title,
        description,
        completed: Some(completed),
        created_at: None,
    };

    update_todo(todo).map_err(|err| err.to_string())
}

#[tauri::command]
fn remove_todo(id: i32) -> Result<(), String> {
    delete_todo(id).map_err(|err| err.to_string())
}

fn main(){
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_all_todos,
            create_todo,
            toggle_todo,
            remove_todo,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
