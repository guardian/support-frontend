# type: deliver
if (resp.status == 301 && (
  client.geo.country_code == "AF" ||
  client.geo.country_code == "BY" ||
  client.geo.country_code == "CU" ||
  client.geo.country_code == "IR" ||
  client.geo.country_code == "LY" ||
  client.geo.country_code == "KP" ||
  client.geo.country_code == "RU" ||
  client.geo.country_code == "SS" ||
  client.geo.country_code == "SY" ||
  client.geo.country_code == "UA" ||
  client.geo.country_code == "VE" ||
  client.geo.country_code == "YE" ||
  client.geo.country_code == "BA" ||
  client.geo.country_code == "HT" ||
  client.geo.country_code == "BI" ||
  client.geo.country_code == "CD" ||
  client.geo.country_code == "CF" ||
  client.geo.country_code == "GN" ||
  client.geo.country_code == "GW" ||
  client.geo.country_code == "IQ" ||
  client.geo.country_code == "LB" ||
  client.geo.country_code == "ML" ||
  client.geo.country_code == "MM" ||
  client.geo.country_code == "NI" ||
  client.geo.country_code == "SO" ||
  client.geo.country_code == "ZW"
)) {
  set resp.http.Location = "https://www.theguardian.com";
}
