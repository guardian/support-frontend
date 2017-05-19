# Support™ NGINX

## Setup Nginx for `Identity-Platform`

Support™ depends on Identity, so **you'll need to perform the**
[**Nginx setup for identity-platform**](https://github.com/guardian/identity-platform/blob/master/README.md#setup-nginx-for-local-development)
**first**, before you do anything else.

## Support-specific setup

#### Update your hosts file

Add the following local development domain to your hosts file in `/etc/hosts`:

```
127.0.0.1   sup.thegulocal.com
```

#### Run Support's Nginx setup script

Run the Support-specific [setup.sh](setup.sh) script from the root
of the `support-frontend` project:

```
./nginx/setup.sh
```

The script doesn't start Nginx. To manually start it run `sudo nginx` or `sudo systemctl start nginx`
depending on your system.

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
