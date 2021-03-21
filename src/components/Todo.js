import React, { useState } from 'react';
import './Todo.css';


function Task({ task, index, completeTask, removeTask, display }) {
    return (
        display ?
            (<div
                className="task"
            >
                {task.title}
                <button style={{ background: "red" }} onClick={() => removeTask(index)}>x</button>
                <button style={task.completed ? { background: "green" } : {}} onClick={() => completeTask(index)}>C</button>

            </div>) : null
    );
}

function CreateTask({ addTask, filterTasks }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTask(value);
        setValue("");
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                placeholder="Enter your friend's name"
                onChange={e => setValue(e.target.value)}
                onKeyUp={e => filterTasks(e.target.value)}
            />
        </form>
    );
}

function Todo() {
    const [tasks, setTasks] = useState([
        {
            title: "Rahul Gupta",
            show: true,
            completed: true
        },
        {
            title: "Shivangi Sharma",
            show: true,
            completed: true
        },
        {
            title: "Akash singh",
            show: true,
            completed: false
        },
        {
            title: "Rahul Gupta1",
            show: true,
            completed: true
        },
        {
            title: "Shivangi Sharma1",
            show: true,
            completed: true
        },
        {
            title: "Akash singh1",
            show: true,
            completed: false
        },
        {
            title: "Rahul Gupta2",
            show: true,
            completed: true
        },
        {
            title: "Shivangi Sharma2",
            show: true,
            completed: true
        },
        {
            title: "Akash singh2",
            show: true,
            completed: false
        },
        {
            title: "Rahul Gupta3",
            show: true,
            completed: true
        },
        {
            title: "Shivangi Sharma3",
            show: true,
            completed: true
        },
        {
            title: "Akash singh3",
            show: true,
            completed: false
        }
    ]);

    const [currentPage, setCurrentPage] = useState(1);

    const [todosPerPage, setTodosPerPage] = useState(4);

    const addTask = title => {
        const newTasks = [...tasks, { title, completed: false }];
        newTasks.sort((a, b) => a.completed - b.completed)
        setTasks(newTasks);
    };

    const completeTask = index => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        newTasks.sort((a, b) => a.completed - b.completed)
        setTasks(newTasks);
    };

    const removeTask = index => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
    };

    const filterTasks = text => {
        let newTasks = [...tasks];
        if (text.length === 0) {
            newTasks.forEach(value => {
                value.show = true;
            })
            setTasks(newTasks);
            return;
        }
        newTasks.forEach(el => el.show = el.title.toLowerCase().includes(text));
        newTasks.sort((a, b) => a.completed - b.completed)
        setTasks(newTasks);
    }

    const pageNumbers = [];
    const availableTasks = tasks.filter(el => el.show);
    for (let i = 1; i <= Math.ceil(availableTasks.length / todosPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <li
                style={number === currentPage ? {background: 'green', borderRadius: 5, padding: 3} : {padding: 3}}
                key={number}
                id={number}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </li>
        );
    });

    function handleChange (event)  {
        setTodosPerPage(event.target.value);
    }

    // Logic for displaying current todos
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = tasks.sort((a, b) => a.completed - b.completed).slice(indexOfFirstTodo, indexOfLastTodo);

    return (
        <div className="todo-container">
            <div className="create-task" >
                <CreateTask addTask={addTask} filterTasks={filterTasks} />
            </div>
            <div className="tasks">
                {currentTodos.map((task, index) => (
                    <Task
                        task={task}
                        index={index}
                        completeTask={completeTask}
                        removeTask={removeTask}
                        key={index}
                        display={task.show}
                    />
                ))}
            </div>
            <div style={{display: 'flex'}}>
                <ul id="page-numbers">
                    {renderPageNumbers}
                </ul>

                <div style={{marginLeft: 'auto', padding: 20}}><select
                    defaultValue={todosPerPage}
                    onChange={handleChange}
                >
                    {
                        [3, 4, 5].map(item => {
                            return (
                                <option value={item} key={item}>{item}</option>
                            )
                        })
                    }
                </select></div>
            </div>
        </div>
    );
}

export default React.memo(Todo);