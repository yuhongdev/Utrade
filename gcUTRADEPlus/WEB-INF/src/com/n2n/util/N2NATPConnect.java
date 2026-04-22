package com.n2n.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import javax.servlet.http.HttpSession;
import com.n2n.connection.LoginContext;
import com.n2n.connection.TCException;

public class N2NATPConnect {
	private java.lang.String m_atpDest;
	private java.lang.String m_session;
	private java.lang.String m_userparam;
	private java.lang.String m_exchg;
	private boolean m_isDisposable;
	private boolean debugM = false;
	private com.n2n.connection.LoginContext m_context;
	private java.lang.String exchange;
	java.text.SimpleDateFormat sdf;

	public N2NATPConnect(java.lang.String url, java.lang.String exchange) {
		this(url);
		this.exchange = exchange;
//		java.lang.System.out.println((new StringBuilder("Exchange ")).append(exchange).toString());
	}

	public N2NATPConnect(java.lang.String url) {
		m_atpDest = null;
		m_session = null;
		m_userparam = null;
		m_exchg = null;
		m_isDisposable = false;
		m_context = null;
		exchange = "";
		sdf = new java.text.SimpleDateFormat("yyyyMMddHHmmss.SSS");
		if (url != null) {
			if (!url.startsWith("http://"))
				url = (new StringBuilder("http://")).append(url).toString();
			if (!url.endsWith("/"))
				url = (new StringBuilder(java.lang.String.valueOf(url))).append("/").toString();
			m_atpDest = url;
		}
	}

	public com.n2n.connection.LoginContext login(java.lang.String loginID, java.lang.String passwd, HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String data = "";

		loginID = encryptString(loginID);
		passwd = encryptString(passwd);
		if (debugM) {
			java.lang.System.out.println((new StringBuilder("encPass:")).append(passwd).toString());
		}
		data = readData((new StringBuilder(java.lang.String.valueOf(m_atpDest))).append("TradeLogin").toString(), null, new java.lang.String[] { "PullMode=1", (new StringBuilder("UserName=")).append(loginID).toString(), (new StringBuilder("Password=")).append(passwd).toString(), "Compress=0",
				"AppName=A", "EncryptedUP=1", (new StringBuilder("BHCode=")).append(oN2NSession.getSetting("WebBHCode")).toString() });
//				"AppName=A" });

		com.n2n.connection.LoginContext context = processLoginMessage(data, session);
		if (data != null && !data.equals("")) {
			if (data.length() > 5) {
				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
					// Request to sync with TCPro error message
					context.setErrorMsg(data.substring(6));
//					context.setErrorMsg(data.substring(data.indexOf("ATP -")+("ATP -".length()+1)));
				}
			}
		}
		context.setLoginID(loginID);
		if (debugM) {
			System.out.println("loginID:" + context.getLoginID());
			System.out.println("setErrorMsg:" + context.getErrorMsg());
		}
		return context;
	}

	public void loginLMS(java.lang.String loginID, javax.servlet.http.HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String data = "";
		java.lang.String parameter = "TCAuthen2BEACON?";
		com.n2n.DB.N2NSession oN2NSession = (com.n2n.DB.N2NSession)session.getAttribute("oN2NSession");
		java.lang.String sponsorID = oN2NSession.getSetting("sponsorID");
		data = readDataLMS((new StringBuilder(java.lang.String.valueOf(m_atpDest))).append(parameter).toString(), new java.lang.String[] {
			(new StringBuilder("mobileno=")).append(loginID).toString(), (new StringBuilder("c=")).append("1").toString(), (new StringBuilder("sponsorid=")).append(sponsorID).toString(), (new StringBuilder("appver=")).append("").toString(), (new StringBuilder("prod=")).append("TCWEB").toString()
		});
		processLoginMessageLMS(data, session);
	}

	public String changePasswd(java.lang.String exCliCodes, java.lang.String loginID, java.lang.String passwd, java.lang.String newPasswd, HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String exCliCode = exCliCodes;
		java.lang.String userName = loginID;

			passwd = encryptString(passwd);
			newPasswd = encryptString(newPasswd);

			if (userName.length() > 0 && java.lang.Character.isLetterOrDigit(userName.charAt(0)))
				userName = encryptString(userName);

		java.lang.String sTmp = "";
		String ms_session = session.getAttribute("userPrams") != null ? session.getAttribute("userPrams").toString().trim() : "";

		sTmp = readDataChgPwd(openApi("TradeChgPasswd", ms_session), ms_session, new java.lang.String[] { (new StringBuilder("'=")).append(exCliCode).toString(), (new StringBuilder("*=")).append(userName).toString(), (new StringBuilder("+=")).append(passwd).toString(),
				(new StringBuilder(",=")).append(newPasswd).toString() });

		// Request to sync with TCPro error message
		if (sTmp != null && !sTmp.equals("")) {
			if (sTmp.length() > 5) {
				if (sTmp.substring(0, 5).equalsIgnoreCase("ERROR")) {
					sTmp = sTmp.substring(sTmp.indexOf("ERROR")+("ERROR".length()+3));
				} 
			}
		}	
		return sTmp;
	}

	public String mfChangeExistPIN(java.lang.String exCliCodes, java.lang.String loginID, java.lang.String oldPin, java.lang.String newPin, HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String exCliCode = exCliCodes;
		java.lang.String userName = loginID;
		oldPin = encryptString(oldPin);
		newPin = encryptString(newPin);
		java.lang.System.out.println((new StringBuilder("encnewPass:")).append(newPin).toString());
		if (userName.length() > 0 && java.lang.Character.isLetterOrDigit(userName.charAt(0)))
			userName = encryptString(userName);

		java.lang.String sTmp = "";
		String ms_session = session.getAttribute("userPrams") != null ? session.getAttribute("userPrams").toString().trim() : "";
		
		sTmp = readDataChgPwd(openApi("TradeChgPIN", ms_session), ms_session, new java.lang.String[] { (new StringBuilder("'=")).append(exCliCode).toString(), (new StringBuilder("*=")).append(userName).toString(), (new StringBuilder("-=")).append(oldPin).toString(),
			(new StringBuilder(".=")).append(newPin).toString() });
		
		System.out.println("stmp:"+sTmp);
		// Request to sync with TCPro error message
//		if (sTmp != null && !sTmp.equals("")) {
//			if (sTmp.length() > 5) {
//				if (sTmp.substring(0, 5).equalsIgnoreCase("ERROR")) {
//					sTmp = sTmp.substring(sTmp.indexOf("ATP -")+("ATP -".length()+1));
//				} else {
//					sTmp = sTmp.substring(sTmp.indexOf("ATP -")+("ATP -".length()+1));	
//				}
//			}
//		}	
		return sTmp;
	}

	public com.n2n.connection.LoginContext tradeClient(java.lang.String userName, java.lang.String exCliCode, HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String data = "";
		String sess = session.getAttribute("userPrams") != null ? session.getAttribute("userPrams").toString().trim() : "";
		data = readData(openApi("TradeClient", sess), sess, new java.lang.String[] { (new StringBuilder("'=")).append(exCliCode).toString() });

		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
//		context.setResultsList(processSPMessage(data));
		context.setUserParam(processResultMessage(data));
		if (data != null && !data.equals("")) {
			if (data.length() > 5) {
				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
					context.setErrorMsg(data.substring(8));
				}
			}
		}
