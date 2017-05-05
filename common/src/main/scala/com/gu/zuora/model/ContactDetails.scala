package com.gu.zuora.model

import com.gu.i18n.Country

case class ContactDetails(FirstName: String,
                          LastName: String,
                          WorkEmail: String,
                          Country: Country,
                          Address1: Option[String] = None,
                          Address2: Option[String] = None,
                          City: Option[String] = None,
                          PostalCode: Option[String] = None,
                          State: Option[String] = None)