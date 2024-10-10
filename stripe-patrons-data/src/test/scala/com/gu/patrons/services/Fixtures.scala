package com.gu.patrons.services

object Fixtures {
  val subscriptionJson: String = """
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
        "email": "fake.address@gmail.com",
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

  val patronCancelledEventJson: String =
    """
      {
        "id": "evt_1LudpBJETvkRwpwqmTN4BiHf",
        "object": "event",
        "api_version": "2018-07-27",
        "created": 1666191893,
        "data": {
            "object": {
                "id": "sub_sched_1Ludp9JETvkRwpwqjpaRy7xf",
                "object": "subscription_schedule",
                "application": null,
                "billing": "charge_automatically",
                "billing_thresholds": null,
                "canceled_at": 1666191892,
                "collection_method": "charge_automatically",
                "completed_at": null,
                "created": 1666191891,
                "current_phase": null,
                "customer": "cus_Mdvgw8EXalnWPN",
                "default_payment_method": null,
                "default_settings": {
                    "application_fee_percent": null,
                    "automatic_tax": {
                        "enabled": false
                    },
                    "billing_cycle_anchor": "automatic",
                    "billing_thresholds": null,
                    "collection_method": "charge_automatically",
                    "default_payment_method": null,
                    "default_source": null,
                    "description": null,
                    "invoice_settings": null,
                    "transfer_data": null
                },
                "default_source": null,
                "end_behavior": "release",
                "invoice_settings": null,
                "livemode": false,
                "metadata": {},
                "phases": [
                    {
                        "add_invoice_items": [],
                        "application_fee_percent": null,
                        "billing_cycle_anchor": null,
                        "billing_thresholds": null,
                        "collection_method": null,
                        "coupon": null,
                        "currency": "usd",
                        "default_payment_method": null,
                        "default_tax_rates": [],
                        "description": null,
                        "end_date": 1668870291,
                        "invoice_settings": null,
                        "metadata": {},
                        "plans": [
                            {
                                "billing_thresholds": null,
                                "plan": "price_1Ludp3JETvkRwpwqqzio1ZAa",
                                "price": "price_1Ludp3JETvkRwpwqqzio1ZAa",
                                "quantity": 1,
                                "tax_rates": []
                            }
                        ],
                        "prorate": true,
                        "proration_behavior": "create_prorations",
                        "start_date": 1666191891,
                        "tax_percent": null,
                        "transfer_data": null,
                        "trial_end": null
                    },
                    {
                        "add_invoice_items": [],
                        "application_fee_percent": null,
                        "billing_cycle_anchor": null,
                        "billing_thresholds": null,
                        "collection_method": null,
                        "coupon": null,
                        "currency": "usd",
                        "default_payment_method": null,
                        "default_tax_rates": [],
                        "description": null,
                        "end_date": 1671462291,
                        "invoice_settings": null,
                        "metadata": {},
                        "plans": [
                            {
                                "billing_thresholds": null,
                                "plan": "price_1Ludp3JETvkRwpwqqzio1ZAa",
                                "price": "price_1Ludp3JETvkRwpwqqzio1ZAa",
                                "quantity": 2,
                                "tax_rates": []
                            }
                        ],
                        "prorate": true,
                        "proration_behavior": "create_prorations",
                        "start_date": 1668870291,
                        "tax_percent": null,
                        "transfer_data": null,
                        "trial_end": null
                    }
                ],
                "released_at": null,
                "released_subscription": null,
                "renewal_behavior": "release",
                "renewal_interval": null,
                "status": "canceled",
                "subscription": "sub_1Ludp9JETvkRwpwqycRMOqKB",
                "test_clock": null
            },
            "previous_attributes": {
                "canceled_at": null,
                "current_phase": {
                    "end_date": 1668870291,
                    "start_date": 1666191891
                },
                "status": "active"
            }
        },
        "livemode": false,
        "pending_webhooks": 1,
        "request": {
            "id": "req_72L2bFQ27rqY96",
            "idempotency_key": "74a42f32-b262-40ec-b94b-a220744b4fcb"
        },
        "type": "subscription_schedule.canceled"
    }
    """

  val patronSignUpEventJson: String = """
{
  "id": "evt_1MX3M1JETvkRwpwqAQ6JAXKW",
  "object": "event",
  "api_version": "2018-07-27",
  "created": 1675346492,
  "data": {
    "object": {
      "id": "sub_1MX3LyJETvkRwpwqyBQPVmqs",
      "object": "subscription",
      "application": null,
      "application_fee_percent": null,
      "automatic_tax": {
        "enabled": false
      },
      "billing": "charge_automatically",
      "billing_cycle_anchor": 1675346490,
      "billing_thresholds": null,
      "cancel_at": null,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "collection_method": "charge_automatically",
      "created": 1675346490,
      "currency": "usd",
      "current_period_end": 1677765690,
      "current_period_start": 1675346490,
      "customer": "cus_NHcbq5RLIqP2ph",
      "days_until_due": null,
      "default_payment_method": null,
      "default_source": null,
      "default_tax_rates": [
      ],
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
            "id": "si_NHcb50foRmNuDf",
            "object": "subscription_item",
            "billing_thresholds": null,
            "created": 1675346490,
            "metadata": {
            },
            "plan": {
              "id": "price_1MX3LwJETvkRwpwqfjzAmon3",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 1500,
              "amount_decimal": "1500",
              "billing_scheme": "per_unit",
              "created": 1675346488,
              "currency": "usd",
              "interval": "month",
              "interval_count": 1,
              "livemode": false,
              "metadata": {
              },
              "nickname": null,
              "product": "prod_NHcbhQxmqs2uhX",
              "tiers": null,
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "price": {
              "id": "price_1MX3LwJETvkRwpwqfjzAmon3",
              "object": "price",
              "active": true,
              "billing_scheme": "per_unit",
              "created": 1675346488,
              "currency": "usd",
              "custom_unit_amount": null,
              "livemode": false,
              "lookup_key": null,
              "metadata": {
              },
              "nickname": null,
              "product": "prod_NHcbhQxmqs2uhX",
              "recurring": {
                "aggregate_usage": null,
                "interval": "month",
                "interval_count": 1,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "tax_behavior": "unspecified",
              "tiers_mode": null,
              "transform_quantity": null,
              "type": "recurring",
              "unit_amount": 1500,
              "unit_amount_decimal": "1500"
            },
            "quantity": 1,
            "subscription": "sub_1MX3LyJETvkRwpwqyBQPVmqs",
            "tax_rates": [
            ]
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_1MX3LyJETvkRwpwqyBQPVmqs"
      },
      "latest_invoice": "in_1MX3LyJETvkRwpwqqc7U7For",
      "livemode": false,
      "metadata": {
      },
      "next_pending_invoice_item_invoice": null,
      "on_behalf_of": null,
      "pause_collection": null,
      "payment_settings": {
        "payment_method_options": null,
        "payment_method_types": null,
        "save_default_payment_method": "off"
      },
      "pending_invoice_item_interval": null,
      "pending_setup_intent": null,
      "pending_update": null,
      "plan": {
        "id": "price_1MX3LwJETvkRwpwqfjzAmon3",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 1500,
        "amount_decimal": "1500",
        "billing_scheme": "per_unit",
        "created": 1675346488,
        "currency": "usd",
        "interval": "month",
        "interval_count": 1,
        "livemode": false,
        "metadata": {
        },
        "nickname": null,
        "product": "prod_NHcbhQxmqs2uhX",
        "tiers": null,
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 1,
      "schedule": null,
      "start": 1675346490,
      "start_date": 1675346490,
      "status": "active",
      "tax_percent": null,
      "test_clock": null,
      "transfer_data": null,
      "trial_end": null,
      "trial_start": null
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_9ZXeimLfCZX3H6",
    "idempotency_key": "5fa1e180-2617-4f92-bc13-8e28835d4a38"
  },
  "type": "customer.subscription.created"
}
"""

}
