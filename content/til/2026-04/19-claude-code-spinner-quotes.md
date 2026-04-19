---
title: How to replace Claude Code Spinner verb with Quotes
url: til/claude-code-spinner-quotes
tags:
  - claude-code
status: published
date: 2026-04-19T00:00:00.000Z
qblog_id: b9cc3128-5db0-48f1-b498-a7b754503f48
---

Instead of the default spinner verb that we get we can customize it with any words we want.

And it doesn't have to be just a verb. You can replace it with quotes as well.

In the `~/.claude/settings.json`, update the spinnerVerbs with something like this 

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": [
      "Nature does not hurry, yet everything is accomplished",
      "What you seek is seeking you",
      "No mud, no lotus",
      "Muddy water, let stand, becomes clear",
      "Silence is a source of great strength",
      "Wherever you go, there you are",
      "Respond to every call that excites your spirit",
      "Everything has beauty, but not everyone sees it",
      "Respect yourself and others will respect you",
      "Be kind whenever possible. It is always possible",
      "Because you are alive, everything is possible",
      "Smile, breathe, and go slowly",
      "The quieter you become, the more you can hear",
      "We're all just walking each other home",
      "Relax. Nothing is under control",
      "Fall seven times, stand up eight",
      "This too shall pass",
      "The obstacle is the path",
      "You are the sky. Everything else—it's just the weather",
      "It always seems impossible until it's done",
      "Imagination is more important than knowledge",
      "In the middle of difficulty lies opportunity",
      "If you're going through hell, keep going",
      "A smooth sea never made a skilled sailor",
      "You have power over your mind—not outside events",
      "Stay hungry, stay foolish",
      "Be yourself; everyone else is already taken",
      "Let your light shine before others",
      "Love your neighbor as yourself",
      "Simplicity is the ultimate sophistication",
      "Adopt the pace of nature: her secret is patience",
      "We suffer more often in imagination than in reality",
      "Believe you can and you're halfway there",
      "Comparison is the thief of joy",
      "Absorb what is useful, discard what is not",
      "Be water, my friend",
      "The future depends on what you do today",
      "There is more to life than increasing its speed",
      "The measure of intelligence is the ability to change",
      "Not all those who wander are lost",
      "Don't cry because it's over, smile because it happened",
      "Well done is better than well said",
      "Do one thing every day that scares you",
      "Have the courage to follow your heart and intuition",
      "You miss 100% of the shots you don't take",
      "The journey of a thousand miles begins with one step",
      "Let go or be dragged",
      "When nothing is lacking, the world is yours",
      "What you think, you become",
      "Each morning we are born again",
      "Walk as if you are kissing the earth with your feet",
      "Drop by drop is the water pot filled",
      "Light a lamp for another, brighten your own path",
      "Waste no time arguing what a good person should be",
      "He who fears death will never do anything worthy",
      "You cannot control the wind, but you can set the sails",
      "Fear not death, but the life never begun",
      "How long will you wait to demand the best of yourself",
      "Difficulty strengthens the mind, as labor the body",
      "The best revenge is to be unlike your enemy",
      "Confine yourself to the present",
      "Choose not to be harmed and you won't feel harmed",
      "First say to yourself what you would be",
      "The only way out is through",
      "Slow is smooth, smooth is fast",
      "Begin where you are. Use what you have",
      "Done is better than perfect",
      "Inhale the future, exhale the past",
      "Bloom where you are planted",
      "Small steps every day",
      "Progress, not perfection",
      "The cave you fear holds the treasure you seek",
      "Action is the antidote to despair",
      "The wound is the place where the light enters you",
      "Trust the process",
      "What is meant for you will not pass you by",
      "Doubt kills more dreams than failure ever will",
      "Tend to your own garden",
      "Still waters run deep",
      "Empty your cup so that it may be filled",
      "Patience is bitter, but its fruit is sweet",
      "When in doubt, take the next small step",
      "The way out is the way through",
      "Less, but better",
      "Old ways won't open new doors",
      "Comparison ends where gratitude begins",
      "You cannot pour from an empty cup",
      "Whatever you are, be a good one",
      "Fortune favors the bold",
      "The obstacle in the path becomes the path",
      "Not the load, but the way you carry it"
    ]
  }
}
```

## Reference
https://github.com/basic-intelligence/ZenSpinner