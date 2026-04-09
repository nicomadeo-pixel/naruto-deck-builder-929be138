import { DeckProvider } from "@/contexts/DeckContext";
import { CardBrowser } from "@/components/CardBrowser";
import { DeckPanel } from "@/components/DeckPanel";
import { Swords } from "lucide-react";

const DeckBuilder = () => {
  return (
    <DeckProvider>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card">
          <Swords className="h-6 w-6 text-primary" />
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            <span className="text-primary">Naruto Mythos</span>{" "}
            <span className="text-foreground">Deck Builder</span>
          </h1>
          <span className="ml-auto text-xs text-muted-foreground font-heading uppercase tracking-widest">
            Konoha Shidō
          </span>
        </header>

        {/* Main */}
        <div className="flex flex-1 min-h-0">
          {/* Card Browser */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <CardBrowser />
          </div>
          {/* Deck Panel */}
          <div className="w-80 xl:w-96 shrink-0 overflow-hidden">
            <DeckPanel />
          </div>
        </div>
      </div>
    </DeckProvider>
  );
};

export default DeckBuilder;
