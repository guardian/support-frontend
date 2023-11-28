# type: error
if (obj.status == 618) {
  set obj.status = 301;
  set obj.response = "Moved Permanently";
  set req.http.Location = "https://www.theguardian.com";
  return (deliver);
}
