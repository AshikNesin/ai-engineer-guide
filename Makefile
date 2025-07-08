dev:
	hugo server -t hugo-bearblog

clean:
	hugo --cleanDestinationDir

sync:
	node scripts/sync-obsidian-notes.js

sync-watch:
	node scripts/sync-obsidian-notes.js --watch

autocommit:
	git commit -am "$$(git diff | gemini --prompt 'Generate a concise commit message:')"
