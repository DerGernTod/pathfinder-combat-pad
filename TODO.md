## Pathfinder Combat Pad Improvement To-Do List

### 1. Integrated Damage and HP Tracking

The goal is to move damage tracking off the scratch pad and into the initiative row for permanence and clarity.

* [x] Implement a **dedicated HP/Damage field** within each initiative row.
* [x] Optimize the field for **pen-input number recognition** (allowing the user to write the damage directly).
* [ ] **(Optional)** Add support for **simple mathematical operations** (e.g., writing "$-5$" automatically subtracts 5 from the displayed number).

### 2. Encounter Setup Popup

The goal is to streamline encounter initialization by providing a dedicated interface for adding and ordering combatants before starting combat.

* [ ] Implement a **"Start Encounter" button** that opens a popup dialog.
* [ ] In the popup, display a **list of all current participants** (combatants already present).
* [ ] Provide an **input field** to add additional participants:
    * [ ] Allow entry of a **monster name** and a **quantity**.
    * [ ] Include an **"Add" button** to add the specified number of monsters to the encounter.
    * [ ] Support adding multiple different monsters before starting the encounter.
* [ ] Allow **tapping and dragging** (or tapping up/down arrows) on each entry to **set the initiative order** interactively.
* [ ] At the bottom of the popup, include a **"Start Encounter" button** that:
    * [ ] Creates all entities as specified.
    * [ ] Sets the initiative order as arranged.
    * [ ] Automatically creates tokens for each monster on the map.

---

### 3. Linking Initiative and Map Tokens

The goal is to eliminate the manual mapping between the initiative list and the tokens on the combat grid.

* [ ] Implement a feature to assign a **unique color** to each initiative row (combatant).
* [ ] Ensure the corresponding **map token (magnet)** automatically adopts the assigned color (e.g., border color or fill color).
* [ ] Automatically display the combatant's **name/label** as a persistent, small label on or next to the map token.
* [ ] Implement **Tap-to-Highlight** functionality:
    * [ ] Tapping an initiative row highlights the corresponding map token.
    * [ ] Tapping a map token highlights the corresponding initiative row.

---

### 4. Streamlined Condition/Status Tracking

The goal is to make applying and tracking conditions easier and less cluttering than tiny draggable "magnets."

* [ ] Replace the "local scratch pad" on the condition indicators with a **standard dropdown/select box** for selecting the status (e.g., *Frightened 1*, *Sickened 2*, *Blinded*).
* [ ] Integrate the selected condition directly into the combatant's initiative row, perhaps as a **small, colored icon** or text snippet.
* [ ] Add a **duration field** (optimized for pen input) that can be easily set for the selected condition (e.g., "2 rounds," "until end of turn").
* [ ] Implement an automatic **countdown mechanism** for conditions with a set duration.

---

### 5. Scratch Pad Refinement

The goal is to dedicate the large scratch pad solely to temporary, spatial information.

* [ ] Implement a **transparent "Map Notes" layer** dedicated only to pen drawings (AoEs, movement lines, temporary scribbles).
* [ ] Add a highly visible, one-tap **"Clear Map Notes" button** that deletes all drawings on this layer without affecting tokens or initiative data.

---
That's an excellent idea. Since the physical map is on the table, switching the digital focus from a scratch pad to a structured combat grid overlay (even an abstract one) is a huge usability improvement. It keeps the scratch pad handy for quick notes while allowing you to use a more organized tactical view when needed.

Here is the new section to add to your existing to-do list:

---

### 6. Map Area Mode Switching

The goal is to cleanly toggle the function of the main tablet area between a free-form scratchpad and a structured combat field that works with your physical table map.

* [ ] Implement a clear, easily accessible **"Mode Toggle" button** (e.g., labeled "Scratchpad" / "Combat Grid").
* [ ] **Scratchpad Mode (Default):** Maintain the current free-form drawing area, suitable for quick notes, doodles, and temporary scribbles.
* [ ] **Combat Grid Mode:**
    * [ ] Switch the background of the main area to a **simple grid pattern** (e.g., 2.5 cm $\times$ 2.5 cm or similar standard battle map size, adhering to your metric preference).
    * [ ] **Snap-to-Grid:** Implement functionality so that when the map tokens (magnets) are dragged in this mode, they **snap to the center of the grid squares** for precise positioning.
    * [ ] **Maintain Drawing Layer:** Ensure the **"Map Notes" layer** (from To-Do \#4) remains available on top of the grid for drawing temporary lines, movement paths, or AoEs.
    * [ ] **Map Pan:** Make the map "infinite" and allow zoom levels and/or panning

---
