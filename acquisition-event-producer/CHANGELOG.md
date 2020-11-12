# v3.0.0
* change to use cats version 1.0 (this can [cause binary incompatibilities that only show up in prod](https://github.com/guardian/subscriptions-frontend/pull/1067), beware)
* update version of circe to match (and fezziwig to avoid a further binary incompability)

# v2.0.4
* change release process to publish 3 different packages for play-json 2.4, 2.5 and 2.6

# v2.0.0-rc2
* add `AcquisitionSubmission` to represent a combination of an `Acquisition` and `OphanIds`
* add the `AcquisitionSubmissionBuilder` type class for generating acquisition submissions
* add `ReferrerAcquisitionData` to model acquisition data sent from the referring page 

# v2.0.0-rc1
* make all browser id optional solving issue #5 - this is compatible with the Tracker. So far, the only acquisition events that have failed to be submitted from contributions frontend are ones where browser id was missing, so hopefully after this release, all will be submitted successfully
* make Ophan endpoint publicly available - useful (for e.g. logging) when the Ophan service is being used by other applications
* expose the production endpoint as a static value
* don't serialise the amountInGBP field as it will most likely be deprecated from acquisition events
* use Fezziwig for automatic derivation of Circe encoders and decoders (note this slightly changes the way abTests is serialised, so we'll need to update the Ophan extractor to support the new format)
