import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { RequireGroup } from "./components/RequireGroup";

const client = generateClient<Schema>();

function App({ signOut, user, onSignUp }: { signOut?: () => void, user?: any, onSignUp?: (role: string) => Promise<void> }) {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

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
      
      <RequireGroup anyOf={["ADMIN"]}>
        <section className="rounded-xl border p-4">
          <h2 className="font-semibold">Admin Console</h2>
          {/* admin専用UI */}
        </section>
      </RequireGroup>
      <RequireGroup
        anyOf={["editor", "ADMIN"]}
        fallback={<p>編集権限がありません。</p>}
      >
        <section className="rounded-xl border p-4">
          <h2 className="font-semibold">Editor Tools</h2>
          {/* 編集用UI */}
        </section>
      </RequireGroup>

      {signOut && <button onClick={signOut}>ログアウト</button>}
    </main>
  );
}

export default App;
