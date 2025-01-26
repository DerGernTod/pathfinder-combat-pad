import { useState } from "react";
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
        <div className="container">
            <header>Pathfinder Combat Pad</header>
            <main>
                <Canvas ratio={1} />
                <div style={{ width: "150px", backgroundColor: "crimson" }}>Character markers here</div>
                <Canvas ratio={8} />
                <div style={{ width: "75px", backgroundColor: "orange" }}>d u r a t i o n</div>
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
            <footer>Footer</footer>
        </div>
    );
}

export default App;
