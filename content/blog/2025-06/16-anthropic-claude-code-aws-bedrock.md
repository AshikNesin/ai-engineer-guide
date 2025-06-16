---
title: How to Use Anthropic Claude Code with AWS Bedrock
date: 2025-06-16
description: 
tags:
  - bookmark
  - anthropic
  - claude-code
url: blog/anthropic-claude-code-aws-bedrock
via_url:
---
[Claude Code](https://www.anthropic.com/claude-code) is a CLI based tool that brings in AI coding capabilities directly into your terminal.

Apart from directly using your Anthropic API key, you can also easily use your Amazon Bedrock as well.

Here is how to do it:

### Step 1: Configure AWS
You need to make sure that you've configured AWS properly in your machine where you're going to run Claude Code.

You can configure it interactively by running this command

```bash
aws configure
```

Or by setting this env props
```bash
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_SESSION_TOKEN=your-session-token
```

And make sure to enable required models in AWS Bedrock
### Step 2: Configure Claude Code to use AWS Bedrock
Configuring it is straight forward

Just add these env props
```bash
export CLAUDE_CODE_USE_BEDROCK=1 # Enable Bedrock integration
export AWS_REGION=us-east-1  # or your preferred region
```

That's pretty much it.

## Note

By default these models are configured

|Model type|Default value|
|---|---|
|Primary model|`us.anthropic.claude-3-7-sonnet-20250219-v1:0`|
|Small/fast model|`us.anthropic.claude-3-5-haiku-20241022-v1:0`|

But if you need to change it, you can do so by adding it in these env properties

```bash
export ANTHROPIC_MODEL='us.anthropic.claude-opus-4-20250514-v1:0'
export ANTHROPIC_SMALL_FAST_MODEL='us.anthropic.claude-3-5-haiku-20241022-v1:0'
```
## References
- https://docs.anthropic.com/en/docs/claude-code/amazon-bedrock
- https://community.aws/content/2tXkZKrZzlrlu0KfH8gST5Dkppq/claude-code-on-amazon-bedrock-quick-setup-guide

Happy writing codes!