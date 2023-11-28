# type: recv
if (table.contains(support_frontend_redirects, req.url.path)) {
  error 620 "redirect";
}
