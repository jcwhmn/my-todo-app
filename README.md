# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## MySQL

在本地运行一个MySQL实例,用户名和密码: root/root

创建一个数据库:   todo_app
创建表:

```sql
CREATE TABLE `todos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `completed` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLA
```

## 运行

需要在本机已安装rust和npm

从github clone本项目后,执行下面的命令分别安装依赖和运行

```bash
pnpm install       # 安装前端依赖（首次下载后）
pnpm tauri dev     # 同时运行前端 (Vite) 和后端 (Rust)
```
