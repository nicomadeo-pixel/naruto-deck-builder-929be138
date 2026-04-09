import React, { createContext, useContext, useState, useCallback } from "react";
import { CharacterCard, MissionCard, Card } from "@/data/cards";
import { canAddCard, validateDeck, DeckValidation } from "@/lib/deckRules";
import { useToast } from "@/hooks/use-toast";

interface DeckContextType {
  deckName: string;
  setDeckName: (name: string) => void;
  characters: CharacterCard[];
  missions: MissionCard[];
  addCard: (card: Card) => void;
  removeCard: (cardId: string, type: "character" | "mission") => void;
  clearDeck: () => void;
  validation: DeckValidation;
}

const DeckContext = createContext<DeckContextType | null>(null);

export const useDeck = () => {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used within DeckProvider");
  return ctx;
};

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deckName, setDeckName] = useState("My Deck");
  const [characters, setCharacters] = useState<CharacterCard[]>([]);
  const [missions, setMissions] = useState<MissionCard[]>([]);
  const { toast } = useToast();

  const addCard = useCallback(
    (card: Card) => {
      const check = canAddCard(card, characters, missions);
      if (!check.allowed) {
        toast({ title: "Can't add card", description: check.reason, variant: "destructive" });
        return;
      }
      if (card.type === "character") {
        setCharacters((prev) => [...prev, card as CharacterCard]);
      } else {
        setMissions((prev) => [...prev, card as MissionCard]);
      }
      toast({ title: `Added "${card.type === "character" ? (card as CharacterCard).name : (card as MissionCard).title}"` });
    },
    [characters, missions, toast]
  );

  const removeCard = useCallback(
    (cardId: string, type: "character" | "mission") => {
      if (type === "character") {
        setCharacters((prev) => {
          const idx = prev.findIndex((c) => c.id === cardId);
          if (idx === -1) return prev;
          return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
      } else {
        setMissions((prev) => prev.filter((m) => m.id !== cardId));
      }
    },
    []
  );

  const clearDeck = useCallback(() => {
    setCharacters([]);
    setMissions([]);
  }, []);

  const validation = validateDeck(characters, missions);

  return (
    <DeckContext.Provider
      value={{ deckName, setDeckName, characters, missions, addCard, removeCard, clearDeck, validation }}
    >
      {children}
    </DeckContext.Provider>
  );
};
