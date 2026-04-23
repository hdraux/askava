import { useState } from "react";
import AppShell from "./components/AppShell";
import Header from "./components/Header";
import RevealWizard from "./components/RevealWizard";
import FirstRunModal from "./components/FirstRunModal";
import Drawer from "./components/Drawer";
import Methodology from "./components/Methodology";
import PromptLibrary from "./components/PromptLibrary";

type DrawerView = "methodology" | "prompts" | null;

export default function App() {
  const [drawerView, setDrawerView] = useState<DrawerView>(null);
  const [restartKey, setRestartKey] = useState(0);

  return (
    <AppShell>
      <Header
        onHowItWorks={() => setDrawerView("methodology")}
        onVerificationMethods={() => setDrawerView("prompts")}
        onRestart={() => setRestartKey((k) => k + 1)}
      />

      <RevealWizard key={restartKey} />

      <Drawer
        open={drawerView === "methodology"}
        onClose={() => setDrawerView(null)}
        title="How it works"
      >
        <Methodology />
      </Drawer>

      <Drawer
        open={drawerView === "prompts"}
        onClose={() => setDrawerView(null)}
        title="Verification methods"
      >
        <PromptLibrary />
      </Drawer>

      <FirstRunModal onDismiss={() => {}} />
    </AppShell>
  );
}
