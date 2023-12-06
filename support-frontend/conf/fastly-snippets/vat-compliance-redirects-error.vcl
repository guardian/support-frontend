# type: error
if (obj.status == 619) {
   set obj.status = 301;
   set obj.http.Location = "https://support.theguardian.com/contribute";
   return (deliver);
}
