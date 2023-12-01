# type: error
if (obj.status == 620 && table.contains(support_frontend_redirects, req.url.path)) {
  set obj.status = 301;
  set obj.response = "Moved Permanently";
  set req.http.Location = "https://" + req.http.host + table.lookup(support_frontend_redirects, req.url.path) + if (std.strlen(req.url.qs) > 0, "?" req.url.qs, "");
}
