# Support-frontend

Frontend for the new [supporter platform](https://support.theguardian.com/).

## SSH

Use SSM Tunnel - [ssm-scala](https://github.com/guardian/ssm-scala#enabling-ssm-tunnel):

```
ssm ssh --profile membership --tags frontend,support,CODE -a -x --newest --ssm-tunnel
```

## Dependency Overrides in build.sbt

We use [sbt’s
dependencyOverrides](https://www.scala-sbt.org/1.x/docs/Library-Management.html#Overriding+a+version)
in a couple of places to raise the version of a dependency deep in our
dependency tree, where we don’t want to raise the versions of intermediate
dependencies.

Using `dependencyOverrides` puts the onus on us to guarantee that our
dependencies are compatible with the newer version of the package we’re forcing,
which we do by relying on our builds to fail, or our testing to reveal issues.
It’s unclear if this is always enough: it seems plausible that overriding
dependencies like this might cause subtle bugs that we don’t discover for some
time.

That said, we haven’t encountered any issues with this yet: everything seems to
have worked fine. This notice is here to document our uncertainty about the risk
involved in overriding dependencies like this.
