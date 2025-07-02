# Pipeline Editor (DAG Builder)

A modern React-based Pipeline Editor for visually creating and managing Directed Acyclic Graphs (DAGs). This tool simulates how real-time data pipelines or processing workflows are constructed using interconnected nodes.

---

## 🚀 Demo

[Click For Live Demo ](https://pipeline-editor-for-dag-builder.vercel.app/)

---

## 📦 Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Velugondaiah/Pipeline-Editor-For-DAG-Builder
   cd pipeline-editor
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Open in your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## 🛠️ Main Libraries & Decisions

- **React**: UI framework for building the app.
- **React Flow**: For interactive DAG/graph visualization and manipulation.
- **dagre**: For auto-layout of nodes in a clean, readable flow.
- **react-icons**: For modern, scalable icons (e.g., delete, add, layout).
- **react-tooltip**: For tooltips on actions and controls.

**Design Decisions:**
- Used React Flow's node/edge state for robust graph management.
- Custom modal for node creation for better UX.
- Delete icons for both nodes and edges for intuitive editing.
- All main styles are in CSS for maintainability.

---
## 🎥 Demo & Screenrecord

- [Screen Recording](https://drive.google.com/file/d/1tEPM52Hl8dLauaIPMFrbB_OUjUjE7-6f/view?usp=sharing)

## 💡 Challenges Faced

- **Edge Delete Icon Placement:** Ensuring the delete icon appears exactly on the arrow for all edge types required a custom edge renderer using React Flow's edge coordinates.
- **Node/Edge Deletion UX:** Making sure delete actions are intuitive and do not interfere with selection or dragging required careful event handling (e.g., stopPropagation on delete icons).
- **DAG Validation:** Implementing real-time validation for cycles, connectivity, and minimum node count required a custom validation utility.
- **Styling:** Moving from inline styles to CSS for a clean, maintainable codebase.

---
**Made with ❤️ for the Nexstem Frontend Intern Assignment**
