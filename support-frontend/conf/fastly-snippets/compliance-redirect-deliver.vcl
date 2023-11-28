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
  client.geo.country_code == "YE"
)) {
  set resp.http.Location = "https://www.theguardian.com";
}
