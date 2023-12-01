# type: error
if (obj.status == 618) {
  set obj.status = 301;
  set obj.response = "Moved Permanently";
  set obj.http.Location = "https://www.theguardian.com";
  return (deliver);
}
