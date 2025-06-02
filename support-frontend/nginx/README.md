# Support™ NGINX

#### Installing NGINX

- nginx will be installed and configured by running the setup script from the root the project:

```
pnpm setup
```

#### Running nginx

```
sudo nginx
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
