#!/bin/bash

# Log Group to search
LOG_GROUP="/aws/lambda/support-FailureHandlerLambda-PROD"

# Search window (Default: 24 hours ago)
# Using MacOS date format (-v) as per your environment
START_TIME=$(date -v-14d +%s000)

echo "Searching $LOG_GROUP for checkout failure reasons matching:"
echo "--------------------------------------------------------"

# List of failure reasons using case object names from CheckoutFailureReasons.scala
TERMS=(
  "StripePaymentMethodDisabled"
  "InsufficientFunds"
  "PaymentMethodDetailsIncorrect"
  "PaymentMethodTemporarilyDeclined"
  "PaymentMethodUnacceptable"
  "PaymentProviderUnavailable"
  "PaymentRecentlyTaken"
  "AccountMismatch"
)

# Construct Filter Pattern: ?"Term1" ?"Term2" ...
# This syntax tells CloudWatch to match if ANY of the terms are present (OR logic)
FILTER_PATTERN=""
for term in "${TERMS[@]}"; do
  echo "- $term"
  FILTER_PATTERN="$FILTER_PATTERN ?\"checkoutFailureReason = $term\""
done

echo "--------------------------------------------------------"
echo "Starting search (last 14 days)..."

# Run AWS CLI command
aws logs filter-log-events \
  --log-group-name "$LOG_GROUP" \
  --start-time "$START_TIME" \
  --filter-pattern "$FILTER_PATTERN" \
  --query 'events[*].[timestamp, message]' \
  --output text
