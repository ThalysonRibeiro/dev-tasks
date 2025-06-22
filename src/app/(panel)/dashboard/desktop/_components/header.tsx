import { Button } from "@/components/ui/button";

// Header refatorado para ser dinâmico
interface Tab {
  key: string;
  label: string;
  component: React.ReactNode;
}

interface HeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function Header({ tabs, activeTab, onTabChange }: HeaderProps) {
  return (
    <header>
      <nav className="flex justify-between">
        <ul className="inline-flex gap-4">
          {tabs.map(tab => (
            <li key={tab.key}>
              <Button
                onClick={() => onTabChange(tab.key)}
                variant={activeTab === tab.key ? "default" : "outline"}
              >
                {tab.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}