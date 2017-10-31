# Local Development Setup

In local development, the base app server has two layers of proxy sitting on top it:

1. Play/Scala appserver _(base server)_ - http://support.thegulocal.com:9110/
2. `webpack-dev-server` _(proxy providing hot-reloading of client-side code)_ - http://support.thegulocal.com:9111/
3. Nginx _(proxy adding HTTPS and a unified `.thegulocal.com` domain with other Guardian projects)_ - **https://support.thegulocal.com/ ⬅ USE THIS IN YOUR WEB BROWSER**

You need all 3 of these running to have a working development environment.

## Installing client-side dependencies
Install [yarn](https://yarnpkg.com/lang/en/docs/install/) and download client-side dependencies with:

```
yarn install
```

## Running the app

Download config from S3: 

```$ aws s3 cp s3://membership-private/DEV/support-frontend.private.conf /etc/gu/support-frontend.private.conf --profile membership```

Install [sbt](http://www.scala-sbt.org/download.html). Start the [Play server](https://www.playframework.com/)
running on port 9110, hot-reloading the server-side code, and `webpack-dev-server` on port 9111, hot-reloading the client-side code with:

```
$ sbt devrun
```

## Compiling client-side assets in production mode

If you want to serve the assets without the `webpack-dev-server` proxy (to closer match Production)
you can run this instead:

```
$ yarn build-prod
```

## Setting up NGINX

Follow the setup instructions in [`/nginx/README.md`](../nginx/README.md).