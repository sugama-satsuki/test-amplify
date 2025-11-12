import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import UserGroupAdmin from "./Admin";

const client = generateClient<Schema>();

function App({ signOut, user, onSignUp }: { signOut?: () => void, user?: any, onSignUp?: (role: string) => Promise<void> }) {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    const role = localStorage.getItem('signup_role');
    if (user && role && onSignUp) {
      onSignUp(role);
      localStorage.removeItem('signup_role');
    }
  }, [user, onSignUp]);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
            key={todo.id}
            onClick={() => deleteTodo(todo.id)}
          >{todo.content}</li>
        ))}
      </ul>
      {signOut && <button onClick={signOut}>ログアウト</button>}
    </main>
  );
}

export default App;
