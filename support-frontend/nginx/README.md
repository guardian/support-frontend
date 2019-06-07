# Support™ NGINX

- Install dependencies:
```bash
brew tap "guardian/devtools"
brew install "guardian/devtools/dev-nginx"
```

Or from the `nginx` directory:
```bash
brew bundle
```
- Run [setup.sh](setup.sh) script from the root of the `support-frontend` project:

```
./nginx/setup.sh
```

#### NGINX error messages

nginx has some unhelpful error messages. Here are some translations:

###### When stopping/reloading nginx
```
nginx: [error] open() "/usr/local/var/run/nginx.pid" failed (2: No such file or directory)
```

This means nginx is **not running**. And `nginx -s reload` will not automatically start nginx if it's not running.

###### When starting nginx
```
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
```

This means nginx is **already running**.
