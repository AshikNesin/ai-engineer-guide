dev:
	hugo server -t hugo-bearblog

clean:
	hugo --cleanDestinationDir

sync:
	node scripts/sync-obsidian-notes.js

sync-watch:
	node scripts/sync-obsidian-notes.js --watch

autocommit:
	@bash -c '\
		echo "Generating commit message with Gemini..."; \
		spin() { \
			local sp="/-\\|"; \
			while :; do \
				printf "\r[%c] Thinking..." "$${sp:i++%4:1}"; \
				sleep 0.1; \
			done \
		}; \
		i=0; \
		spin & \
		spid=$$!; \
		commit_msg=$$(git diff | gemini --prompt "Generate a concise commit message:"); \
		kill $$spid > /dev/null 2>&1; wait $$spid 2>/dev/null; \
		printf "\r✅ Commit message generated:\n\"%s\"\n" "$$commit_msg"; \
		git commit -am "$$commit_msg" \
	'
