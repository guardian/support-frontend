package com.gu.zuora.model

import com.gu.i18n.Country

case class ContactDetails(firstName: String,
                          lastName: String,
                          workEmail: String,
                          country: Country,
                          address1: Option[String] = None,
                          address2: Option[String] = None,
                          city: Option[String] = None,
                          postalCode: Option[String] = None,
                          state: Option[String] = None)