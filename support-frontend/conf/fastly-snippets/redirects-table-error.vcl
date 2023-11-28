# type: error
if (obj.status == 620 && table.contains(support_frontend_redirects, req.url.path)) {
  set resp.http.Location = "https://" + req.http.host + table.lookup(support_frontend_redirects, req.url.path) + if (std.strlen(req.url.qs) > 0, "?" req.url.qs, "");
}
