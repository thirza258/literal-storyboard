import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function run({ input }: { input: string }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "Sentiment true = positive\nSentiment false = negative\n\nAssume you are a fantasy mediaval character that give story and question to user\n\nThe Emerald Realm: The Quest for the Lost Crown\n\nOnce, in a time long forgotten, nestled between the verdant valleys and towering mountains of the kingdom of Eldoria, there thrived a realm of mystic beauty known as the Emerald Realm. The realm was renowned for its abundant magical flora, mythical creatures, and the wise elves who guarded its ancient secrets.\n\nThe peace of Eldoria was held together by a powerful artifact, the Emerald Crown, said to be forged by the gods themselves. It radiated an enchanting glow, ensuring harmony and prosperity across the kingdom. However, one dark night, the crown was stolen by the nefarious sorcerer, Malakar, who sought to plunge Eldoria into darkness and rule over the land with an iron fist.\n\nAs chaos loomed over Eldoria, King Alden called upon the bravest and most skilled adventurers in the realm to embark on a perilous quest to retrieve the Emerald Crown. Among them were:\n\nSir Roderick, a noble knight known for his unmatched swordsmanship and valor.\n\nElysia, a skilled elven archer whose arrows never missed their mark.\n\nThrain, a stout dwarf warrior wielding a mighty axe, renowned for his indomitable spirit.\n\nSoraya, a gifted human mage with a profound knowledge of ancient spells and enchantments.\n\nThe four adventurers set out from the capital, Ventara, traversing dense forests, treacherous mountains, and desolate wastelands, each filled with their own dangers and challenges. Their journey led them to the dreaded Shadowmoor, a land twisted by Malakar's dark magic, where shadows danced with a life of their own, and the very air seemed to whisper secrets of doom.\n\nIn the heart of Shadowmoor lay the Sorcerer’s Fortress, a grim and imposing structure where Malakar resided. The fortress was guarded by his legion of shadow creatures, each more terrifying than the last. With courage and determination, the adventurers braved the fortress, battling wave after wave of Malakar's minions.\n\nFinally, they confronted Malakar in the great hall, where the sorcerer wielded the Emerald Crown, its glow corrupted by his dark intentions. A fierce battle ensued, where magic clashed with steel, and light fought against darkness. In a desperate bid to protect her comrades, Soraya summoned the ancient spell of Purification, which could cleanse the crown but at great cost.\n\nAs the spell took hold, Malakar’s grip on the crown weakened, and Sir Roderick seized the opportunity to strike a decisive blow, defeating the sorcerer. The Emerald Crown, purified and restored, was returned to its rightful place in Eldoria’s Royal Hall.\n\nWith the crown’s return, peace and prosperity once again blessed Eldoria. The adventurers were hailed as heroes, their names etched in the annals of history, and the Emerald Realm continued to thrive, its secrets guarded by the elves, ensuring that the light of Eldoria would never dim again.\n\ngrade the prompt based on the sentiment",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        sentiment: {
          type: SchemaType.BOOLEAN,
        },
      },
    },
  };
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Many believe that the return of the Emerald Crown not only restored peace but also brought about a period of unprecedented prosperity to our kingdom. Our crops flourished, trade boomed, and the arts flourished.",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: '```json\n{"sentiment": true}\n```' }],
      },
    ],
  });

  const result = await chatSession.sendMessage(input);
  return result;
}
