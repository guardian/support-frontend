# type: deliver
if (resp.status == 301 && req.url ~ "^/au/contribute/thefrontline") {
  set resp.http.Location = "/au/contribute?ticker=true&frontline-campaign=true&contributionTypes=one_off&" req.url.qs;
}
