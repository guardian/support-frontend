# type: deliver
if (!req.http.Fastly-FF) {
    add resp.http.Set-Cookie = "GU_geo_country=" client.geo.country_code "; path=/;";
}
