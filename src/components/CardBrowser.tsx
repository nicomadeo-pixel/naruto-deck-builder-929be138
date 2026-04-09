import { useState, useMemo } from "react";
import { characterCards, missionCards, Card, CharacterCard, Faction, Rarity } from "@/data/cards";
import { CardImage } from "./CardImage";
import { CardDetail } from "./CardDetail";
import { useDeck } from "@/contexts/DeckContext";
import { canAddCard } from "@/lib/deckRules";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from "lucide-react";

const factions: Faction[] = ["Konoha", "Sound", "Sand", "Akatsuki", "Neutral"];
const rarities: Rarity[] = ["C", "UC", "R", "SR", "SecretV", "Legendary"];

export const CardBrowser = () => {
  const { characters, missions, addCard } = useDeck();
  const [search, setSearch] = useState("");
  const [faction, setFaction] = useState<string>("all");
  const [rarity, setRarity] = useState<string>("all");
  const [maxCost, setMaxCost] = useState<string>("all");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [tab, setTab] = useState("characters");

  const filteredCharacters = useMemo(() => {
    return characterCards.filter((c) => {
      const matchSearch =
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.version.toLowerCase().includes(search.toLowerCase()) ||
        c.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      const matchFaction = faction === "all" || c.faction === faction;
      const matchRarity = rarity === "all" || c.rarity === rarity;
      const matchCost = maxCost === "all" || c.chakraCost <= parseInt(maxCost);
      return matchSearch && matchFaction && matchRarity && matchCost;
    });
  }, [search, faction, rarity, maxCost]);

  const filteredMissions = useMemo(() => {
    return missionCards.filter((m) => {
      return search === "" || m.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

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

        <div className="flex gap-2 flex-wrap">
          <Select value={faction} onValueChange={setFaction}>
            <SelectTrigger className="w-32 bg-secondary border-border text-sm h-8">
              <SelectValue placeholder="Faction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Factions</SelectItem>
              {factions.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rarity} onValueChange={setRarity}>
            <SelectTrigger className="w-28 bg-secondary border-border text-sm h-8">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              {rarities.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={maxCost} onValueChange={setMaxCost}>
            <SelectTrigger className="w-32 bg-secondary border-border text-sm h-8">
              <SelectValue placeholder="Chakra Cost" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Cost</SelectItem>
              {[1, 2, 3, 4, 5, 6].map((c) => (
                <SelectItem key={c} value={String(c)}>≤ {c} Chakra</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          {selectedCard && selectedCard.type === "character" && (
            <div className="mb-4">
              <CardDetail
                card={selectedCard}
                onAdd={() => addCard(selectedCard)}
                canAdd={canAddCard(selectedCard, characters, missions).allowed}
              />
            </div>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {filteredCharacters.map((card) => (
              <CardImage
                key={card.id}
                card={card}
                size="sm"
                onClick={() => setSelectedCard(card)}
                className={selectedCard?.id === card.id ? "ring-2 ring-primary" : ""}
              />
            ))}
          </div>
          {filteredCharacters.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No characters match your filters.</p>
          )}
        </TabsContent>

        <TabsContent value="missions" className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {selectedCard && selectedCard.type === "mission" && (
            <div className="mb-4">
              <CardDetail
                card={selectedCard}
                onAdd={() => addCard(selectedCard)}
                canAdd={canAddCard(selectedCard, characters, missions).allowed}
              />
            </div>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {filteredMissions.map((card) => (
              <CardImage
                key={card.id}
                card={card}
                size="sm"
                onClick={() => setSelectedCard(card)}
                className={selectedCard?.id === card.id ? "ring-2 ring-primary" : ""}
              />
            ))}
          </div>
          {filteredMissions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No missions match your search.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
