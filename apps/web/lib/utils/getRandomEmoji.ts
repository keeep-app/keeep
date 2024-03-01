// List of emojis used as list icons
const emojis = [
  '👨‍💻',
  '🚀',
  '🙌',
  '🌴',
  '🎙️',
  '🤖',
  '👀',
  '🤙',
  '💼',
  '📞',
  '✅',
  '📝',
  '👋',
  '👥',
];

// Returns a random emoji from the list
export function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}
