---
title: "Converting HumanMessage and AIMessage to Strings in LangChain"
date: 2024-01-03
description: Sample article showcasing basic Markdown syntax and formatting for HTML elements.
tags:
  - langchain
  - snippets
url: blog/convert-humanmessage-aimessage-string-langchain
---

LangChain usually represents messages as it's own [message types](https://python.langchain.com/v0.1/docs/modules/model_io/chat/message_types/) like `HumanMessage`, `AIMessage`, `SystemMessage`, etc

Sometime, you might want to convert it into plan string which you can do it using [get_buffer_string](https://api.python.langchain.com/en/latest/messages/langchain_core.messages.utils.get_buffer_string.html)

<!--more-->

Here is how to do it

## Python
```python
from langchain_core import AIMessage, HumanMessage
from langchain_core.messages.utils import get_buffer_string

messages = [
    HumanMessage(content="Hi, how are you?"),
    AIMessage(content="Good, how are you?"),
]
messages_string = get_buffer_string(messages)
# Output: "Human: Hi, how are you?\n\nAI: Good, how are you?"
```

## Javascript / Typescript
```js
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { getBufferString } from '@langchain/core/messages';
const messages = [
	new HumanMessage(message.content),
	new AIMessage(message.content)
];

const messagesAsString = getBufferString(messages)
```

Happy converting strings!
