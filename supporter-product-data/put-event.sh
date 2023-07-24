# Send a test event to the supporter-product-data-CODE event bus
aws events put-events --entries file://event.json
