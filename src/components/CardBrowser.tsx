import { useState, useMemo } from "react";
import { characterCards, missionCards, Card, Faction, Rarity } from "@/data/cards";
import { CardImage } from "./CardImage";
import { useDeck } from "@/contexts/DeckContext";
import { canAddCard, DECK_RULES } from "@/lib/deckRules";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const factions: Faction[] = ["Konoha", "Sound", "Sand", "Akatsuki", "Neutral"];
const rarities: Rarity[] = ["C", "UC", "R", "SR", "SecretV", "Legendary"];
const chakraCosts = [1, 2, 3, 4, 5, 6];

export const CardBrowser = () => {
  const { characters, missions, addCard, removeCard } = useDeck();
  const [search, setSearch] = useState("");
  const [selectedFactions, setSelectedFactions] = useState<Set<Faction>>(new Set());
  const [selectedRarities, setSelectedRarities] = useState<Set<Rarity>>(new Set());
  const [selectedCosts, setSelectedCosts] = useState<Set<number>>(new Set());
  const [tab, setTab] = useState("characters");

  const toggle = <T,>(set: Set<T>, value: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const clearAll = () => {
    setSearch("");
    setSelectedFactions(new Set());
    setSelectedRarities(new Set());
    setSelectedCosts(new Set());
  };

  const activeFilterCount =
    selectedFactions.size + selectedRarities.size + selectedCosts.size + (search ? 1 : 0);

  const filteredCharacters = useMemo(() => {
    return characterCards.filter((c) => {
      const matchSearch =
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.version.toLowerCase().includes(search.toLowerCase()) ||
        c.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      const matchFaction = selectedFactions.size === 0 || selectedFactions.has(c.faction);
      const matchRarity = selectedRarities.size === 0 || selectedRarities.has(c.rarity);
      const matchCost = selectedCosts.size === 0 || selectedCosts.has(c.chakraCost);
      return matchSearch && matchFaction && matchRarity && matchCost;
    });
  }, [search, selectedFactions, selectedRarities, selectedCosts]);

  const filteredMissions = useMemo(() => {
    return missionCards.filter((m) => {
      return search === "" || m.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  const charCounts = useMemo(() => {
    const m: Record<string, number> = {};
    characters.forEach((c) => (m[c.id] = (m[c.id] || 0) + 1));
    return m;
  }, [characters]);

  const missionCounts = useMemo(() => {
    const m: Record<string, number> = {};
    missions.forEach((c) => (m[c.id] = (m[c.id] || 0) + 1));
    return m;
  }, [missions]);

  const handleAdd = (card: Card) => {
    if (canAddCard(card, characters, missions).allowed) addCard(card);
  };

  const handleRemove = (card: Card) => {
    const count = card.type === "character" ? charCounts[card.id] : missionCounts[card.id];
    if (count > 0) removeCard(card.id, card.type);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search & Filters */}
      <div className="p-4 space-y-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards by name, version, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border"
          />
        </div>

        {/* Chakra cost chips */}
        <FilterRow label="Chakra Cost">
          {chakraCosts.map((c) => (
            <Chip
              key={c}
              active={selectedCosts.has(c)}
              onClick={() => toggle(selectedCosts, c, setSelectedCosts)}
              accent="chakra"
            >
              {c}⬡
            </Chip>
          ))}
        </FilterRow>

        {/* Faction chips */}
        <FilterRow label="Faction">
          {factions.map((f) => (
            <Chip
              key={f}
              active={selectedFactions.has(f)}
              onClick={() => toggle(selectedFactions, f, setSelectedFactions)}
            >
              {f}
            </Chip>
          ))}
        </FilterRow>

        {/* Rarity chips */}
        <FilterRow label="Rarity">
          {rarities.map((r) => (
            <Chip
              key={r}
              active={selectedRarities.has(r)}
              onClick={() => toggle(selectedRarities, r, setSelectedRarities)}
              accent={r === "SecretV" || r === "Legendary" ? "legendary" : undefined}
            >
              {r}
            </Chip>
          ))}
        </FilterRow>

        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-1">
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
              <X className="h-3 w-3 mr-1" /> Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-3 bg-secondary">
          <TabsTrigger value="characters" className="font-heading">
            Characters ({filteredCharacters.length})
          </TabsTrigger>
          <TabsTrigger value="missions" className="font-heading">
            Missions ({filteredMissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <p className="text-xs text-muted-foreground mb-3">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground">Click</kbd> to add ·{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground">Right-click</kbd> to remove ·{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground">Hover</kbd> to preview
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredCharacters.map((card) => {
              const count = charCounts[card.id] || 0;
              const canAdd = canAddCard(card, characters, missions).allowed;
              return (
                <CardImage
                  key={card.id}
                  card={card}
                  size="sm"
                  count={count}
                  disabled={!canAdd && count === 0}
                  enableHoverPreview
                  onClick={() => handleAdd(card)}
                  onContextMenu={() => handleRemove(card)}
                />
              );
            })}
          </div>
          {filteredCharacters.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No characters match your filters.</p>
          )}
        </TabsContent>

        <TabsContent value="missions" className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <p className="text-xs text-muted-foreground mb-3">
            Pick exactly {DECK_RULES.MAX_MISSION_CARDS} unique missions.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filteredMissions.map((card) => {
              const count = missionCounts[card.id] || 0;
              const canAdd = canAddCard(card, characters, missions).allowed;
              return (
                <CardImage
                  key={card.id}
                  card={card}
                  size="sm"
                  count={count}
                  disabled={!canAdd && count === 0}
                  enableHoverPreview
                  onClick={() => handleAdd(card)}
                  onContextMenu={() => handleRemove(card)}
                />
              );
            })}
          </div>
          {filteredMissions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No missions match your search.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ---------- Local UI bits ---------- */

const FilterRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground w-20 shrink-0">
      {label}
    </span>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

const Chip = ({
  active,
  onClick,
  children,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "chakra" | "legendary";
}) => {
  const accentActive =
    accent === "chakra"
      ? "bg-chakra text-white border-chakra"
      : accent === "legendary"
      ? "bg-legendary text-background border-legendary"
      : "bg-primary text-primary-foreground border-primary";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3 py-1 rounded-full text-xs font-heading font-semibold border transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? accentActive
          : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground"
      )}
    >
      {children}
    </button>
  );
};
