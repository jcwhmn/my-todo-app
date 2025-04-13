use mysql::*;
use mysql::prelude::*;
use serde::{Serialize, Deserialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Todo {
  pub id: Option<i32>,
  pub title: String,
  pub description: Option<String>,
  pub completed: Option<bool>,
  pub created_at: Option<String>,
}

pub fn get_connection() -> Result<mysql::Pool> {
  let database_url = "mysql://root:root@localhost:3306/todo_app".to_string();
  Pool::new(database_url.as_str())
}

pub fn get_todos() -> Result<Vec<Todo>> {
  let pool = get_connection()?;
  let mut conn = pool.get_conn()?;

  let todos = conn.query_map(
    "SELECT id, title, description, completed, created_at FROM todos ORDER BY created_at DESC",
    |(id, title, description, completed, created_at)| {
      Todo {
        id: Some(id),
        title,
        description,
        completed,
        created_at,
      }
    }
  )?;

  Ok(todos)
}

pub fn add_todo(todo: Todo) -> Result<i32> {
  let pool = get_connection()?;
  let mut conn = pool.get_conn()?;
  conn.exec_drop(
    "INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)",
    (todo.title, todo.description, todo.completed.unwrap_or(false)),
  )?;

  let last_id = conn.last_insert_id();
  Ok(last_id as i32)
}

pub fn update_todo(todo: Todo) -> Result<()> {
  let pool = get_connection()?;
  let mut conn = pool.get_conn()?;

  conn.exec_drop(
    "UPDATE todos set title = ?, description = ?, completed = ? WHERE id = ?",
    (todo.title, todo.description, todo.completed.unwrap_or(false), todo.id.unwrap()),
  )?;

  Ok(())
}

pub fn delete_todo(id: i32) -> Result<()> {
  let pool = get_connection()?;
  let mut conn = pool.get_conn()?;

  conn.exec_drop(
    "DELETE FROM todos WHERE id = ?", (id,)
  )?;

  Ok(())
}