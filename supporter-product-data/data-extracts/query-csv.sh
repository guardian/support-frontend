 # To run this you will need to install Q http://harelba.github.io/q/
 # eg. `brew install q`
 #q -d , -H "Select count(0) from ./last-extract.csv" 954217 949476
 q -d , -H "Select ProductRatePlan_Name, ProductRatePlan_ID, count(0) from ./last-extract.csv group by ProductRatePlan_Name, ProductRatePlan_ID"
 #q -d , -H "Select * from ./last-extract-with-cont.csv where ProductRatePlan_ID not in select ProductRatePlan_ID from ./last-extract.csv"
