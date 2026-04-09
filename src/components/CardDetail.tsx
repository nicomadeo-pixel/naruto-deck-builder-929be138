import { Card, CharacterCard, MissionCard } from "@/data/cards";
import { Badge } from "@/components/ui/badge";
import { CardImage } from "./CardImage";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardDetailProps {
  card: Card;
  onAdd?: () => void;
  onRemove?: () => void;
  canAdd?: boolean;
}

export const CardDetail = ({ card, onAdd, onRemove, canAdd = true }: CardDetailProps) => {
  const isCharacter = card.type === "character";
  const char = isCharacter ? (card as CharacterCard) : null;
  const mis = !isCharacter ? (card as MissionCard) : null;

  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg border border-border animate-card-enter">
      <CardImage card={card} size="md" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">
              {char ? char.name : mis?.title}
            </h3>
            {char && <p className="text-sm text-muted-foreground">{char.version}</p>}
          </div>
          <div className="flex gap-1">
            {onAdd && (
              <Button size="icon" variant="outline" onClick={onAdd} disabled={!canAdd} className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {onRemove && (
              <Button size="icon" variant="destructive" onClick={onRemove} className="h-8 w-8">
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {char && (
          <div className="flex gap-3 text-sm">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-chakra" />
              <span className="text-muted-foreground">Chakra:</span>
              <span className="font-semibold">{char.chakraCost}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-power" />
              <span className="text-muted-foreground">Power:</span>
              <span className="font-semibold">{char.power}</span>
            </span>
          </div>
        )}

        {mis && (
          <div className="flex items-center gap-1 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-mission" />
            <span className="text-muted-foreground">Mission Points:</span>
            <span className="font-semibold">{mis.missionPoints}</span>
          </div>
        )}

        {char && (
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">{char.faction}</Badge>
            <Badge variant="outline" className="text-xs">{char.rarity}</Badge>
            {char.keywords.map((kw) => (
              <Badge key={kw} variant="outline" className="text-xs bg-muted/50">{kw}</Badge>
            ))}
          </div>
        )}

        {(char?.effect || mis?.effect) && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {char?.effectType !== "none" && (
              <Badge variant="default" className="mr-1 text-xs">{char?.effectType}</Badge>
            )}
            {char?.effect || mis?.effect}
          </p>
        )}
      </div>
    </div>
  );
};
