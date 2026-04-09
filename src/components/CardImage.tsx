import { CharacterCard, MissionCard, Card } from "@/data/cards";
import { cn } from "@/lib/utils";

interface CardImageProps {
  card: Card;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  showOverlay?: boolean;
  overlayContent?: React.ReactNode;
}

const sizeClasses = {
  sm: "w-20 h-28",
  md: "w-36 h-52",
  lg: "w-56 h-80",
};

export const CardImage = ({ card, size = "md", onClick, className, showOverlay, overlayContent }: CardImageProps) => {
  const isCharacter = card.type === "character";
  const rarity = isCharacter ? (card as CharacterCard).rarity : undefined;
  const isLegendary = rarity === "SecretV" || rarity === "Legendary";

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 group",
        isLegendary ? "card-glow-legendary" : "hover:card-glow",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <img
        src={card.imageUrl}
        alt={isCharacter ? `${(card as CharacterCard).name} - ${(card as CharacterCard).version}` : (card as MissionCard).title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {showOverlay && overlayContent && (
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {overlayContent}
        </div>
      )}
    </div>
  );
};
