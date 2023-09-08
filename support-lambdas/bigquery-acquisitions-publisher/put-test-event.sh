# Send a test event to the acquisitions-bus-CODE event bus
aws events put-events --entries file://event.json
