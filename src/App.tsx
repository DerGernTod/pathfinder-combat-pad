import { useShallow } from "zustand/react/shallow";
// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { AnimatePresence } from "motion/react";
import { Canvas } from "./components/Canvas";
import { CharacterMarkers } from "./components/CharacterMarkers/CharacterMarkers";
import { DurationBar } from "./components/DurationBar";
import { Magnet } from "./components/MagnetStash/components/Magnet";
import { MagnetStash } from "./components/MagnetStash/MagnetStash";
import { useEffect } from "react";
import { useMagnetStore } from "./store/useMagnetStore";
import { EncounterStarter } from "./components/EncounterStarter/EncounterStarter";

const SIDE_CANVAS_STYLE = { flexBasis: "75px", flexGrow: 0 };
const MAIN_CANVAS_STYLE = { flexGrow: 8 };
function App() {
    // const [greetMsg, setGreetMsg] = useState("");
    // const [name, setName] = useState("");

    // async function greet() {
    //     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    //     setGreetMsg(await invoke("greet", { name }));
    // }
    useEffect(() => {
        document.addEventListener("dragover", preventDragOverDefault, true);
        document.addEventListener("dragenter", preventDragOverDefault, true);
        return () => {
            document.removeEventListener("dragover", preventDragOverDefault, true);
            document.removeEventListener("dragenter", preventDragOverDefault, true);
        }

        function preventDragOverDefault(e: DragEvent): void {
            e.preventDefault();
        }
    }, []);

    const magnetIds = useMagnetStore(useShallow(state => state.magnets.map(m => m.id)));
    return (
        <div className="container">
            <AnimatePresence>
                {
                    magnetIds.map(id => (<Magnet key={id} id={id} />))
                }
            </AnimatePresence>
            <MagnetStash />
            <header>Pathfinder Combat Pad</header>
            <main>
                <Canvas style={SIDE_CANVAS_STYLE} storeId="side-canvas" />
                <CharacterMarkers />
                <Canvas style={MAIN_CANVAS_STYLE} storeId="main-canvas" />
                <DurationBar />
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
            <footer>
                <div>Non-magnetic initiative tracker pad</div>
                <EncounterStarter />
            </footer>
        </div>
    );
}

export default App;
