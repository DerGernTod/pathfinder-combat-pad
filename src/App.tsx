import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Canvas } from "./components/Canvas";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke("greet", { name }));
    }

    return (
        <main className="container">
            <Canvas ratio="10%" />
            <div>Character markers here</div>
            <Canvas ratio="50%" />
            <div>duration markers here</div>
            {/* <div>

                <form
                    className="row"
                    onSubmit={(e) => {
                        e.preventDefault();
                        greet();
                    }}
                >
                    <input
                        id="greet-input"
                        onChange={(e) => setName(e.currentTarget.value)}
                        placeholder="Enter a name..."
                    />
                    <button type="submit">Greet</button>
                </form>
                <p>{greetMsg}</p>
            </div> */}
        </main>
    );
}

export default App;
