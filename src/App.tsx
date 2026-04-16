import { useState, useEffect } from 'react'
import './App.css'

interface Task {
    text: string;
    completed: boolean;
}

function App() {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks = localStorage.getItem("my-tasks");
        if (savedTasks) {
            try {
                return JSON.parse(savedTasks);
            } catch (e) {
                console.error("Failed to parse tasks");
            }
        }
        return [];
    });
    const [inputValue, setInputValue] = useState('');

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("my-tasks", JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = () => {
        if (inputValue.trim() !== '') {
            setTasks([...tasks, { text: inputValue.trim(), completed: false }]);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddTask();
        }
    };

    const toggleTask = (indexToToggle: number) => {
        setTasks(tasks.map((task, index) => {
            if (index === indexToToggle) {
                return { ...task, completed: !task.completed };
            }
            return task;
        }));
    };

    const deleteTask = (indexToDelete: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setTasks(tasks.filter((_, index) => index !== indexToDelete));
    };

    return (
        <div id="app">
            <h1>My tasks</h1>

            <div className="input-group">
                <input 
                    type="text" 
                    id="todo-input" 
                    placeholder="need to do?" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button id="add-btn" onClick={handleAddTask}>Add</button>
            </div>

            <ul id="todo-list">
                {tasks.map((task, index) => (
                    <li 
                        key={index} 
                        className={task.completed ? "completed" : ""}
                        onClick={() => toggleTask(index)}
                    >
                        <span>{task.text}</span>
                        <button 
                            className="delete-btn" 
                            onClick={(e) => deleteTask(index, e)}
                        >
                            ✖
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App
