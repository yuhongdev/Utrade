/*
                        OTF_NOTF_Simple.js v0.3.6  by Eric Gerds

 - This script, together with PluginDetect and getJavaInfo2.jar, is capable of doing
 both OTF and NOTF Java detection. 
 
 - NOTF detection can only be performed by this script if the PluginDetect script is
 generated with the "NOTF" checkbox enabled.

 - Java Detection is performed BEFORE the browser window has loaded.

 - Feel free to change this script, remove comments, etc... to fit your own needs.


 USAGE:
  1) Insert the PluginDetect script in the <head> of your HTML page:
        <script type="text/javascript" src="PluginDetect.js"></script>

  2) Insert the output <div> in the <body> of your HTML page. This div will receive the
     plugin detection results:
        <div id="javaresult"></div>

  3) If you wish to use the plugindetect <div>, then place it wherever you wish in the
     <body>. For example:
        <div id="plugindetect" style="right:0px; top:0px; position:absolute;"></div>

  4) This script starts doing detection as soon as it has loaded. Therefore, it should be placed
     AFTER the output <div> and after the plugindetect <div> (assuming you even specifed
     the plugindetect <div>). For example:
        <div id="javaresult"></div>
        <div id="plugindetect" style="right:0px; top:0px; position:absolute;"></div>
        <script type="text/javascript" src="OTF_NOTF_Simple.js"></script>

  5) Get a copy of the "getJavaInfo2.jar" jarfile and put it in the same folder as your
     HTML page.

     If you put the jarfile in a different directory than the HTML page, then
     you must adjust the path of the jarfile.
     The jarfile path is always relative to the web page.

     For example, say your web page is at http://www.mysite.com/webpage.htm
     and you have the jarfile at         http://www.mysite.com/stuff/getJavaInfo2.jar
     then jarfile = "stuff/getJavaInfo2.jar"

     If your web page is at      http://www.mysite.com/webpage.htm
     and you have the jarfile at http://www.mysite.com/getJavaInfo2.jar
     then jarfile = "getJavaInfo2.jar"


*/


// GLOBAL VARIABLES
var PD = PluginDetect;
var outputNode = 'javaresult';    // Id of output <div>. Detection results are placed in this div.
var JavaInstalled;                // Tells if Java is installed or not
var JavaVersion;                  // Highest installed version
var minVersion = '1,4,2';         // minimum version of Java we are trying to detect

// The path of the jarfile is relative to the web page ( NOT relative to this
// external javascript file!!! ). Only the very first Java PluginDetect command that is executed
// needs to have the jarfile input argument. You do not have to specify this input arg in
// any subsequent Java PluginDetect commands.
var jarfile = '/gcCIMB/Jarfiles/version2/getJavaInfo2.jar';

// If the verifyTags input argument is not specified or is null, then PluginDetect assumes
// a default value of [2,2,2]. Only the very first Java PluginDetect command
// would need to have the verifyTags input argument, if at all. You do not have to specify 
// this input arg in any subsequent Java PluginDetect commands.
var verifyTags = null;



function addText(node, text){
     var N = document.getElementById(node);
     if (N){
        N.appendChild(document.createTextNode(text));
        N.appendChild(document.createElement('br'));
     }
};




// This event handler sets the GLOBAL JAVA VARIABLES, and prints the results to the screen
function displayResults($){

  var JavaStatus;


  // -----------------------------------------------------------------------------------
  // Test whether Java is installed or not.


  // Note that PluginDetect.isMinVersion('Java') is equivalent to
  //    PluginDetect.isMinVersion('Java', '0').
  JavaStatus = $.isMinVersion('Java');

  JavaInstalled = JavaStatus >= 0 ? true : false;

  addText(outputNode, "Java (using <applet> and/or <object> tag) installed & enabled: " + (JavaInstalled ? 'true' : 'false'));


  // -----------------------------------------------------------------------------------
  // Display the highest installed Java version.

  JavaVersion = $.getVersion('Java');

  addText(outputNode, "Highest Installed Java Version: " + JavaVersion);


  // ------------------------------------------------------------------------------------
  // Check if some minimum Java version is installed

  JavaStatus = $.isMinVersion('Java', minVersion);

  if (JavaStatus == 1){
     addText(outputNode, 'Java ' + minVersion + ' or higher (using <applet> and/or <object> tag) is installed & enabled.');
  }

  else if (JavaStatus == 0){
     addText(outputNode, 'Java installed & enabled but version is unknown');
  }


  else if (JavaStatus == -0.2){
     addText(outputNode, 'Java installed but not enabled');
  }


  else if (JavaStatus == -0.5 || JavaStatus == 0.5){
      addText(outputNode, 'Java detection: not completed yet, requires NOTF detection.');
  }


  else if (JavaStatus == -1){
     addText(outputNode, 'Java version is < ' + minVersion + ' or not installed / not enabled');
  }




};  // end of displayResults()



PD.onDetectionDone('Java', displayResults, jarfile, verifyTags);



