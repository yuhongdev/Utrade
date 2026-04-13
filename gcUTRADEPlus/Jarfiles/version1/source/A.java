/*  getJavaInfo.jar applet version 1.0 */

import java.applet.*;

 public class A extends Applet
 {
    public String getVersion()
    {
      return System.getProperty("java.version");
    }

    public String getVendor()
    {
      return System.getProperty("java.vendor");
    }
 }
