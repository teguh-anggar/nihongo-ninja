export interface VocabularyWord {
  japanese: string;
  romaji: string;
  english: string;
  category: string;
}

export const vocabulary: VocabularyWord[] = [
  // Animals
  { japanese: "ねこ", romaji: "neko", english: "cat", category: "animals" },
  { japanese: "いぬ", romaji: "inu", english: "dog", category: "animals" },
  { japanese: "とり", romaji: "tori", english: "bird", category: "animals" },
  { japanese: "さかな", romaji: "sakana", english: "fish", category: "animals" },
  { japanese: "うま", romaji: "uma", english: "horse", category: "animals" },
  { japanese: "くま", romaji: "kuma", english: "bear", category: "animals" },
  { japanese: "うさぎ", romaji: "usagi", english: "rabbit", category: "animals" },
  { japanese: "たぬき", romaji: "tanuki", english: "raccoon dog", category: "animals" },
  { japanese: "りす", romaji: "risu", english: "squirrel", category: "animals" },
  { japanese: "ぞう", romaji: "zou", english: "elephant", category: "animals" },

  // Colors
  { japanese: "あか", romaji: "aka", english: "red", category: "colors" },
  { japanese: "あお", romaji: "ao", english: "blue", category: "colors" },
  { japanese: "きいろ", romaji: "kiiro", english: "yellow", category: "colors" },
  { japanese: "みどり", romaji: "midori", english: "green", category: "colors" },
  { japanese: "くろ", romaji: "kuro", english: "black", category: "colors" },
  { japanese: "しろ", romaji: "shiro", english: "white", category: "colors" },
  { japanese: "ちゃいろ", romaji: "chairo", english: "brown", category: "colors" },
  { japanese: "むらさき", romaji: "murasaki", english: "purple", category: "colors" },
  { japanese: "オレンジ", romaji: "orenji", english: "orange", category: "colors" },
  { japanese: "ぴんく", romaji: "pinku", english: "pink", category: "colors" },

  // Numbers
  { japanese: "いち", romaji: "ichi", english: "one", category: "numbers" },
  { japanese: "に", romaji: "ni", english: "two", category: "numbers" },
  { japanese: "さん", romaji: "san", english: "three", category: "numbers" },
  { japanese: "よん", romaji: "yon", english: "four", category: "numbers" },
  { japanese: "ご", romaji: "go", english: "five", category: "numbers" },
  { japanese: "ろく", romaji: "roku", english: "six", category: "numbers" },
  { japanese: "なな", romaji: "nana", english: "seven", category: "numbers" },
  { japanese: "はち", romaji: "hachi", english: "eight", category: "numbers" },
  { japanese: "きゅう", romaji: "kyuu", english: "nine", category: "numbers" },
  { japanese: "じゅう", romaji: "juu", english: "ten", category: "numbers" },

  // Food
  { japanese: "りんご", romaji: "ringo", english: "apple", category: "food" },
  { japanese: "みず", romaji: "mizu", english: "water", category: "food" },
  { japanese: "ごはん", romaji: "gohan", english: "rice", category: "food" },
  { japanese: "てんぷら", romaji: "tenpura", english: "tempura", category: "food" },
  { japanese: "すし", romaji: "sushi", english: "sushi", category: "food" },
  { japanese: "パン", romaji: "pan", english: "bread", category: "food" },
  { japanese: "にく", romaji: "niku", english: "meat", category: "food" },
  { japanese: "やさい", romaji: "yasai", english: "vegetable", category: "food" },
  { japanese: "くだもの", romaji: "kudamono", english: "fruit", category: "food" },
  { japanese: "おちゃ", romaji: "ocha", english: "tea", category: "food" },

  // Body Parts
  { japanese: "あたま", romaji: "atama", english: "head", category: "body" },
  { japanese: "て", romaji: "te", english: "hand", category: "body" },
  { japanese: "あし", romaji: "ashi", english: "foot/leg", category: "body" },
  { japanese: "め", romaji: "me", english: "eye", category: "body" },
  { japanese: "はな", romaji: "hana", english: "nose", category: "body" },
  { japanese: "くち", romaji: "kuchi", english: "mouth", category: "body" },
  { japanese: "みみ", romaji: "mimi", english: "ear", category: "body" },
  { japanese: "おなか", romaji: "onaka", english: "stomach", category: "body" },

  // Greetings
  { japanese: "こんにちは", romaji: "konnichiwa", english: "hello", category: "greetings" },
  { japanese: "さようなら", romaji: "sayounara", english: "goodbye", category: "greetings" },
  { japanese: "ありがとう", romaji: "arigatou", english: "thank you", category: "greetings" },
  { japanese: "おはよう", romaji: "ohayou", english: "good morning", category: "greetings" },
  { japanese: "こんばんは", romaji: "konbanwa", english: "good evening", category: "greetings" },
  { japanese: "すみません", romaji: "sumimasen", english: "excuse me", category: "greetings" },
];

export const vocabularyCategories = ["animals", "colors", "numbers", "food", "body", "greetings"];
