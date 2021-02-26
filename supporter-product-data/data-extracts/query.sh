 # To run this you will need to install Q http://harelba.github.io/q/
 # eg. `brew install q`
 #q -d , -H "Select count(0) from ./last-extract.csv"
 q -d , -H "Select ProductRatePlan_Name, ProductRatePlan_ID, count(0) from ./last-extract.csv group by ProductRatePlan_Name, ProductRatePlan_ID"
