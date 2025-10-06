# type: deliver
if (obj.status == 802 && obj.response == "redirect") {
  set obj.status = 308;
  set obj.http.Location = "https://www.theguardian.com/theobserverarchive";
  return (deliver);
}
