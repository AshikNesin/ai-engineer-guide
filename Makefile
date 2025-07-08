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
		echo "🔄 Staging all changes..."; \
		git add .; \
		added_files=$$(git diff --cached --name-only); \
		if [ -z "$$added_files" ]; then \
			echo "⚠️ No changes to commit. Skipping autocommit."; \
			exit 0; \
		fi; \
		echo "📄 Files staged for commit:"; \
		echo "$$added_files"; \
		echo "🤖 Generating commit message with Gemini..."; \
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
		commit_msg=$$(git diff --cached | gemini --model gemini-2.5-flash --prompt "Generate a concise commit message:"); \
		kill $$spid > /dev/null 2>&1; wait $$spid 2>/dev/null; \
		if [ -z "$$commit_msg" ]; then \
			echo "❌ Commit message is empty. Aborting."; \
			exit 1; \
		fi; \
		printf "\r✅ Commit message generated:\n\"%s\"\n" "$$commit_msg"; \
		git commit -m "$$commit_msg"; \
		end_time=$$(date +%s); \
		duration=$$((end_time - start_time)); \
		echo "⏱️ Time taken: $${duration}s"; \
	'
build-progress:
	 @bash -c '\
	 	site_id=$$(netlify status | grep "Site ID" | awk "{print $$3}"); \
	 	if [ -z "$$site_id" ]; then \
	 		echo "❌ Could not find Site ID. Are you logged in with Netlify CLI?"; \
	 		exit 1; \
	 	fi; \
	 	echo "📡 Monitoring latest deploy for site: $$site_id"; \
	 	deploy_id=$$(netlify api listSiteDeploys --data '{"site_id":"'"$$site_id"'"}' | jq -r ".[0].id"); \
	 	echo "🆕 Latest Deploy ID: $$deploy_id"; \
	 	echo "🔍 Polling deploy status..."; \
	 	while true; do \
	 		status=$$(netlify api getDeploy --data '{"deploy_id":"'"$$deploy_id"'"}' | jq -r ".state"); \
	 		echo "🚧 Current status: $$status"; \
	 		if [ "$$status" = "ready" ]; then \
	 			echo "✅ Deploy complete!"; \
	 			break; \
	 		elif [ "$$status" = "error" ]; then \
	 			echo "❌ Deploy failed."; \
	 			break; \
	 		fi; \
	 		sleep 5; \
	 	done \
	 '

publish:
	@echo "🚀 Starting: sync + autocommit + git push"
	@$(MAKE) sync
	@echo "✅ Sync completed"
	@$(MAKE) autocommit
	@echo "🎉 completed!"
	@echo "🚀 Pushing to remote..."
	@git push
	@echo "✅ Push completed!"
	sleep 5
	@$(MAKE) build-progress
