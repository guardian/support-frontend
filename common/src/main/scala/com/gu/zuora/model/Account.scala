package com.gu.zuora.model

import com.gu.i18n.Currency

case class Account(Name: String,
                   Currency: Currency,
                   CrmId: String, //Salesforce accountId
                   sfContactId__c: String, //Salesforce contactId
                   IdentityId__c: String,
                   PaymentGateway: PaymentGateway,
                   BillCycleDay: Int = 0,
                   AutoPay: Boolean = true,
                   PaymentTerm: String = "Due Upon Receipt",
                   BcdSettingOption: String = "AutoSet",
                   Batch: String = "Batch1")