//		session.setAttribute("tradingAcc",context.getResultsList()!=null?"1":"0");
		return context;
	}

	public com.n2n.connection.LoginContext tradeClient(HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String data = "";		
		String exCliCode = session.getAttribute("senderCode")!=null ? session.getAttribute("senderCode").toString().trim() : "";
		String sess = session.getAttribute("userPrams") != null ? session.getAttribute("userPrams").toString().trim() : "";
		data = readData(openApi("TradeClient", sess), sess, new java.lang.String[] { (new StringBuilder("'=")).append(exCliCode).toString() });

		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
		context.setUserParam(processResultMessage(data));
		if (data != null && !data.equals("")) {
			if (data.length() > 5) {
				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
					context.setErrorMsg(data.substring(8));
				}
			}
		}
		session.setAttribute("tradingAcc",!("").equals(context.getUserParam())?"1":"0");
		session.setAttribute("clientTradAccList", !("").equals(context.getUserParam())?context.getUserParam().toString().trim():"");
		
		return context;
	}
	
	// Added for the Applet Window Size
	public com.n2n.connection.LoginContext tradeClientSetting(java.lang.String userName, java.lang.String exCliCode, boolean getClientSetting, HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String data = "";
		java.lang.String actionSetting = !getClientSetting?"SaveCliSetting":"GetCliSetting";
		String sess = session.getAttribute("userPrams") != null ? session.getAttribute("userPrams").toString().trim() : "";
		
		data = readData(openApi("ClientSetting", sess), sess, new java.lang.String[] { (new StringBuilder("*=")).append(actionSetting).toString(),
			(new StringBuilder(",=")).append(exCliCode).toString(), (new StringBuilder("0=")).append("SCRSET").toString()});
		System.out.println("data:"+data);
		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
		context.setResultsList(processSPMessage(data));
		return context;
	}
	
	public com.n2n.connection.LoginContext registerUser(java.lang.String loginID, java.lang.String passwd, HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String data = "";
		com.n2n.connection.LoginContext context = processLoginMessage(data, session);
		return context;
	}

	private java.lang.String openApi(java.lang.String command, String ms_session) {
		return (new StringBuilder(java.lang.String.valueOf(m_atpDest))).append("[").append(ms_session).append("]").append(command).toString();
	}

    /* Simple HTTP server
    try {
       ServerSocket server = new ServerSocket(1000);
       Socket client = server.accept();

       java.io.BufferedReader in = new java.io.BufferedReader(
          new java.io.InputStreamReader(client.getInputStream(), "8859_1"));
       java.io.OutputStream out = (java.io.OutputStream)client.getOutputStream();
       java.io.PrintWriter pout = new java.io.PrintWriter(
          new java.io.OutputStreamWriter(out, "8859_1"), true);
       String request = in.readLine();
       System.out.println("Request: " + request);

       java.util.StringTokenizer st = new java.util.StringTokenizer(request);
       if ((st.countTokens() >= 2) && (st.nextToken().equals("GET"))) {
          if ((request = st.nextToken()).startsWith("/")) request = request.substring(1);
          if ((request.endsWith("/")) || (request.equals(""))) request = request + "index.html";
          try {
             java.io.FileInputStream fis = new java.io.FileInputStream("/inetpub/wwwroot/" + request);
             byte[] data = new byte[fis.available()];
             fis.read(data);
             out.write(data);
             out.flush();
          } catch(java.io.FileNotFoundException e) {
             pout.println("404 File Not Found");
          }
       } else {
          pout.println("400 Bad Request");
       }
    } catch(java.io.IOException e) {
    }
    */

	private String readData(String uri, String userParam, String... params) throws TCException {
		StringBuffer sb = new StringBuffer();
		String sParam = null;
		OutputStreamWriter out = null;
		BufferedReader errreader = null;
		BufferedReader reader = null;
		java.net.HttpURLConnection conn = null;

		for (int i = 0; i < params.length; i++) {
			if (sParam == null)
				sParam = "";
			if (i != 0)
				sParam += "|";
			sParam += params[i];
		}

		try {
			URL url = new URL(uri);
			conn = (java.net.HttpURLConnection) url.openConnection();
			conn.setConnectTimeout(20000);
//			conn.setReadTimeout(10000);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");

			out = new OutputStreamWriter(conn.getOutputStream(), "ISO-8859-1");

			String sPostData = "";
			if (sParam != null) {
				sPostData = "Request=" + java.net.URLEncoder.encode(sParam, "ISO-8859-1");
				if (userParam != null)
					sPostData += "&UserParams=" + userParam;
			}
			// System.out.println("uri= " + uri);
			// System.out.println("sParam= " + sParam);
			System.out.println("-------------------- uri:"+uri+"?"+sParam); 
			out.write(sPostData);
			out.flush();

			conn.connect();
			java.io.InputStream is = conn.getInputStream();

			if (is != null) {
				reader = new BufferedReader(new InputStreamReader(is, "ISO-8859-1"));
				
				String str = "";
				while ((str = reader.readLine()) != null) {
					sb.append(str + "\n");
				}
			}

		} catch (java.io.IOException e) {
			java.io.InputStream iserror = conn.getErrorStream();
			String sErr = "";
			String errMsg = null;
			if (iserror != null) {
				try {
					errreader = new BufferedReader(new InputStreamReader(iserror, "ISO-8859-1"));
					String err = "";
					while ((err = errreader.readLine()) != null) {
						sErr += err + "\n";
					}
				} catch (java.io.IOException e1) {
				}
			}
			if (sErr.length() != 0) {
				errMsg = sErr;
			} else {
				errMsg = e.getMessage();
			}
			throw new TCException(errMsg);
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (java.io.IOException e) {
				}
			}

			if (errreader != null) {
				try {
					errreader.close();
				} catch (java.io.IOException e) {
				}
			}

			if (reader != null) {
				try {
					reader.close();
				} catch (java.io.IOException e) {
				}
			}

			if (conn != null) {
				conn.disconnect();
			}
		}
		return sb.toString();
	}

	private java.lang.String readDataLMS(java.lang.String uri, java.lang.String params[]) throws com.n2n.connection.TCException {
		java.lang.StringBuffer sb = new StringBuffer();
		java.lang.String sParam = null;
		java.io.OutputStreamWriter out = null;
		java.io.BufferedReader errreader = null;
		java.io.BufferedReader reader = null;
		java.net.HttpURLConnection conn = null;
		for(int i = 0; i < params.length; i++) {
			if(sParam == null)
				sParam = "";
			if(i != 0)
				sParam = (new StringBuilder(java.lang.String.valueOf(sParam))).append("&").toString();
			sParam = (new StringBuilder(java.lang.String.valueOf(sParam))).append(params[i]).toString();
		}

		try {
			java.lang.System.out.println((new StringBuilder("uri:")).append(uri).toString());
			java.net.URL url = new URL(uri);
			conn = (java.net.HttpURLConnection)url.openConnection();
			conn.setConnectTimeout(20000);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			out = new OutputStreamWriter(conn.getOutputStream(), "ISO-8859-1");
			sb.append((new StringBuilder("sParam (")).append(new Date()).append(") : ").append(sParam).append("\n").toString());
			out.write(sParam);
			out.flush();
			conn.connect();
			java.io.InputStream is = conn.getInputStream();
			if(is != null) {
				reader = new BufferedReader(new InputStreamReader(is, "ISO-8859-1"));
				sb.append((new StringBuilder("input (")).append(new Date()).append("):\n").toString());
				for(java.lang.String str = ""; (str = reader.readLine()) != null;)
					sb.append((new StringBuilder(java.lang.String.valueOf(str))).append("\n").toString());

			}
			if(debugM)
				com.n2n.util.Logging.logAPAgent1(sb);
		}
		catch(java.io.IOException e) {
			java.io.InputStream iserror = conn.getErrorStream();
			java.lang.String errMsg = null;
			java.lang.StringBuffer sErr = new StringBuffer();
			java.lang.StringBuffer sIOExp = new StringBuffer();
			if(iserror != null)
				try {
					errreader = new BufferedReader(new InputStreamReader(iserror, "ISO-8859-1"));
					sErr.append("sErr: ");
					for(java.lang.String err = ""; (err = errreader.readLine()) != null;)
						sErr.append((new StringBuilder(java.lang.String.valueOf(sErr))).append(err).append("\n").toString());

					if(debugM) {
						java.lang.System.out.println(sErr);
						com.n2n.util.Logging.logAPAgent1(sErr);
					}
				}
				catch(java.io.IOException ioexception) {
					if(debugM) {
						java.lang.System.out.println((new StringBuilder("ioexception:")).append(ioexception.getMessage()).toString());
						sIOExp.append(ioexception.getMessage());
						try {
							com.n2n.util.Logging.logAPAgent1(sErr);
						}
						catch(java.io.IOException e1) {
							e1.printStackTrace();
						}
					}
				}
			if(sErr.length() != 0)
				errMsg = sErr.toString();
			else
				errMsg = e.getMessage();
			if(debugM) {
				java.lang.System.out.println((new StringBuilder("errMsg:")).append(errMsg).toString());
				sErr.append("sErr: ");
				sErr.append(errMsg);
				try {
					com.n2n.util.Logging.logAPAgent1(sErr);
				}
				catch(java.io.IOException e1) {
					e1.printStackTrace();
				}
			}
			throw new TCException(errMsg);
		}
		catch(java.lang.Exception exception) {
			java.lang.StringBuffer sExp = new StringBuffer();
			if(out != null)
				try {
					out.close();
				}
				catch(java.io.IOException ioexception1) {
					if(debugM) {
						java.lang.System.out.println((new StringBuilder("ioexception1:")).append(ioexception1.getMessage()).toString());
						sExp.append("ioexception1 : ");
						sExp.append(ioexception1.getMessage());
						try {
							com.n2n.util.Logging.logAPAgent1(sExp);
						}
						catch(java.io.IOException e) {
							e.printStackTrace();
						}
					}
				}
			if(errreader != null)
				try {
					errreader.close();
				}
				catch(java.io.IOException ioexception2) {
					if(debugM) {
						java.lang.System.out.println((new StringBuilder("ioexception2:")).append(ioexception2.getMessage()).toString());
						sExp.append("ioexception2 : ");
						sExp.append(ioexception2.getMessage());
						try {
							com.n2n.util.Logging.logAPAgent1(sExp);
						}
						catch(java.io.IOException e) {
							e.printStackTrace();
						}
					}
				}
			if(reader != null)
				try {
					reader.close();
				}
				catch(java.io.IOException ioexception3) {
					if(debugM) {
						java.lang.System.out.println((new StringBuilder("ioexception3:")).append(ioexception3.getMessage()).toString());
						sExp.append("ioexception3 : ");
						sExp.append(ioexception3.getMessage());
						try {
							com.n2n.util.Logging.logAPAgent1(sExp);
						}
						catch(java.io.IOException e) {
							e.printStackTrace();
						}
					}
				}
			if(conn != null)
				conn.disconnect();
			if(out != null)
				try {
					out.close();
				}
				catch(java.io.IOException ioexception4) {
					if(debugM) {
						java.lang.System.out.println((new StringBuilder("ioexception4:")).append(ioexception4.getMessage()).toString());
						sExp.append("ioexception4 : ");
						sExp.append(ioexception4.getMessage());
						try {
							com.n2n.util.Logging.logAPAgent1(sExp);
						}
						catch(java.io.IOException e) {
							e.printStackTrace();
						}
					}
				}
			if(errreader != null)
				try {
					errreader.close();
				}
				catch(java.io.IOException ioexception5) {
					if(debugM) {
						java.lang.System.out.println((new StringBuilder("ioexception5:")).append(ioexception5.getMessage()).toString());
						sExp.append("ioexception5 : ");
						sExp.append(ioexception5.getMessage());
						try {
							com.n2n.util.Logging.logAPAgent1(sExp);
						}
						catch(java.io.IOException e) {
							e.printStackTrace();
						}
					}
				}
			if(reader != null)
				try {
					reader.close();
				}
				catch(java.io.IOException ioexception6) {
					if(debugM) {
						java.lang.System.out.println((new StringBuilder("ioexception6:")).append(ioexception6.getMessage()).toString());
						sExp.append("ioexception6 : ");
						sExp.append(ioexception6.getMessage());
						try {
							com.n2n.util.Logging.logAPAgent1(sExp);
						}
						catch(java.io.IOException e) {
							e.printStackTrace();
						}
					}
				}
			if(conn != null)
				conn.disconnect();
			java.lang.String s = sb.toString();
		}
		return sb.toString();
	}

	private java.lang.String readDataChgPwd(java.lang.String uri, java.lang.String userParam, java.lang.String params[]) throws com.n2n.connection.TCException {
		java.lang.StringBuffer sb;
		java.lang.String sParam;
		java.io.OutputStreamWriter out;
		java.io.BufferedReader errreader;
		java.io.BufferedReader reader;
		java.net.HttpURLConnection conn;
		sb = new StringBuffer();
		java.lang.String errMsg = null;
		sParam = null;
		out = null;
		errreader = null;
		reader = null;
		conn = null;
		for (int i = 0; i < params.length; i++) {
			if (sParam == null)
				sParam = "";
			if (i != 0)
				sParam = (new StringBuilder(java.lang.String.valueOf(sParam))).append("|").toString();
			sParam = (new StringBuilder(java.lang.String.valueOf(sParam))).append(params[i]).toString();
		}
		try {
			System.out.println("[uri:"+uri+"]|[userParam:"+userParam+"]|[sParam:"+sParam+"]");
			java.net.URL url = new URL(uri);
			conn = (java.net.HttpURLConnection) url.openConnection();
			conn.setConnectTimeout(20000);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			out = new OutputStreamWriter(conn.getOutputStream(), "ISO-8859-1");
			java.lang.String sPostData = "";
			if (sParam != null) {
				sPostData = (new StringBuilder("Request=")).append(java.net.URLEncoder.encode(sParam, "ISO-8859-1")).toString();
				if (userParam != null)
					sPostData = (new StringBuilder(java.lang.String.valueOf(sPostData))).append("&UserParams=").append(userParam).toString();
			}
//			java.lang.System.out.println((new StringBuilder("****sParam:")).append(sParam).toString());
			out.write(sPostData);
			out.flush();
			conn.connect();
			java.io.InputStream is = conn.getInputStream();
			if (is != null) {
				reader = new BufferedReader(new InputStreamReader(is, "ISO-8859-1"));
				for (java.lang.String str = ""; (str = reader.readLine()) != null;)
					sb.append((new StringBuilder(java.lang.String.valueOf(str))).append("\r\n").toString());

			}
			if (debugM) {
				System.out.println(">>>>>>>>>>:" + sb.toString());
			}
			errMsg = sb.toString();
		} catch (java.io.IOException e) {
			e.printStackTrace();
			java.io.InputStream iserror = conn.getErrorStream();
			java.lang.String sErr = "";
			if (iserror != null) {
				try {
					errreader = new BufferedReader(new InputStreamReader(iserror, "ISO-8859-1"));
					for (java.lang.String err = ""; (err = errreader.readLine()) != null;) {
						sErr = (new StringBuilder(java.lang.String.valueOf(sErr))).append(err).append("\r\n").toString();
					}
					if (debugM) {
						System.out.println("sErr:" + sErr);
					}
				} catch (java.io.IOException ioexception) {
					if (debugM) {
						System.out.println("ioexception:" + ioexception.getMessage());
					}
				}
			}
			if (sErr.length() != 0) {
				errMsg = sErr;
			} else {
				errMsg = e.getMessage();
			}
			if (debugM) {
				System.out.println("errMsg:" + errMsg);
			}
			// throw new TCException(errMsg);
		} catch (java.lang.Exception exception) {
			if (out != null)
				try {
					out.close();
				} catch (java.io.IOException ioexception1) {
					if (debugM) {
						System.out.println("ioexception1:" + ioexception1.getMessage());
					}
				}
			if (errreader != null)
				try {
					errreader.close();
				} catch (java.io.IOException ioexception2) {
					if (debugM) {
						System.out.println("ioexception2:" + ioexception2.getMessage());
					}
				}
			if (reader != null)
				try {
					reader.close();
				} catch (java.io.IOException ioexception3) {
					if (debugM) {
						System.out.println("ioexception3:" + ioexception3.getMessage());
					}
				}
			if (conn != null) {
				conn.disconnect();
			}
			if (out != null) {
				try {
					out.close();
				} catch (java.io.IOException ioexception4) {
					if (debugM) {
						System.out.println("ioexception4:" + ioexception4.getMessage());
					}
				}
			}
			if (errreader != null)
				try {
					errreader.close();
				} catch (java.io.IOException ioexception5) {
					if (debugM) {
						System.out.println("ioexception5:" + ioexception5.getMessage());
					}
				}
			if (reader != null)
				try {
					reader.close();
				} catch (java.io.IOException ioexception6) {
					if (debugM) {
						System.out.println("ioexception6:" + ioexception6.getMessage());
					}
				}
			if (conn != null)
				conn.disconnect();
		}
		return errMsg;
	}

	private java.lang.String encryptString(java.lang.String s) {
		int length = s.length();
		java.lang.String result = "";
		int cl = length / 2 + length % 2;
		for (int i = 0; i < cl; i++) {
			int s1 = s.charAt(i);
			int s2;
			if (cl + i > length - 1)
				s2 = 0;
			else
				s2 = s.charAt(cl + i);
			int c1 = (s1 & 0xf0 | s2 & 0xf) ^ 0xf8;
			int c2 = (s2 & 0xf0 | s1 & 0xf) ^ 0xf8;
			result = (new StringBuilder(java.lang.String.valueOf(result))).append((char) c1).toString();
			result = (new StringBuilder(java.lang.String.valueOf(result))).append((char) c2).toString();
		}
		return result;
	}

	private String encodeUserParams(String param) {
		String sTmp = "";
		byte[] bytes = {};
		try {
			bytes = param.getBytes("ISO-8859-1");
		} catch (java.io.UnsupportedEncodingException e) {
		}
		for (byte b : bytes) {
			if (b > 64 && b < 91 || b > 96 && b < 123) {
				sTmp += (char) b;
			} else {
				sTmp += "%" + String.format("%1$02X", b);
			}
		}

		return sTmp;
	}

	// 251,239,223,183,207,223,107,186,255,230,185,216,110,252,106,255,223
	private java.lang.String encodeUserParam(java.lang.String param) {
		java.lang.String sTmp = "";
		if (param != null) {
			for (int x = 0; x < param.length(); x++) {
				sTmp += "" + ((int) param.charAt(x)) + ",";
			}
			sTmp = sTmp.substring(0, sTmp.length() - 1);
		}
		return sTmp;
	}

	private com.n2n.connection.LoginContext processTradeClientMessage(java.lang.String data) {
		if (data == null)
			return null;
		System.out.println("data:" + data);
		java.lang.String arrsResult[] = data.split("\\|");
		System.out.println("arrsResult:" + arrsResult.length);
		java.util.Map mResult = new HashMap();
		com.n2n.connection.LoginContext context = null;
		java.lang.String as[];
		long millis = (as = arrsResult).length;
		System.out.println("millis...:" + millis);
		for (int i = 0; i < millis; i++) {
			if (as[i].trim().equals("TTPBroker")) {
				System.out.println("as[" + (i - 1) + "]:" + as[i - 1]);
			}

		}
		return context;
	}

	private com.n2n.connection.LoginContext processLoginMessage(java.lang.String data, HttpSession session) {
		if (data == null)
			return null;
		java.lang.String arrsResult[] = data.split("\n");
		java.util.Map mResult = new HashMap();
		com.n2n.connection.LoginContext context = null;
		java.lang.String as[];
		java.util.List actionList = new java.util.ArrayList();
		java.util.List ordTypeList = new java.util.ArrayList();
		java.util.List validList = new java.util.ArrayList();
		java.util.List ordCtrlList = new java.util.ArrayList();		
		long millis = (as = arrsResult).length;
		for (int i = 0; i < millis; i++) {
			java.lang.String sResult = as[i];
			java.lang.String arrsTmp[] = sResult.split("]=");
			arrsTmp[0] = arrsTmp[0].substring(arrsTmp[0].indexOf("[") + 1);
			if (arrsTmp[0].equalsIgnoreCase("Exchange")) {
				if (arrsTmp.length > 1) {
					java.util.List exchgs = new ArrayList();
					java.lang.String strExchgs = "";
					java.lang.String as1[];
					int k = (as1 = arrsTmp[1].split(",")).length;
					for (int j = 0; j < k; j++) {
						java.lang.String exchg = as1[j];
						strExchgs += exchg + "|";						
					}
					mResult.put(arrsTmp[0], strExchgs);
				}
			} else if (arrsTmp[0].equalsIgnoreCase("Action")) {
				if (arrsTmp.length > 1) {
					java.util.Map mAction = (java.util.Map) mResult.get("Action");
					if (mAction == null) {
						mAction = new HashMap();
						mResult.put("Action", mAction);
					}
					actionList.add(arrsTmp[1] + "|");
					mAction.put(arrsTmp[0], actionList);
				}
			} else if (arrsTmp[0].equalsIgnoreCase("OrderType")) {
				if (arrsTmp.length > 1) {
					java.util.Map mOrdType = (java.util.Map) mResult.get("OrderType");
					if (mOrdType == null) {
						mOrdType = new HashMap();
						mResult.put("OrderType", mOrdType);
					}
					ordTypeList.add(arrsTmp[1] + "|");
					mOrdType.put(arrsTmp[0], ordTypeList);
				}
			} else if (arrsTmp[0].equalsIgnoreCase("Validity")) {
				if (arrsTmp.length > 1) {
					java.util.Map mValidity = (java.util.Map) mResult.get("Validity");
					if (mValidity == null) {
						mValidity = new HashMap();
						mResult.put("Validity", mValidity);
					}
					validList.add(arrsTmp[1] + "|");
					mValidity.put(arrsTmp[0], validList);
				}
			} else if (arrsTmp[0].equalsIgnoreCase("OrderCtrl")) {
				if (arrsTmp.length > 1) {
					java.util.Map mOrdCtrl = (java.util.Map) mResult.get("OrderCtrl");
					if (mOrdCtrl == null) {
						mOrdCtrl = new HashMap();
						mResult.put("OrderCtrl", mOrdCtrl);
					}
					ordCtrlList.add(arrsTmp[1] + "|");
					mOrdCtrl.put(arrsTmp[0], ordCtrlList);
				}
			} else if (arrsTmp.length > 1)
				mResult.put(arrsTmp[0], arrsTmp[1]);
		}

		context = new LoginContext();
		java.util.HashMap mOrdCtrl = (java.util.HashMap) mResult.get("OrderCtrl");
		context.setOrdCtrl(mOrdCtrl);
		java.util.HashMap mAction = (java.util.HashMap) mResult.get("Action");
		context.setActions(mAction);
		context.setBhCode((java.lang.String) mResult.get("BrokerCode"));
		context.setRmsName((java.lang.String) mResult.get("RMSName"));
		context.setCatagory((java.lang.String) mResult.get("SenderCategory"));
		context.setCliName((java.lang.String) mResult.get("SenderName"));
		context.setExCliCode((java.lang.String) mResult.get("SenderCode"));
		context.setIsPwdReset((java.lang.String) mResult.get("LoginExpired"));
		if (mResult.get("PublicIP")!=null && !("").equals(mResult.get("PublicIP"))) {
			context.setAtpPublicIP((java.lang.String) mResult.get("PublicIP"));	
		} else {
			context.setAtpPublicIP("218.100.22.127");
		}
		if (mResult.get("PrivateIP")!=null && !("").equals(mResult.get("PrivateIP"))) {
			// Strip http(s):// prefix that new ATP server adds to PrivateIP field
			String rawPrivateIP = (java.lang.String) mResult.get("PrivateIP");
			if (rawPrivateIP.startsWith("https://")) rawPrivateIP = rawPrivateIP.substring(8);
			else if (rawPrivateIP.startsWith("http://")) rawPrivateIP = rawPrivateIP.substring(7);
			context.setAtpPrivateIP(rawPrivateIP);
		} else {
			context.setAtpPrivateIP("218.100.22.127");
		}		
		m_userparam = (java.lang.String) mResult.get("UserParam");
		context.setUserParam(m_userparam);
		m_context = context;
		if (m_userparam != null) {
			m_session = encodeUserParams(m_userparam); 
			System.out.println("m_session in N2NATPConnect:" + m_session);
			context.setSessionParam(m_session);
			millis = (java.lang.Long.parseLong((java.lang.String) mResult.get("AliveTimeOut")) * 4000L) / 5L;
		}
		session.setAttribute("timeoutInterval", (java.lang.String) mResult.get("AliveTimeOut"));
		session.setAttribute("rawLoginMessage", data);
		// these attributes requires by EMS
		session.setAttribute("userPrams", m_session);
		session.setAttribute("userParam", (java.lang.String) mResult.get("UserParam"));
		session.setAttribute("userPram", encodeUserParam((java.lang.String) mResult.get("UserParam")));
		// session.setAttribute("userParams",N2NEncryptions.encryptData(encodeUserParam((java.lang.String)mResult.get("UserParam"))));
		session.setAttribute("exchangeATP", mResult.get("Exchange"));
		session.setAttribute("actionATP", splitWords(mResult,"Action"));
		session.setAttribute("orderTypeATP", splitWords(mResult,"OrderType"));
		session.setAttribute("validityATP", splitWords(mResult,"Validity"));
		session.setAttribute("orderCtrlATP", splitWords(mResult,"OrderCtrl"));
		session.setAttribute("brokerCodeATP", mResult.get("BrokerCode"));
		session.setAttribute("RMSNameATP", mResult.get("RMSName"));
		session.setAttribute("senderCategoryATP", mResult.get("SenderCategory"));
		session.setAttribute("senderNameATP", mResult.get("SenderName"));
		session.setAttribute("senderCodeATP", mResult.get("SenderCode"));
		// end attributes requies
		session.setAttribute("senderCode", (java.lang.String) mResult.get("SenderCode"));
		session.setAttribute("senderName", (java.lang.String) mResult.get("SenderName"));
		session.setAttribute("loginID", context.getLoginID());
		session.setAttribute("RMSName", (java.lang.String) mResult.get("RMSName"));
		session.setAttribute("BrokerCode", (java.lang.String) mResult.get("BrokerCode"));
		session.setAttribute("ATPURLpublic", context.getAtpPublicIP());
		session.setAttribute("ATPURLprivate", context.getAtpPrivateIP());

		session.setAttribute("clicode", (java.lang.String) mResult.get("SenderCode"));
		session.setAttribute("cliname", (java.lang.String) mResult.get("SenderName"));
		session.setAttribute("rmsname", (java.lang.String) mResult.get("RMSName"));
		session.setAttribute("defbhcode", (java.lang.String) mResult.get("BrokerCode"));

		if (debugM) {
			// System.out.println("mResult:"+mResult);
			// System.out.println("context:"+context.getAccessLogID());
			// System.out.println("mOrdCtrl:"+mOrdCtrl);
			// System.out.println("mAction:"+mAction);
			// System.out.println("BhCode:"+context.getBhCode());
			// System.out.println("RmsName:"+context.getRmsName());
			// System.out.println("Category:"+context.getCatagory());
			// System.out.println("CliName:"+context.getCliName());
			// System.out.println("ExCliCode:"+context.getExCliCode());
			// System.out.println("userParam:"+(java.lang.String)mResult.get("UserParam"));
			// System.out.println("timeoutInterval:"+(java.lang.String)mResult.get("AliveTimeOut"));
			// System.out.println("rawLoginMessage:"+(java.lang.String)mResult.get("UserParam"));
			// System.out.println("senderName:"+(java.lang.String)mResult.get("SenderName"));
			// System.out.println("senderCode:"+(java.lang.String)mResult.get("SenderCode"));
			// System.out.println("LoginExpired:"+(java.lang.String)mResult.get("LoginExpired"));
			// System.out.println("loginID:"+context.getLoginID());
			// System.out.println("m_session:"+m_session);
			// System.out.println("millis:"+millis);
		}
		return context;
	}

	private String splitWords(java.util.Map mResult, String word) {
		String strAct = "";
		if (mResult!=null && mResult.get(word)!=null) {
			String dAct[] = mResult.get(word).toString().split(word+"=")[1].split("}")[0].split("\\[")[1].split("\\]")[0].split("\\|, ");
			String sAct[] = null;
			int iAct = (sAct=dAct).length;
			for (int iiAct = 0;iiAct<iAct;iiAct++) {
				strAct += dAct[iiAct]+"|";		
			}
		}
		return strAct;
	}
	
	private void processLoginMessageLMS(java.lang.String data, javax.servlet.http.HttpSession session) {
		try {
			java.lang.String arrsResult[] = data.split("--_BeginData_");
			java.lang.String as[];
			long millis = (as = arrsResult).length;
			java.lang.String GET_MESSAGE_ID = "";
			java.lang.String KEYQUOTE_ID1 = "";
			java.lang.String KEYQUOTE_ID2 = "";
			java.lang.String KEYEXPDT = "";
			java.lang.StringBuffer sb = new StringBuffer();
			for(int i = 1; (long)i < millis; i++) {
				java.lang.String sResult = as[i];
				java.lang.String arrsTmp[] = sResult.split("\\|");
				for(int x = 0; x < arrsTmp.length; x++) {
					java.lang.String sTrim = arrsTmp[0].trim();
					if(sTrim.equals("0"))
						GET_MESSAGE_ID = arrsTmp[2];
						KEYEXPDT	= arrsTmp[3] + arrsTmp[4];
							
				}

			}

			if(GET_MESSAGE_ID.length() > 0) {
				arrsResult = data.split("--_BeginAllService_");
				millis = (as = arrsResult).length;
				java.lang.String key = "";
				key = as[1];
				int index = key.indexOf("--_EndAllService_");
				key = key.substring(0, index).trim();
				java.lang.String arrsTmp2[] = key.split("\\|");
				for(int x = 0; x < arrsTmp2.length; x++) {
					if(x < 14)
						KEYQUOTE_ID1 = (new StringBuilder(java.lang.String.valueOf(KEYQUOTE_ID1))).append(arrsTmp2[x]).append("|").toString();
					if(x > 13)
						KEYQUOTE_ID2 = (new StringBuilder(java.lang.String.valueOf(KEYQUOTE_ID2))).append(arrsTmp2[x]).append("|").toString();
				}

			}
			sb.append((new StringBuilder("output to applet (")).append(new Date()).append("): \n").toString());
			sb.append((new StringBuilder("GET_MESSAGE_ID = ")).append(GET_MESSAGE_ID).append("\n").toString());
			sb.append((new StringBuilder("KEYQUOTE_ID1 = ")).append(KEYQUOTE_ID1).append("\n").toString());
			sb.append((new StringBuilder("KEYQUOTE_ID2 = ")).append(KEYQUOTE_ID2).append("\n").toString());
			sb.append((new StringBuilder("KEYEXPDT = ")).append(KEYEXPDT).append("\n").toString());
			sb.append("*************************************");
			System.out.print("KEYEXPDT....." + KEYEXPDT );
			if(debugM)
				com.n2n.util.Logging.logAPAgent1(sb);
			if(session != null) {
				session.setAttribute("GET_MESSAGE_ID", GET_MESSAGE_ID);
				session.setAttribute("KEYQUOTE_ID1", KEYQUOTE_ID1);
				session.setAttribute("KEYQUOTE_ID2", KEYQUOTE_ID2);
				session.setAttribute("KEYEXPDT", KEYEXPDT);
			}
		}
		catch(java.lang.Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Require to use Admin ID to verify Hint for Forget Pwd or Forget Pin
	 * @param code
	 * @param clibean
	 * @param ms_session
	 * @return
	 * @throws com.n2n.connection.TCException
	 */
	public com.n2n.connection.LoginContext verifyHintPwdPIN(String code, com.n2n.bean.N2NMFCliInfoBean clibean, String ms_session) throws com.n2n.connection.TCException {
		java.lang.String data = "";
		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
		String atpAPI = "";
		if (code.equals("1")) { // usp_mfChkPwdEmail
			atpAPI = "TradeForgetPasswd";
		} else if (code.equals("2")) { // usp_mfChkPINEmail
			atpAPI = "TradeForgetPIN";
		}
		data = readDataChgPwd(openApi(atpAPI, ms_session), ms_session, new java.lang.String[] { 
			(new StringBuilder("*=")).append(clibean.getLoginID()).toString(),
			(new StringBuilder(",=")).append(clibean.getHint()).toString(),
			(new StringBuilder("-=")).append(clibean.getHintAns()).toString() });
		
		System.out.println("data in verifyHintPwdPIN:"+data);
		context.setResultsList(processSPMessage(data));
		if (data != null && !data.equals("")) {
			if (data.length() > 5) {
				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
					// Request to sync with TCPro error message
					context.setErrorMsg(data.substring(6));
//					context.setErrorMsg(data.substring(data.indexOf("ATP -")+("ATP -".length()+1)));
				}
			}
		}
		return context;
	}
	
//	public com.n2n.connection.LoginContext mfMsgRegisterMail(String vsMailtype, String vsMsgType, String vsFromMail, String vsToMail, int vsTemplateID, String vsTemplateParam, String vsBHCode, String vsImageParam, String vsGame, String vsTemplateTableID, String vsTemplateTableParam, String vsSubject, HttpSession session) throws com.n2n.connection.TCException {
//		java.lang.String data = "";
//		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
//		String atpAPI = "RegisterMail";
//		String ms_session = session.getAttribute("userPrams") != null ? session.getAttribute("userPrams").toString().trim() : "";
//		data = readDataChgPwd(openApi(atpAPI, ms_session), ms_session, new java.lang.String[] { 
//			(new StringBuilder("+=")).append(vsMailtype).toString(),
//			(new StringBuilder(",=")).append(vsMsgType).toString(),
//			(new StringBuilder("-=")).append(vsFromMail).toString(),
//			(new StringBuilder(".=")).append(vsToMail).toString(),
//			(new StringBuilder("/=")).append(vsTemplateID).toString(),
//			(new StringBuilder("0=")).append(vsTemplateParam).toString(),
//			(new StringBuilder("1=")).append(vsBHCode).toString(),
//			(new StringBuilder("2=")).append(vsImageParam).toString(),
//			(new StringBuilder("3=")).append(vsGame).toString(),
//			(new StringBuilder("4=")).append(vsTemplateTableID).toString(),
//			(new StringBuilder("5=")).append(vsTemplateTableParam).toString(),
//			(new StringBuilder("6=")).append(vsSubject).toString() });
//		
//		System.out.println("data in verifyHintPwdPIN:"+data);
//		context.setResultsList(processSPMessage(data));
//		if (data != null && !data.equals("")) {
//			if (data.length() > 5) {
//				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
//					context.setErrorMsg(data.substring(data.indexOf("ATP -")+("ATP -".length()+1)));
//				}
//			}
//		}
//		return context;
//	}
	
	/**
	 * Require to use Admin ID to register for send email
	 * @param vsMailtype
	 * @param vsMsgType
	 * @param vsFromMail
	 * @param vsToMail
	 * @param vsTemplateID
	 * @param vsTemplateParam
	 * @param vsBHCode
	 * @param vsImageParam
	 * @param vsGame
	 * @param vsTemplateTableID
	 * @param vsTemplateTableParam
	 * @param vsSubject
	 * @param ms_session
	 * @return
	 * @throws com.n2n.connection.TCException
	 */
	public com.n2n.connection.LoginContext mfMsgRegisterMail(String vsMailtype, String vsMsgType, String vsFromMail, String vsToMail, int vsTemplateID, String vsTemplateParam, String vsBHCode, String vsImageParam, String vsGame, String vsTemplateTableID, String vsTemplateTableParam, String vsSubject, String ms_session) throws com.n2n.connection.TCException {
		java.lang.String data = "";
		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
		String atpAPI = "RegisterMail";
		data = readDataChgPwd(openApi(atpAPI, ms_session), ms_session, new java.lang.String[] { 
			(new StringBuilder("+=")).append(vsMailtype).toString(),
			(new StringBuilder(",=")).append(vsMsgType).toString(),
			(new StringBuilder("-=")).append(vsFromMail).toString(),
			(new StringBuilder(".=")).append(vsToMail).toString(),
			(new StringBuilder("/=")).append(vsTemplateID).toString(),
			(new StringBuilder("0=")).append(vsTemplateParam).toString(),
			(new StringBuilder("1=")).append(vsBHCode).toString(),
			(new StringBuilder("2=")).append(vsImageParam).toString(),
			(new StringBuilder("3=")).append(vsGame).toString(),
			(new StringBuilder("4=")).append(vsTemplateTableID).toString(),
			(new StringBuilder("5=")).append(vsTemplateTableParam).toString(),
			(new StringBuilder("6=")).append(vsSubject).toString() });
		
		System.out.println("data in mfMsgRegisterMail:"+data);
		context.setResultsList(processSPMessage(data));
		if (data != null && !data.equals("")) {
			if (data.length() > 5) {
				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
					// Request to sync with TCPro error message
					context.setErrorMsg(data.substring(6));
//					context.setErrorMsg(data.substring(data.indexOf("ATP -")+("ATP -".length()+1)));
				}
			}
		}
		return context;
	}
	
	/**
	 * Reference from usp_mfGetCliInfo.
	 * Calling method new N2NATPConnect("atp server").getAccountInfo(loginID, clientCode, session) 
	 * 
	 * @param userName
	 * @param exCliCode
	 * @param session
	 * @return
	 * @throws com.n2n.connection.TCException
	 */
