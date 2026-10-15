import type { Endings, Epilogue } from '@/content/types'

export const endings: Endings = {
  good: {
    title: 'Player 2 has joined',
    text: "She replies “ok.” Then, ten seconds later: “i've been waiting all week for u to ask.” You spend the night in voice chat, barely talking. You don't need to. Her stream title the next day says: “taken. don't ask.”",
  },
  friends: {
    title: 'Duo partner',
    text: "She replies “lol. like... as friends?” You end up as her permanent Spikefall duo. She still sends you memes at 3am. It's not nothing, but it's not that.",
  },
  left: {
    title: 'Left on read',
    text: "Delivered. Read 11:42pm. No reply. The next morning you're removed from her close friends list. Her bio now says “no simps, no exceptions.”",
  },
}

export const epilogue: Epilogue = {
  high: "Nyx posts a black screen captioned “cool.” She doesn't stream for three days. Everyone knows why.",
  mid: 'Nyx still sends you memes. Just fewer.',
  low: 'Nyx subtweets you: “some ppl are so loud about nothing.”',
}
