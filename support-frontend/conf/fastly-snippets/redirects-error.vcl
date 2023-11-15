# type: error
if (obj.status == 618) {
   set obj.status = 301;
   set obj.response = "Moved Permanently";
   synthetic {""};
   return (deliver);
}
