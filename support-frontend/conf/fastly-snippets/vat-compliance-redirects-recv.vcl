# type: recv
   if (
  client.geo.country_code == "RS"||
  client.geo.country_code == "EG"||
  client.geo.country_code == "PK"||
  client.geo.country_code == "MU"||
  client.geo.country_code == "BH"||
  client.geo.country_code == "MA"||
  client.geo.country_code == "MC"||
  client.geo.country_code == "OM"||
  client.geo.country_code == "GE"||
  client.geo.country_code == "NC"||
  client.geo.country_code == "TZ"||
  client.geo.country_code == "ZM"||
  client.geo.country_code == "AL"||
  client.geo.country_code == "BD"||
  client.geo.country_code == "KZ"||
  client.geo.country_code == "CW"||
  client.geo.country_code == "DO"||
  client.geo.country_code == "GP"||
  client.geo.country_code == "MQ"||
  client.geo.country_code == "PF"||
  client.geo.country_code == "TN"||
  client.geo.country_code == "BQ"||
  client.geo.country_code == "AX"||
  client.geo.country_code == "SN"||
  client.geo.country_code == "AM"||
  client.geo.country_code == "CM"||
  client.geo.country_code == "AO"||
  client.geo.country_code == "KG"||
  client.geo.country_code == "MR"||
  client.geo.country_code == "GA"||
  client.geo.country_code == "UZ"||
  client.geo.country_code == "MD"||
  client.geo.country_code == "DZ"||
  client.geo.country_code == "TJ"||
  client.geo.country_code == "LS"||
  client.geo.country_code == "CG"||
  client.geo.country_code == "TG"||
  client.geo.country_code == "NE"
)
{
  if (req.url ~ "^\/[a-z]{2}/subscribe/digital" && req.url == "/subscribe/digital"   ){
       error 619;
    }
}
