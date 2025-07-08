dev:
	hugo server -t hugo-bearblog

clean:
	hugo --cleanDestinationDir

sync:
	node scripts/sync-obsidian-notes.js

sync-watch:
	node scripts/sync-obsidian-notes.js --watch

autocommit:
	@echo "Generating commit message with Gemini..."
	@{ \
		spinner="/|\\-"; \
		i=0; \
		commit_msg=$$( \
			while :; do \
				printf "\r[%c] Thinking..." "$${spinner:i++%${#spinner}:1}"; \
				sleep 0.1; \
			done & \
			spid=$$!; \
			msg=$$(git diff | gemini --prompt 'Generate a concise commit message:'); \
			kill $$spid; wait $$spid 2>/dev/null; \
			echo "$$msg" \
		); \
		printf "\r✅ Commit message generated.\n"; \
		git commit -am "$$commit_msg"; \
	}
