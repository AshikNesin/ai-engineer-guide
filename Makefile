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
		start_time=$$(date +%s); \
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
		commit_msg=$$(git diff | gemini --model gemini-2.5-flash --prompt "Generate a concise commit message:"); \
		kill $$spid > /dev/null 2>&1; wait $$spid 2>/dev/null; \
		if [ -z "$$commit_msg" ]; then \
			echo "❌ Commit message is empty. Aborting."; \
			exit 1; \
		fi; \
		printf "\r✅ Commit message generated:\n\"%s\"\n" "$$commit_msg"; \
		git commit -am "$$commit_msg"; \
		end_time=$$(date +%s); \
		duration=$$((end_time - start_time)); \
		echo "⏱️ Time taken: $${duration}s"; \
	'
