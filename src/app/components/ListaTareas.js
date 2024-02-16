'use local'
import { useReducer, useRef, useEffect } from "react";

const ListaTareas = () => {
    const inputRef = useRef();

    const tasksReducer = (state = [], action) => {
        switch (action.type) {
            case 'add_task': {
                const newTask = { id: state.length, title: action.title };
                const newState = [...state, newTask];
                saveTasksToLocalStorage(newState);
                return newState;
            }
            case 'remove_task': {
                const newState = state.filter((task, index) => index !== action.index);
                saveTasksToLocalStorage(newState);
                return newState;
            }
            case 'initialize_tasks': {
                return action.tasks;
            }
            default: {
                return state;
            }
        }
    };

    const saveTasksToLocalStorage = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const [tasks, dispatch] = useReducer(tasksReducer, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch({
            type: 'add_task',
            title: inputRef.current.value
        });
        inputRef.current.value = ""; 
    };

    useEffect(() => {
        try {
            const storedTasks = JSON.parse(localStorage.getItem('tasks'));
            if (storedTasks) {
                dispatch({ type: 'initialize_tasks', tasks: storedTasks });
            }
        } catch (error) {
            console.error("Error al recuperar desde localStorage:", error);
        }
    }, []);

    return (
        <div className="container-task">
            <h1 className="title-task">Lista de tareas</h1>
            <form className="form-task" onSubmit={handleSubmit}>
                <label>Tarea</label>
                <input type="text" name="title" ref={inputRef} />
                <input className="button-task" type="submit" value="Enviar" />
            </form>
            <div className="tasks">
                {tasks && tasks.map((task, index) => (
                    <div className="task" key={index}>
                        <p>{task.title}</p>
                        <button onClick={() => dispatch({ type: 'remove_task', index })}>
                            Borrar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListaTareas;
