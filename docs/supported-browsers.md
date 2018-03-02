# Supported Browsers

### **Date of last revision:** 01-03-2018 (DD-MM-YYYY)
### **Date of next revision:** 03-09-2018 (DD-MM-YYYY)

## The list of supported browsers is:

### Browsers we don't want to break 

* Chrome 38 and above
* Safari 8 and above
* IE 11
* Microsoft Edge all versions
* Firefox 44 and above
* Samsung 4 and above
* Opera 25 and above

Note about Android WebView and iOS WebView:
> iOS WebView should be mostly equivalent to **Safari**, and Android WebView (for recent versions of Android) should be mostly equivalent to **Chrome**. Based on this premise we have concluded that by supporting their parent browsers we implicitly include support for these WebView as well. However, if we discover that there are problems with this approach then we will revise it. 

### Browsers we will fix if someone raise an issue that something is wrong

* Opera Mini
* amazon Silk

### Coverage: 98.08% of our traffic

### Methodology:

Generate a report with GA containing "browser","browser version" and "Sessions".
Include browsers versions until we cover a total of at least **98%** of the total amount of sessions.

We are going to check the list of supported browsers every 6 months. In the case of a dependency dropping support for 
one of our supported browsers we should do this analysis as soon as possible.  
 


 