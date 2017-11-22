# acquisition event producer
A tool to submit Acquisition events to Ophan.

## usage 
### in Play projects
Add a dependency on the version that corresponds to your version of Play:

`libraryDependencies += "com.gu" %% "acquisition-event-producer-play24" % "2.0.4"`

`libraryDependencies += "com.gu" %% "acquisition-event-producer-play25" % "2.0.4"`

`libraryDependencies += "com.gu" %% "acquisition-event-producer-play26" % "2.0.4"`

### in projects that don't use Play
Import any of the above three projects - the same Circe encoders/decoders are included in each one.
 
Create an instance of `AcquisitionSubmissionBuilder` in your project. Pass this to `submit` in either `DefaultOphanService` or `MockOphanService` (depending on whether you're in test or live mode) build and (in the case of `DefaultOphanService`) submit the event.
