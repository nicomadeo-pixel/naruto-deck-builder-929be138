import { useDeck } from "@/contexts/DeckContext";
import { CharacterCard, MissionCard } from "@/data/cards";
import { DECK_RULES } from "@/lib/deckRules";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, AlertTriangle, CheckCircle, X } from "lucide-react";

export const DeckPanel = () => {
  const { deckName, setDeckName, characters, missions, removeCard, clearDeck, validation } = useDeck();

  // Group characters by name+version for compact display
  const charGroups: { card: CharacterCard; count: number }[] = [];
  const seen: Record<string, number> = {};
  characters.forEach((c) => {
    const key = c.id;
    if (seen[key] !== undefined) {
      charGroups[seen[key]].count++;
    } else {
      seen[key] = charGroups.length;
      charGroups.push({ card: c, count: 1 });
    }
  });

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">Your Deck</h2>
          <Button variant="ghost" size="sm" onClick={clearDeck} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
        <Input
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          className="bg-secondary border-border font-heading text-lg h-9"
        />
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-border flex gap-4">
        <div className="text-center flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Characters</p>
          <p className={`font-heading text-2xl font-bold ${characters.length === DECK_RULES.MAX_CHARACTER_CARDS ? "text-mission" : characters.length > DECK_RULES.MAX_CHARACTER_CARDS ? "text-destructive" : "text-foreground"}`}>
            {characters.length}/{DECK_RULES.MAX_CHARACTER_CARDS}
          </p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Missions</p>
          <p className={`font-heading text-2xl font-bold ${missions.length === DECK_RULES.MAX_MISSION_CARDS ? "text-mission" : "text-foreground"}`}>
            {missions.length}/{DECK_RULES.MAX_MISSION_CARDS}
          </p>
        </div>
      </div>

      {/* Validation */}
      {(validation.errors.length > 0 || validation.isValid) && (
        <div className="px-4 py-2 border-b border-border">
          {validation.isValid ? (
            <div className="flex items-center gap-2 text-mission text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Deck is valid!</span>
            </div>
          ) : (
            <div className="space-y-1">
              {validation.errors.slice(0, 3).map((err, i) => (
                <div key={i} className="flex items-start gap-2 text-destructive text-xs">
                  <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Card List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Characters */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Characters
            </h3>
            {charGroups.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Add characters from the card browser</p>
            ) : (
              <div className="space-y-1">
                {charGroups.map(({ card, count }) => (
                  <div key={card.id} className="flex items-center gap-2 py-1.5 px-2 rounded bg-secondary/50 hover:bg-secondary transition-colors group">
                    <img src={card.imageUrl} alt={card.name} className="w-8 h-11 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{card.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="text-chakra">{card.chakraCost}⬡</span>
                        <span className="text-power">{card.power}★</span>
                      </div>
                    </div>
                    {count > 1 && (
                      <Badge variant="secondary" className="text-xs">×{count}</Badge>
                    )}
                    <button
                      onClick={() => removeCard(card.id, "character")}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missions */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Missions
            </h3>
            {missions.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Add missions from the card browser</p>
            ) : (
              <div className="space-y-1">
                {missions.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 py-1.5 px-2 rounded bg-secondary/50 hover:bg-secondary transition-colors group">
                    <img src={m.imageUrl} alt={m.title} className="w-8 h-11 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.title}</p>
                      <p className="text-xs text-mission">{m.missionPoints} pts</p>
                    </div>
                    <button
                      onClick={() => removeCard(m.id, "mission")}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Chakra curve */}
      {characters.length > 0 && (
        <div className="p-4 border-t border-border">
          <h3 className="font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Chakra Curve
          </h3>
          <div className="flex items-end gap-1 h-12">
            {[1, 2, 3, 4, 5, 6].map((cost) => {
              const count = characters.filter((c) => c.chakraCost === cost).length;
              const maxCount = Math.max(...[1, 2, 3, 4, 5, 6].map((cc) => characters.filter((c) => c.chakraCost === cc).length), 1);
              const height = count > 0 ? Math.max((count / maxCount) * 100, 10) : 0;
              return (
                <div key={cost} className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[10px] text-muted-foreground">{count || ""}</span>
                  <div
                    className="w-full rounded-t bg-chakra/70 transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{cost}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
