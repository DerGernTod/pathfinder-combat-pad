// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Canvas } from "./components/Canvas";
import { CharacterMarkers } from "./components/CharacterMarkers/CharacterMarkers";

function App() {
    // const [greetMsg, setGreetMsg] = useState("");
    // const [name, setName] = useState("");

    // async function greet() {
    //     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    //     setGreetMsg(await invoke("greet", { name }));
    // }

    return (
        <div className="container">
            <header>Pathfinder Combat Pad</header>
            <main>
                <Canvas style={{flexBasis: "75px", flexGrow: 0}} />
                <CharacterMarkers />
                <Canvas style={{flexGrow: 8}} />
                <div style={{ flexBasis: "75px", flexGrow: 0, backgroundColor: "var(--gold)" }}>d u r a t i o n</div>
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
            <footer>Non-magnetic initiative tracker pad</footer>
        </div>
    );
}

export default App;
