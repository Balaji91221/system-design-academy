import React from "react";
import { Routes, Route } from "react-router-dom";
import { C, display } from "./theme.js";
import GlobalStyles from "./components/GlobalStyles.jsx";
import TopNav from "./components/TopNav.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import DesignStudioPage from "./pages/DesignStudioPage.jsx";
import CheatSheetsPage from "./pages/CheatSheetsPage.jsx";

// A scroll container for pages that scroll as a whole document. (LibraryPage is
// the exception — it manages its own two-pane internal scrolling.)
function Scroll({ children }) {
  return <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>{children}</div>;
}

// ============================================================================
//  APP SHELL — fixed-height layout: a sticky TopNav above a routed content area.
// ============================================================================
export default function App() {
  return (
    <div style={{
      height: "100vh", overflow: "hidden", color: C.ink, fontFamily: display, display: "flex", flexDirection: "column",
      background: `radial-gradient(1100px 520px at 82% -8%, ${C.blue}12, transparent 60%), radial-gradient(900px 520px at -8% 12%, ${C.teal}0e, transparent 60%), ${C.bg}`,
    }}>
      <GlobalStyles />
      <div className="aurora" aria-hidden />
      <CommandPalette />
      <TopNav />
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Scroll><Dashboard /></Scroll>} />
          <Route path="/learn" element={<LibraryPage />} />
          <Route path="/learn/:num" element={<LibraryPage />} />
          <Route path="/interview" element={<Scroll><InterviewPage /></Scroll>} />
          <Route path="/design" element={<Scroll><DesignStudioPage /></Scroll>} />
          <Route path="/design/:id" element={<Scroll><DesignStudioPage /></Scroll>} />
          <Route path="/cheatsheets" element={<Scroll><CheatSheetsPage /></Scroll>} />
          <Route path="*" element={<Scroll><Dashboard /></Scroll>} />
        </Routes>
      </div>
    </div>
  );
}
