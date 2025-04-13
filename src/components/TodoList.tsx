import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

// Define the Todo interface
interface Todo {
    id?: number;
    title: string;
    description?: string;
    completed?: boolean;
    created_at?: string;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');
    const [newDescription, setNewDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch todos on component mount
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async (): Promise<void> => {
        try {
            setLoading(true);
            const result = await invoke<Todo[]>('get_all_todos');
            setTodos(result);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch todos:', err);
            setError('Failed to load todos. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (e: React.FormEvent): Promise<void> => {
        console.log(newTodo);
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            await invoke<number>('create_todo', {
                title: newTodo,
                description: newDescription || null,
                completed: false
            });

            setNewTodo('');
            setNewDescription('');
            fetchTodos();
        } catch (err) {
            console.error('Failed to add todo:', err);
            setError('Failed to add todo. Please try again.');
        }
    };

    const toggleTodoStatus = async (todo: Todo): Promise<void> => {
        if (todo.id === undefined) return;

        try {
            await invoke('toggle_todo', {
                id: todo.id,
                completed: !todo.completed,
                title: todo.title,
                description: todo.description
            });
            fetchTodos();
        } catch (err) {
            console.error('Failed to update todo:', err);
            setError('Failed to update todo status. Please try again.');
        }
    };

    const deleteTodo = async (id: number): Promise<void> => {
        try {
            await invoke('remove_todo', { id });
            fetchTodos();
        } catch (err) {
            console.error('Failed to delete todo:', err);
            setError('Failed to delete todo. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Todo List</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={addTodo} className="mb-6">
                <div className="mb-4">
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Add a new todo..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                    />
                </div>
                <div className="mb-4">
              <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Description (optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
              />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Add Todo
                </button>
            </form>

            {loading ? (
                <p>Loading todos...</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {todos.length === 0 ? (
                        <p className="py-4 text-gray-500">No todos yet. Add one above!</p>
                    ) : (
                        todos.map((todo) => (
                            <li key={todo.id} className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleTodoStatus(todo)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="ml-3">
                                            <p className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                {todo.title}
                                            </p>
                                            {todo.description && (
                                                <p className="text-sm text-gray-500">{todo.description}</p>
                                            )}
                                            {todo.created_at && (
                                                <p className="text-xs text-gray-400">{new Date(todo.created_at).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => todo.id !== undefined && deleteTodo(todo.id)}
                                        className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default TodoList;