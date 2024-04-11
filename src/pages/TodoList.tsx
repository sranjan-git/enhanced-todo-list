import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  
  // Initially I tried implementing night mode feature, but as it was not looking good, hence removed.
  const [nightMode, setNightMode] = useState(false);

  // Toggle night mode
  const toggleNightMode = () => {
    setNightMode(!nightMode);
  };

  useEffect(() => {
    // Add or remove the 'night-mode' class from the body element
    if (nightMode) {
      document.body.classList.add("night-mode");
    } else {
      document.body.classList.remove("night-mode");
    }
  }, [nightMode]);

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    console.log("Loaded tasks from localStorage:", storedTasks);
    setTasks(storedTasks);
    console.log("direct", localStorage.getItem("tasks"));
  }, []);

  useEffect(() => {
    // Save tasks to localStorage when tasks change
    // console.log('Saving tasks:', tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add Task
  const addTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        description: newTaskDescription,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setNewTaskDescription("");
    }
  };

  // Toggle Task Completion
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete Task
  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Edit Task Title
  const editTaskTitle = (taskId: number, newTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      )
    );
  };

  // Edit Task Description
  const editTaskDescription = (taskId: number, newDescription: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, description: newDescription } : task
      )
    );
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (filter === "active") {
      return !task.completed;
    } else {
      return task.completed;
    }
  });

  return (
    <div className={`todo-list ${nightMode ? "night-mode" : ""}`}>
      <h1>My Tasks 📝</h1>
      <input
        className="wFull"
        type="text"
        placeholder="Enter task name"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />

      <input
        className="wFull"
        type="text"
        placeholder="Enter task description (optional)"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
      />
      <button onClick={addTask} className="addTask">
        Add Task
      </button>
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <div className="flex1">
              <input
                className="inlineBlock"
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <div className="inlineBlock">
                <span
                  className={task.completed ? "completed" : ""}
                  contentEditable
                  onBlur={(e) => editTaskTitle(task.id, e.target.innerText)}
                >
                  {task.title}
                </span>
                <br />
                <span
                  className={task.completed ? "completed" : ""}
                  contentEditable // Make the span editable
                  onBlur={(e) =>
                    editTaskDescription(task.id, e.target.innerText)
                  } // Save changes when focus is lost
                  suppressContentEditableWarning // Suppress content editable warning
                >
                  {task.description}
                </span>
              </div>
            </div>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <footer className="footer">
        <p>
          Made with{" "}
          <span role="img" aria-label="Heart">
            ❤️
          </span>{" "}
          by{" "}
          <a href="https://www.linkedin.com/in/sudhanshu-ranjan-7a3305216/">
            Sudhanshu Ranjan
          </a>
        </p>
      </footer>

      {/* <button className="night-mode-toggle" onClick={toggleNightMode}>
        {nightMode ? "Light Mode" : "Night Mode"}
      </button> */}
    </div>
  );
};

export default TodoList;
