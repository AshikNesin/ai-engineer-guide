---
title: How to use custom domain for Shelley on exe.dev
url: til/custom-domain-shelley-exe-dev
tags:
  - shelley-agent
  - exe-dev
status: published
date: 2026-08-02T00:00:00.000Z
qblog_id: aa21b25e-4815-4b71-bdc9-633888150922
---

Recently, I've started using VM by [exe.dev](https://exe.dev) as my primary development setup. And they come up with [Shelley Agent](https://github.com/boldsoftware/shelley) which you can access at `your-vm.shelley.exe.xyz`

But if you prefer to access it via a custom domain you can do so by proxying the request to port **9999**

In my case, I'm using ngix but you can use any web server.

Here is my ngix config for your reference
```conf
server {
    listen 8000;
    listen [::]:8000;
    server_name shelley.example.com;

    location / {
        proxy_pass http://127.0.0.1:9999;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket / Vite HMR upgrade
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 86400;
    }
}
```

Just ask Shelley Agent to do it. And it can do it for you!
