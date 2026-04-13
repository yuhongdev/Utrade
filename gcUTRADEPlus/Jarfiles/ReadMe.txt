   There are 2 versions of the jarfile available. Version 1 of the jarfile is named "getJavaInfo.jar"
and is 359 bytes. Version 2 of the jarfile is named "getJavaInfo2.jar" and is 485 bytes. 
Both versions of the jarfile are compatible with PluginDetect, and you may use either version 
in your Java detection scripts. (Do NOT try to use both versions in the same web page.)

   The version 1 jarfile (getJavaInfo.jar) allows PluginDetect to query the JRE directly to
determine the Java version and Java vendor. The version 2 jarfile (getJavaInfo2.jar) does 
everything that version 1 does, AND also the following:

        a) it allows PluginDetect to query the JRE for any additional Java properties that 
     the JRE is willing to reveal. The query is in the format of System.getProperty(S) where S 
     could be 'java.version', 'java.vendor', 'java.vm.name', 'java.vm.specification.name', etc... 
     This feature is currently not being utilized by PluginDetect, but it will be in a 
     future PluginDetect version.

        b) it allows PluginDetect to try to erase the "Applet A Started" message in the 
     browser statusbar, which occurs in some browsers when the jarfile applet is running. 
     The erase will only work if the browser allows this. The erase occurs from Java via the 
     applet, not purely from Javascript.



The jarfiles have been compressed with the Java Archive Grinder (jarg.jar).
This is to make the jarfiles as small as possible.
