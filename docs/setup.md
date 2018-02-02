# Local Development Setup

In local development, the base app server has two layers of proxy sitting on top it:

1. Play/Scala appserver _(base server)_ - http://support.thegulocal.com:9210/
2. `webpack-dev-server` _(proxy providing hot-reloading of client-side code)_ - http://support.thegulocal.com:9211/
3. Nginx _(proxy adding HTTPS and a unified `.thegulocal.com` domain with other Guardian projects)_ - **https://support.thegulocal.com/uk ⬅ USE THIS IN YOUR WEB BROWSER**

You need all 3 of these running to have a working development environment.

## Config

This project uses shared config from the [support-config](https://github.com/guardian/support-config) library, as well as pulling in private config from S3.

Download config from S3: 

```$ aws s3 cp s3://membership-private/DEV/support-frontend.private.conf /etc/gu/support-frontend.private.conf --profile membership```


## Starting Play

Install [sbt](http://www.scala-sbt.org/download.html), and start the [Play server](https://www.playframework.com/)
running on port 9110, hot-reloading the server-side code:

```
$ sbt devrun
```

## Starting `webpack-dev-server`

Install [yarn](https://yarnpkg.com/lang/en/docs/install/). In order to run support-frontend, you need at least yarn version `1.0`.
Once yarn is installed, download client-side dependencies with:

```
yarn install
```
 
You can then start the `webpack-dev-server` proxy on port 9111, hot-reloading the client-side code:

```
$ yarn devrun
```

If you want to serve the assets without the `webpack-dev-server` proxy (to closer match Production)
you can run this instead:

```
$ yarn build-prod
```

## Setting up NGINX

Follow the setup instructions in [`/nginx/README.md`](../nginx/README.md).
