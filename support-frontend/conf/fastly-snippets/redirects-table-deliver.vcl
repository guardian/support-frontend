# type: deliver
if (resp.status == 301 && table.contains(redirects, req.url.path)) {
  set resp.http.Location = "https://" + req.http.host + table.lookup(redirects, req.url.path) + if (std.strlen(req.url.qs) > 0, "?" req.url.qs, "");
}
