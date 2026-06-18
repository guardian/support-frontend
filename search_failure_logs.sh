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
"approve_with_id"
"call_issuer"
"card_not_supported"
"card_velocity_exceeded"
"currency_not_supported"
"do_not_try_again"
"duplicate_transaction"
"expired_card"
"fraudulent"
"incorrect_number"
"incorrect_cvc"
"incorrect_pin"
"incorrect_zip"
"insufficient_funds"
"invalid_account"
"invalid_amount"
"invalid_cvc"
"invalid_expiry_year"
"invalid_number"
"invalid_pin"
"issuer_not_available"
"lost_card"
"new_account_information_available"
"no_action_taken"
"not_permitted"
"pickup_card"
"pin_try_exceeded"
"processing_error"
"reenter_transaction"
"restricted_card"
"revocation_of_all_authorizations"
"revocation_of_authorization"
"security_violation"
"service_not_allowed"
"stolen_card"
"stop_payment_order"
"transaction_not_allowed"
"try_again_later"
"withdrawal_count_limit_exceeded"
)

# Function to run search
run_search() {
  local batch_pattern=$1
  aws logs filter-log-events \
    --log-group-name "$LOG_GROUP" \
    --start-time "$START_TIME" \
    --filter-pattern "$batch_pattern" \
    --query 'events[*].[timestamp, message]' \
    --output text
}

echo "--------------------------------------------------------"
echo "Starting search (last 14 days)..."

# Iterate through terms in batches of 10 to respect 1024 char limit
BATCH_SIZE=10
idx=0
FILTER_PATTERN=""

for term in "${TERMS[@]}"; do
  echo "- $term"
  FILTER_PATTERN="$FILTER_PATTERN ?\"$term\""

  ((idx++))

  if (( idx % BATCH_SIZE == 0 )); then
     run_search "$FILTER_PATTERN"
     FILTER_PATTERN=""
  fi
done

# Run for any remaining terms
if [[ -n "$FILTER_PATTERN" ]]; then
  run_search "$FILTER_PATTERN"
fi
