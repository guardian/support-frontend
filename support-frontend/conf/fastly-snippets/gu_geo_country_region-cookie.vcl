# Subroutine to return a string representing the client's geolocation code, in the format "country-region" if region is available, or just "country" if not.

# We only set the GU_geo_country_region cookie for users in the US.
if (!req.http.Fastly-FF && client.geo.country_code == "US") {
    add resp.http.Set-Cookie = "GU_geo_country_region=" client.geo.country_code "-" client.geo.region "; path=/;";
}
