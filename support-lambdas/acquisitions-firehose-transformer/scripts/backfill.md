### backfill.sc
On 2021-11-24 we failed to write most acquisitions to the acquisition_events_prod athena table.

This was caused by a temporary fixer.io outage, which meant we didn't have currency rates in dynamodb.

We backfilled the missing data by:

1. dumping acquisitions from BigQuery with:
```
SELECT payment_frequency,country_code,amount,currency,event_timestamp,campaign_codes,component_id,product,payment_provider,referrer_url,annualised_value, annualised_value_in_gbp,labels FROM `datatech-platform-prod.datalake.acquisitions`
WHERE received_date = date'2021-11-24'
AND product IN('CONTRIBUTION', 'RECURRING_CONTRIBUTION')
```
2. running the backfill.sc script with ammonite: `amm backfill.sc /path/to/file.csv > backfill`
3. deleting any successful data for that date from s3 at: acquisition-events/PROD/2021/11/24/
4. uploading the output file (containing a json object per line) to S3 at: acquisition-events/PROD/2021/11/24/
5. confirmed it worked in athena with: `SELECT * FROM acquisition_events_prod WHERE acquisition_date = date'2021-11-24'`

