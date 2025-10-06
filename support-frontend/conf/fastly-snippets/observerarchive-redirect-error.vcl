# type: error
if (obj.status == 802 && obj.response == "redirect") {
  set obj.status = 308;
  set obj.http.Location = "https://" + regsub(req.http.host, "^observer\\.", "") + req.url;
  return (deliver);
}
