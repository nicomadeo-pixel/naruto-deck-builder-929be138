import { CharacterCard, MissionCard, Card } from "@/data/cards";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Plus, Minus } from "lucide-react";

interface CardImageProps {
  card: Card;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  className?: string;
  count?: number;
  disabled?: boolean;
  enableHoverPreview?: boolean;
}

const sizeClasses = {
  sm: "w-full aspect-[5/7]",
  md: "w-36 h-52",
  lg: "w-56 h-80",
};

const ariaLabel = (card: Card) => {
  if (card.type === "character") {
    const c = card as CharacterCard;
    return `${c.name}, ${c.version}, ${c.chakraCost} chakra, ${c.power} power, ${c.faction}, ${c.rarity}`;
  }
  const m = card as MissionCard;
  return `Mission: ${m.title}, ${m.missionPoints} points`;
};

export const CardImage = ({
  card,
  size = "sm",
  onClick,
  onContextMenu,
  className,
  count = 0,
  disabled = false,
  enableHoverPreview = false,
}: CardImageProps) => {
  const isCharacter = card.type === "character";
  const rarity = isCharacter ? (card as CharacterCard).rarity : undefined;
  const isLegendary = rarity === "SecretV" || rarity === "Legendary";

  const cardEl = (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel(card)}
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        onClick?.();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " " || e.key === "+") {
          e.preventDefault();
          onClick?.();
        }
        if (e.key === "Backspace" || e.key === "Delete" || e.key === "-") {
          e.preventDefault();
          onContextMenu?.(e as unknown as React.MouseEvent);
        }
      }}
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-200 group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-[1.04] hover:z-10",
        isLegendary && !disabled ? "card-glow-legendary" : !disabled && "hover:card-glow",
        count > 0 && "ring-2 ring-primary/80",
        sizeClasses[size],
        className
      )}
    >
      <img
        src={card.imageUrl}
        alt={ariaLabel(card)}
        className="w-full h-full object-cover"
        loading="lazy"
        draggable={false}
      />

      {/* Quantity badge */}
      {count > 0 && (
        <div className="absolute top-1 right-1 min-w-[26px] h-[26px] px-1.5 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm flex items-center justify-center shadow-lg ring-2 ring-background">
          ×{count}
        </div>
      )}

      {/* Hover hint overlay (mouse only) */}
      {!disabled && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex items-center justify-between px-2 py-1.5 text-[10px] font-heading uppercase tracking-wider text-foreground">
            <span className="flex items-center gap-1"><Plus className="h-3 w-3" /> Add</span>
            {count > 0 && (
              <span className="flex items-center gap-1 text-muted-foreground"><Minus className="h-3 w-3" /> R-click</span>
            )}
          </div>
        </div>
      )}

      {disabled && (
        <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
          <span className="text-[10px] font-heading uppercase tracking-wider text-foreground bg-background/80 px-2 py-1 rounded">Max</span>
        </div>
      )}
    </div>
  );

  if (!enableHoverPreview) return cardEl;

  return (
    <HoverCard openDelay={250} closeDelay={50}>
      <HoverCardTrigger asChild>{cardEl}</HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={12}
        className="w-auto p-0 bg-transparent border-0 shadow-2xl"
      >
        <div className="relative">
          <img
            src={card.imageUrl}
            alt={ariaLabel(card)}
            className={cn(
              "w-72 rounded-xl object-cover",
              isLegendary && "card-glow-legendary"
            )}
          />
          {isCharacter && (
            <div className="absolute inset-x-0 bottom-0 p-3 rounded-b-xl bg-gradient-to-t from-background via-background/90 to-transparent">
              <p className="font-heading font-bold text-foreground leading-tight">
                {(card as CharacterCard).name}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                {(card as CharacterCard).version} · {(card as CharacterCard).faction}
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-chakra font-semibold">{(card as CharacterCard).chakraCost}⬡ Chakra</span>
                <span className="text-power font-semibold">{(card as CharacterCard).power}★ Power</span>
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
