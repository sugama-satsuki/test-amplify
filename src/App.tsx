import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { RequireGroup } from "./components/RequireGroup";

const client = generateClient<Schema>();

function App({ signOut, user, onSignUp }: { signOut?: () => void, user?: any, onSignUp?: (role: string) => Promise<void> }) {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [projects, setProjects] = useState<Array<Schema["Project"]["type"]>>([]);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  useEffect(() => {
    client.models.Project.observeQuery().subscribe({
      next: (data) => setProjects([...data.items]),
    });

    const role = localStorage.getItem('signup_role');
    if (user && role && onSignUp) {
      onSignUp(role);
      localStorage.removeItem('signup_role');
    }
  }, [user, onSignUp]);

  function openModal() {
    setProjectName("");
    setProjectDesc("");
    setShowModal(true);
  }

  async function handleCreateProject() {
    if (!projectName) return;
    await client.models.Project.create({
      name: projectName,
      description: projectDesc,
      userId: user?.username || "",
    });
    setShowModal(false);
  }

  function deleteProject(id: string) {
    client.models.Project.delete({ id })
  }

  return (
    <main>
      <h1>My projects</h1>
      <button onClick={openModal}>+ new</button>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            onClick={() => deleteProject(project.id)}
          >{project.name}</li>
        ))}
      </ul>

      {/* プロジェクト作成モーダル */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300 }}>
            <h2>新規プロジェクト作成</h2>
            <div>
              <label>
                プロジェクト名<br />
                <input value={projectName} onChange={e => setProjectName(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                説明<br />
                <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} />
              </label>
            </div>
            <div style={{ marginTop: 16 }}>
              <button onClick={handleCreateProject} disabled={!projectName}>作成</button>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: 8 }}>キャンセル</button>
            </div>
          </div>
        </div>
      )}

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
