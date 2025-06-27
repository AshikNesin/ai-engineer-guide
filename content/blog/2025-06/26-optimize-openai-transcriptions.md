---
title: How to Optimize OpenAI transcriptions faster and cheaper
date: 2025-06-26
description: 
tags:
  - OpenAI
url: blog/optimize-openai-transcriptions
via_url: https://x.com/adriaandotcom/status/1938118285045993584
---
I came across this wonderful tip by [George Mandis](https://george.mand.is) where he has covered step by step process on how to do it

## How does it works?
Speed up the audio by 2x or 3x and get results faster and cheaper.

Note: `gpt-4o-transcribe` charges by a min.
### Dependency

```brew
brew install yt-dlp ffmpeg 
```

## How to do it?
### 1. Extract the audio from video
```python
# Extract the audio from the video
yt-dlp -f 'bestaudio[ext=m4a]' --extract-audio --audio-format m4a -o 'video-audio.m4a' "https://www.youtube.com/watch?v=LCEmiRjPEtQ" -k;
```


### 2. Create a low-bitrate MP3 version at 3x speed

```shell
ffmpeg -i "video-audio.m4a" -filter:a "atempo=3.0" -ac 1 -b:a 64k video-audio-3x.mp3;
```
### 3. Transcription
```shell
# Send it along to OpenAI for a transcription
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@video-audio-3x.mp3 \
  --form model=gpt-4o-transcribe > video-transcript.txt;

```

### 4. Summarize of the transcripte

```bash
# Send it along to OpenAI for a transcription
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@video-audio-3x.mp3 \
  --form model=gpt-4o-transcribe > video-transcript.txt;
```

## References
- https://george.mand.is/2025/06/openai-charges-by-the-minute-so-make-the-minutes-shorter/ 🌟