//	public com.n2n.connection.LoginContext getCliInfo(com.n2n.bean.N2NMFCliInfoBean clibean, HttpSession session) throws com.n2n.connection.TCException {
//		java.lang.String data = "";
//		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
//		String ms_session = session.getAttribute("userPrams") != null ? session.getAttribute("userPrams").toString().trim() : "";
//		data = readDataChgPwd(openApi("GetAccountInfo", ms_session), ms_session, new java.lang.String[] { 
//			(new StringBuilder("+=")).append(clibean.getCliCode()).toString() });
//		
//		System.out.println("data in getAccountInfo:"+data);
//		context.setResultsList(processSPMessage(data));
//		if (data != null && !data.equals("")) {
//			if (data.length() > 5) {
//				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
//					context.setErrorMsg(data.substring(data.indexOf("ATP -")+("ATP -".length()+1)));
//				}
//			}
//		}
//		return context;
//	}

	/**
	 * Require to use Admin ID to get the client information
	 * @param clibean
	 * @param session
	 * @return
	 * @throws com.n2n.connection.TCException
	 */
	public com.n2n.connection.LoginContext getCliInfo(com.n2n.bean.N2NMFCliInfoBean clibean, String session) throws com.n2n.connection.TCException {
		java.lang.String data = "";
		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
		if (clibean.getLoginID()!=null && clibean.getCliCode()!=null) {
			data = readDataChgPwd(openApi("GetAccountInfo", session), session, new java.lang.String[] {
				(new StringBuilder(".=")).append(clibean.getLoginID()).toString(),(new StringBuilder("+=")).append(clibean.getCliCode()).toString() });
		} else {
			if (clibean.getLoginID()!=null && !clibean.getLoginID().equals("")) {
				data = readDataChgPwd(openApi("GetAccountInfo", session), session, new java.lang.String[] {
					(new StringBuilder(".=")).append(clibean.getLoginID()).toString() });
			}
			if (clibean.getCliCode()!=null && !clibean.getCliCode().equals("")) {
				data = readDataChgPwd(openApi("GetAccountInfo", session), session, new java.lang.String[] {
					(new StringBuilder("+=")).append(clibean.getCliCode()).toString() });
			}
		}
		
		System.out.println("data in getAccountInfo:"+data);
		context.setResultsList(processSPMessage(data));
		if (data != null && !data.equals("")) {
			if (data.length() > 5) {
				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
					// Request to sync with TCPro error message
					context.setErrorMsg(data.substring(6));
//					context.setErrorMsg(data.substring(data.indexOf("ATP -")+("ATP -".length()+1)));
				}
			}
		}
		return context;
	}
	
	/**
	 * Reference from usp_mfGetBHCliInfoByCliCode.
	 * Calling method new N2NATPConnect("atp server").getTradingInfo(loginID, clientCode, session) 
	 * 
	 * @param userName
	 * @param exCliCode
	 * @param session
	 * @return
	 * @throws com.n2n.connection.TCException
	 */
	public com.n2n.connection.LoginContext getBHCliInfoByCliCode(com.n2n.bean.N2NMFCliInfoBean clibean, HttpSession session) throws com.n2n.connection.TCException {
		java.lang.String data = "";
		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
		String ms_session = session.getAttribute("userPrams") != null ? session.getAttribute("userPrams").toString().trim() : "";
		data = readDataChgPwd(openApi("GetTradingInfo", ms_session), ms_session, new java.lang.String[] { 
			(new StringBuilder("/=")).append(clibean.getCliCode()).toString() });
		
		System.out.println("data in GetTradingInfo:"+data);
		context.setResultsList(processSPMessage(data));
		if (data != null && !data.equals("")) {
			if (data.length() > 5) {
				if (data.substring(0, 5).equalsIgnoreCase("ERROR")) {
					// Request to sync with TCPro error message
//					context.setErrorMsg(data.substring(data.indexOf("ATP -")+("ATP -".length()+1)));
					context.setErrorMsg(data.substring(6));
					context.setResults(null);
				}
			}
		}
		return context;
	}
	
	/**
	 * Process the returned ResultSet to String[].
	 * Checking on the reply message whether is empty.
	 * Checking on the reply message whether have the ) closed bracket symbol.
	 * If have values, first split with )= symbol then with | symbol.
	 * 
	 * @param data
	 * @return String[]
	 */
	private java.util.List processSPMessage(java.lang.String data) {
		java.util.List sList = null;
		java.lang.String as[] = null;
		try {
			if (data == null) {
				return null;
			} else {
				if (data.indexOf(")")<0) {
					return null;
				} else {
					java.lang.String arrsResult1[] = data.split("\\)");
					if (arrsResult1.length>0) {
						sList = new java.util.ArrayList();						
						for (int i=0;i<arrsResult1.length;i++) {
							if (arrsResult1[i]!=null && !"".equals(arrsResult1[i]) && "=".equals(""+arrsResult1[i].charAt(0))) {
								java.lang.String arrsResult[] = arrsResult1[i].split("\\|");
								long millis = (as = arrsResult).length;
								sList.add(as);								
							}
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return sList;
	}

	/**
	 * Process the returned ResultSet to String.
	 * Checking on the reply message whether is empty.
	 * Checking on the reply message whether have the ) closed bracket symbol.
	 * 
	 * @param data
	 * @return String
	 */
	private String processResultMessage(java.lang.String data) {
		String results = "";
		java.lang.String as[] = null;
		try {
			if (data == null) {
				return null;
			} else {
				if (data.indexOf(")")<0) {
					return null;
				} else {
					java.lang.String arrsResult1[] = data.split("\\)");
					if (arrsResult1.length>0) {
						results = arrsResult1[1];
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return results;
	}
	
	private String formSession(String param) {
		if (param == null)
			return null;

		String[] asciiCode = param.split(",");
		String result = "";
		for (String s : asciiCode) {
			s = s.trim();
			int i = Integer.parseInt(s);
			if (i > 64 && i < 91 || i > 96 && i < 123) {
				result += (char) i;
			} else {
				result += "%" + String.format("%1$02X", i);
			}
		}

		return result;
	}

	private String addRandom() {
		return "&" + Math.random();
	}

}
