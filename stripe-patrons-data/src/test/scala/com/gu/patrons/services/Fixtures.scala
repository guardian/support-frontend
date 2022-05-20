package com.gu.patrons.services

object Fixtures {
  val subscriptionJson = """
    {
      "id": "sub_HHdivtqWAZRZLT",
      "object": "subscription",
      "application": null,
      "application_fee_percent": null,
      "automatic_tax": {
        "enabled": false
      },
      "billing": "charge_automatically",
      "billing_cycle_anchor": 1589552553,
      "billing_thresholds": null,
      "cancel_at": null,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "collection_method": "charge_automatically",
      "created": 1589552553,
      "current_period_end": 1684160553,
      "current_period_start": 1652624553,
      "customer": {
        "id": "cus_HHdiVvexnd9Lp5",
        "object": "customer",
        "account_balance": 0,
        "address": null,
        "balance": 0,
        "created": 1589552553,
        "currency": "gbp",
        "default_source": null,
        "delinquent": false,
        "description": null,
        "discount": null,
        "email": "lovely_husb_steve@gmail.com",
        "invoice_prefix": "348460FF",
        "invoice_settings": {
          "custom_fields": null,
          "default_payment_method": null,
          "footer": null
        },
        "livemode": false,
        "metadata": {
        },
        "name": null,
        "next_invoice_sequence": 4,
        "phone": null,
        "preferred_locales": [

        ],
        "shipping": null,
        "sources": {
          "object": "list",
          "data": [

          ],
          "has_more": false,
          "total_count": 0,
          "url": "/v1/customers/cus_HHdiVvexnd9Lp5/sources"
        },
        "subscriptions": {
          "object": "list",
          "data": [
            {
              "id": "sub_HHdivtqWAZRZLT",
              "object": "subscription",
              "application": null,
              "application_fee_percent": null,
              "automatic_tax": {
                "enabled": false
              },
              "billing": "charge_automatically",
              "billing_cycle_anchor": 1589552553,
              "billing_thresholds": null,
              "cancel_at": null,
              "cancel_at_period_end": false,
              "canceled_at": null,
              "collection_method": "charge_automatically",
              "created": 1589552553,
              "current_period_end": 1684160553,
              "current_period_start": 1652624553,
              "customer": "cus_HHdiVvexnd9Lp5",
              "days_until_due": null,
              "default_payment_method": "pm_1Gj4QmJETvkRwpwqA3Lj2rkS",
              "default_source": null,
              "description": null,
              "discount": null,
              "ended_at": null,
              "invoice_customer_balance_settings": {
                "consume_applied_balance_on_void": true
              },
              "items": {
                "object": "list",
                "data": [
                  {
                    "id": "si_HHdiocbqdxwrRS",
                    "object": "subscription_item",
                    "billing_thresholds": null,
                    "created": 1589552554,
                    "metadata": {
                    },
                    "plan": {
                      "id": "recurring_5000",
                      "object": "plan",
                      "active": true,
                      "aggregate_usage": null,
                      "amount": 500000,
                      "amount_decimal": "500000",
                      "billing_scheme": "per_unit",
                      "created": 1534782079,
                      "currency": "gbp",
                      "interval": "year",
                      "interval_count": 1,
                      "livemode": false,
                      "metadata": {
                      },
                      "nickname": "5000",
                      "product": "prod_DSARLQMXTDrT7L",
                      "tiers": null,
                      "tiers_mode": null,
                      "transform_usage": null,
                      "trial_period_days": null,
                      "usage_type": "licensed"
                    },
                    "price": {
                      "id": "recurring_5000",
                      "object": "price",
                      "active": true,
                      "billing_scheme": "per_unit",
                      "created": 1534782079,
                      "currency": "gbp",
                      "livemode": false,
                      "lookup_key": null,
                      "metadata": {
                      },
                      "nickname": "5000",
                      "product": "prod_DSARLQMXTDrT7L",
                      "recurring": {
                        "aggregate_usage": null,
                        "interval": "year",
                        "interval_count": 1,
                        "trial_period_days": null,
                        "usage_type": "licensed"
                      },
                      "tax_behavior": "unspecified",
                      "tiers_mode": null,
                      "transform_quantity": null,
                      "type": "recurring",
                      "unit_amount": 500000,
                      "unit_amount_decimal": "500000"
                    },
                    "quantity": 1,
                    "subscription": "sub_HHdivtqWAZRZLT",
                    "tax_rates": [

                    ]
                  }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/subscription_items?subscription=sub_HHdivtqWAZRZLT"
              },
              "latest_invoice": "in_1KziOZJETvkRwpwq8DPOT2zl",
              "livemode": false,
              "metadata": {
                "paymentbenefitswaive": "false",
                "marketingconsent": "false",
                "marketingtext": "I am happy to receive Patrons newsletters and information about Patron benefits via email. You can unsubscribe at any time by emailing patrons@theguardian.com or clicking Unsubscribe in future email newsletters."
              },
              "next_pending_invoice_item_invoice": null,
              "pause_collection": null,
              "payment_settings": {
                "payment_method_options": null,
                "payment_method_types": null,
                "save_default_payment_method": null
              },
              "pending_invoice_item_interval": null,
              "pending_setup_intent": null,
              "pending_update": null,
              "plan": {
                "id": "recurring_5000",
                "object": "plan",
                "active": true,
                "aggregate_usage": null,
                "amount": 500000,
                "amount_decimal": "500000",
                "billing_scheme": "per_unit",
                "created": 1534782079,
                "currency": "gbp",
                "interval": "year",
                "interval_count": 1,
                "livemode": false,
                "metadata": {
                },
                "nickname": "5000",
                "product": "prod_DSARLQMXTDrT7L",
                "tiers": null,
                "tiers_mode": null,
                "transform_usage": null,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "quantity": 1,
              "schedule": null,
              "start": 1589552553,
              "start_date": 1589552553,
              "status": "active",
              "tax_percent": null,
              "test_clock": null,
              "transfer_data": null,
              "trial_end": null,
              "trial_start": null
            }
          ],
          "has_more": false,
          "total_count": 1,
          "url": "/v1/customers/cus_HHdiVvexnd9Lp5/subscriptions"
        },
        "tax_exempt": "none",
        "tax_ids": {
          "object": "list",
          "data": [

          ],
          "has_more": false,
          "total_count": 0,
          "url": "/v1/customers/cus_HHdiVvexnd9Lp5/tax_ids"
        },
        "tax_info": null,
        "tax_info_verification": null,
        "test_clock": null
      },
      "days_until_due": null,
      "default_payment_method": "pm_1Gj4QmJETvkRwpwqA3Lj2rkS",
      "default_source": null,
      "description": null,
      "discount": null,
      "ended_at": null,
      "invoice_customer_balance_settings": {
        "consume_applied_balance_on_void": true
      },
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_HHdiocbqdxwrRS",
            "object": "subscription_item",
            "billing_thresholds": null,
            "created": 1589552554,
            "metadata": {
            },
            "plan": {
              "id": "recurring_5000",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 500000,
              "amount_decimal": "500000",
              "billing_scheme": "per_unit",
              "created": 1534782079,
              "currency": "gbp",
              "interval": "year",
              "interval_count": 1,
              "livemode": false,
              "metadata": {
              },
              "nickname": "5000",
              "product": "prod_DSARLQMXTDrT7L",
              "tiers": null,
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "price": {
              "id": "recurring_5000",
              "object": "price",
              "active": true,
              "billing_scheme": "per_unit",
              "created": 1534782079,
              "currency": "gbp",
              "livemode": false,
              "lookup_key": null,
              "metadata": {
              },
              "nickname": "5000",
              "product": "prod_DSARLQMXTDrT7L",
              "recurring": {
                "aggregate_usage": null,
                "interval": "year",
                "interval_count": 1,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "tax_behavior": "unspecified",
              "tiers_mode": null,
              "transform_quantity": null,
              "type": "recurring",
              "unit_amount": 500000,
              "unit_amount_decimal": "500000"
            },
            "quantity": 1,
            "subscription": "sub_HHdivtqWAZRZLT",
            "tax_rates": [

            ]
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_HHdivtqWAZRZLT"
      },
      "latest_invoice": "in_1KziOZJETvkRwpwq8DPOT2zl",
      "livemode": false,
      "metadata": {
        "paymentbenefitswaive": "false",
        "marketingconsent": "false",
        "marketingtext": "I am happy to receive Patrons newsletters and information about Patron benefits via email. You can unsubscribe at any time by emailing patrons@theguardian.com or clicking Unsubscribe in future email newsletters."
      },
      "next_pending_invoice_item_invoice": null,
      "pause_collection": null,
      "payment_settings": {
        "payment_method_options": null,
        "payment_method_types": null,
        "save_default_payment_method": null
      },
      "pending_invoice_item_interval": null,
      "pending_setup_intent": null,
      "pending_update": null,
      "plan": {
        "id": "recurring_5000",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 500000,
        "amount_decimal": "500000",
        "billing_scheme": "per_unit",
        "created": 1534782079,
        "currency": "gbp",
        "interval": "year",
        "interval_count": 1,
        "livemode": false,
        "metadata": {
        },
        "nickname": "5000",
        "product": "prod_DSARLQMXTDrT7L",
        "tiers": null,
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 1,
      "schedule": null,
      "start": 1589552553,
      "start_date": 1589552553,
      "status": "active",
      "tax_percent": null,
      "test_clock": null,
      "transfer_data": null,
      "trial_end": null,
      "trial_start": null
    }
    """

}
