import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { useAuth } from "../../hooks/useAuth";
import { ProfileForm } from "../../components/admin/forms/ProfileForm";
import { SkillsForm } from "../../components/admin/forms/SkillsForm";
import { ExperienceForm } from "../../components/admin/forms/ExperienceForm";
import { ProjectsForm } from "../../components/admin/forms/ProjectsForm";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AdminDashboardPage() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  return (
    <Container className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Admin Dashboard</h1>
        <Button variant="secondary" onClick={() => logout()}>
          Log out
        </Button>
      </div>

      <div className="mb-8 flex gap-2 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && <ProfileForm />}
      {activeTab === "skills" && <SkillsForm />}
      {activeTab === "experience" && <ExperienceForm />}
      {activeTab === "projects" && <ProjectsForm />}
    </Container>
  );
}
