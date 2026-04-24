import { useState } from "react";
import AppShell from "./components/AppShell";
import Header from "./components/Header";
import ModeSwitcher from "./components/ModeSwitcher";
import RevealWizard from "./components/RevealWizard";
import FirstRunModal from "./components/FirstRunModal";
import Drawer from "./components/Drawer";
import Methodology from "./components/Methodology";
import ResearchMethodology from "./components/ResearchMethodology";
import PromptLibrary from "./components/PromptLibrary";
import type { WizardMode } from "./components/RevealWizard";

type DrawerView = "methodology" | "prompts" | null;

export default function App() {
  const [drawerView, setDrawerView] = useState<DrawerView>(null);
  const [restartKey, setRestartKey] = useState(0);
  const [mode, setMode] = useState<WizardMode>("general");

  function switchMode(m: WizardMode) {
    setMode(m);
    setRestartKey((k) => k + 1);
  }

  function restart() {
    setRestartKey((k) => k + 1);
  }

  return (
    <AppShell>
      <Header
        mode={mode}
        onHowItWorks={() => setDrawerView("methodology")}
        onVerificationMethods={() => setDrawerView("prompts")}
        onRestart={restart}
      />

      <ModeSwitcher
        mode={mode}
        onModeChange={switchMode}
        onRestart={restart}
      />

      <RevealWizard key={restartKey} mode={mode} />

      <Drawer
        open={drawerView === "methodology"}
        onClose={() => setDrawerView(null)}
        title="How it works"
      >
        {mode === "research"
          ? <ResearchMethodology onOpenOther={() => setDrawerView("prompts")} />
          : <Methodology onOpenOther={() => setDrawerView("prompts")} />
        }
      </Drawer>

      <Drawer
        open={drawerView === "prompts"}
        onClose={() => setDrawerView(null)}
        title="Verification methods"
      >
        <PromptLibrary mode={mode} onOpenOther={() => setDrawerView("methodology")} />
      </Drawer>

      <FirstRunModal onDismiss={() => {}} />
    </AppShell>
  );
}
