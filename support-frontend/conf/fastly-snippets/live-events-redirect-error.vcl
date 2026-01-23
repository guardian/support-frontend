# type: error
if (obj.status == 621 && obj.response == "redirect") {
  set obj.status = 301;
  set obj.http.Location = "https://www.theguardian.com/guardian-live-events";
  return (deliver);
}
