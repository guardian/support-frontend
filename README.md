[ ![Download](https://api.bintray.com/packages/guardian/ophan/acquisition-event-producer-play26/images/download.svg) ](https://bintray.com/guardian/ophan/acquisition-event-producer-play26/_latestVersion)

# acquisition event producer
A tool to submit Acquisition events to Ophan.

## usage 
### in Play projects
Add a dependency on the package that corresponds to your version of Play:

`libraryDependencies += "com.gu" %% "acquisition-event-producer-play24" % "3.0.0"`

`libraryDependencies += "com.gu" %% "acquisition-event-producer-play25" % "3.0.0"`

**Play 2.4 and 2.5 are only supported up to version 3.x.x** (see Scala 2.12 upgrade warnings below)
`libraryDependencies += "com.gu" %% "acquisition-event-producer-play26" % "4.0.0"`

### in projects that don't use Play
Import any of the above three projects - the same Circe encoders/decoders are included in each one.
 
Create an instance of `AcquisitionSubmissionBuilder` in your project. Pass this to `submit` in either `DefaultOphanService` or `MockOphanService` (depending on whether you're in test or live mode) build and (in the case of `DefaultOphanService`) submit the event.

## Scala 2.12 upgrade warnings

Please note since March 2018 and version 4.x.x the library has been upgraded to use Scala 2.12.

play-json 2.5.x and 2.4.x has no support for Scala 2.12 therefore play24 are play25 have been removed from the build.

More info: https://mvnrepository.com/artifact/com.typesafe.play/play-json
