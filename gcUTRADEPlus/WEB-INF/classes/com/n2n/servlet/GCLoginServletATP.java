package com.n2n.servlet;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.net.MalformedURLException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.n2n.DB.N2NMFCliInfo;
import com.n2n.DB.N2NSession;
import com.n2n.bkl.remote.BklAccessService;
import com.n2n.connection.TCException;
import com.n2n.util.N2NATPConnect;
import com.n2n.util.N2NATPsConnect;
import com.n2n.util.N2NSecurity;
import com.spp.util.security.Decrypt;
import com.spp.util.security.Encrypt;

public class GCLoginServletATP extends HttpServlet {
	private PrintWriter outs = null;
	private String m_sContextPath = "";
//	private String path = "";
	private boolean bLogout = false;

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String path = "";		
		HttpSession session = request.getSession (true);

		N2NSession oN2NSession = (N2NSession) session.getAttribute("oN2NSession");	
		if (oN2NSession == null) {		
			oN2NSession = new N2NSession(getServletConfig().getServletContext());
		}	
		outs = response.getWriter();
		response.setContentType("text/html");
		String sClientIP = "";
		String saLoginResult[] = null;
		String sLoginType = "";
		int m_nID = 0;

		N2NMFCliInfo cliInfo = new N2NMFCliInfo();
		cliInfo.init(oN2NSession);

		String lang = request.getParameter("lang")!=null?request.getParameter("lang").toString().trim():"EN";
		String sAction = request.getParameter("action")!=null?request.getParameter("action").toString().trim():"";
		String sActivationReg = request.getParameter("acts")!=null?request.getParameter("acts").toString().trim():"";
		String sUsername = request.getParameter("txtLoginID")!=null?request.getParameter("txtLoginID").toString().trim():"";
		String sPassword = request.getParameter("txtLoginPwd")!=null?request.getParameter("txtLoginPwd").toString().trim():"";
		String sReq = request.getParameter("req")!=null?request.getParameter("req").toString().trim():"";
		String sLoginID = request.getParameter("loginID");
		String sPwd = request.getParameter("pwd");

		if (session!=null) {
			char acId[] = session.getId().toCharArray();		
			for (int i = 0; i < acId.length; ++i) {
				m_nID += Character.getNumericValue(acId[i]);			
			}
		}
		
//		if (!sReq.equals("enc")) {
//			try {
//				if (sLoginID!=null) {
//					sLoginID = N2NSecurity.JSdecrypt(N2NSecurity.urlUnEscape(sLoginID), m_nID); 
//					sPwd = N2NSecurity.JSdecrypt(N2NSecurity.urlUnEscape(sPwd), m_nID); 
//				}
//				sUsername = sLoginID;
//				sPassword = sPwd;
//			} catch (Exception ex) {
//				ex.printStackTrace();
//			}
//		}
		
		String sSenderCode = request.getParameter("senderCode")!=null?request.getParameter("senderCode").toString():"";
		String sCategory = request.getParameter("category")!=null?request.getParameter("category"):"M";
		String windowSize = request.getParameter("sizes")!=null?request.getParameter("sizes").toString().trim():"";
		String sFromUrl = request.getParameter("from_path")!=null?request.getParameter("from_path").toString().trim():"";
		String sSecure = request.getParameter("isSec")!=null?request.getParameter("isSec").toString().trim():"N";
		String sFrm = request.getParameter("frm")!=null?request.getParameter("frm").toString().trim():"";
		String sfrmpath = request.getParameter("frmpath")!=null?request.getParameter("frmpath").toString():"";
		String sNewPassword = request.getParameter("txtNewPwd");
		String sOldPassword = request.getParameter("txtOldPwd");
		String sLogoutprint = request.getParameter("logoutprint");
		String actionPath = request.getParameter("actPath");
		String requestTime = request.getParameter("t");
		String strLiteSession = "";
		if (session!=null) {
			strLiteSession = session.getAttribute("liteCall")!=null?session.getAttribute("liteCall").toString():"";	
		}
		StringBuffer strBufferMsg = new StringBuffer();
		actionPath = actionPath!=null?actionPath.toString().trim():"";
		sLogoutprint = sLogoutprint != null ? sLogoutprint : "N";
		bLogout = new Boolean(sLogoutprint).booleanValue();
		m_sContextPath = request.getContextPath();
		String sHTMLROOT = "";
		if (sSecure.equalsIgnoreCase("Y")) {
			sHTMLROOT = oN2NSession.getSetting("HTMLRootSecure") + m_sContextPath;
		} else {
			sHTMLROOT = oN2NSession.getSetting("HTMLRoot") + m_sContextPath;
		}

		String loginPage = oN2NSession.getSetting("loginPage");
		if (sfrmpath.equals("lite") || strLiteSession.equals("lite")) {
			loginPage = oN2NSession.getSetting("tcliteloginPage");
		} 
//		if(request.getHeader("client-ip")!= null) {
//			sClientIP =  request.getHeader("client-ip");
//		} else {
//			sClientIP =  request.getRemoteAddr();
//		}
		if ((sClientIP = request.getHeader("client-ip")) == null) {
			if ((sClientIP = request.getHeader("x-forwarded-for")) == null) {
				sClientIP = request.getRemoteAddr();	
			}
		}

		java.util.Date dateNow = null;
		java.util.Date dateLogin = null;
		Encrypt en = new Encrypt();
		strBufferMsg.append("Calling "+(sAction.equals("")?"login":sAction)+" at |"+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"|sUsername:"+sUsername+
				"|sPassword:"+(sPassword!=null&&!sPassword.equals("")?en.fetchEncode(sPassword):"*******")+
				"|clicode:"+session.getAttribute("clicode")+
				"|actionPath:"+actionPath+"|fromURL:"+sFromUrl+"|lang:"+lang+"|IP:"+sClientIP+
				"|activateReg:"+sActivationReg+"|loginId:"+session.getAttribute("loginid")+
				"|category:"+sCategory+"|uuid:"+session.getAttribute("encID")+"|uupwd:"+session.getAttribute("encPwd")+"|");
		com.n2n.util.Logging.logAPAgent1(strBufferMsg, "login");
		String atpServerURL = oN2NSession.getSetting("atpURL");
		String exchange = oN2NSession.getSetting("exchange");
//		System.out.println("exchange:"+exchange+":atp:"+atpServerURL);
		String atpURL = atpServerURL;
//		atpURL = session!=null ? session.getAttribute("ATPURLprivate")!=null?session.getAttribute("ATPURLprivate").toString().trim():atpServerURL : atpServerURL;
		N2NATPConnect conn = new N2NATPConnect(atpURL, exchange);
		Decrypt dec = new Decrypt();
		Encrypt enc = new Encrypt();
		com.n2n.connection.LoginContext context = null;
		String sLogout = request.getParameter("logout");
		sLogout = sLogout != null ? sLogout : "N";
		bLogout = new Boolean(sLogout).booleanValue();

		// Added for checking
		if (sAction.length()==0) {
			session.setAttribute("loginid_master",sUsername);
		}

		if (sAction.equalsIgnoreCase(oN2NSession.getSetting("LogoutActionString"))) {
			atpURL = session!=null ? session.getAttribute("ATPURLpublic")!=null?session.getAttribute("ATPURLpublic").toString().trim():atpServerURL : atpServerURL;
			conn = new N2NATPConnect(atpURL, exchange);
			String sInvalidSession = sCategory;
			session = request.getSession(false);
			if (!sFromUrl.equals("")) {
				if (sFromUrl.equalsIgnoreCase("applet")) {
					// Error 501  1100 ATP - Invalid session
					if (sInvalidSession!=null && !("M").equals(sInvalidSession)) {
						System.out.println("["+m_nID+"]---------------- sInvalidSession:"+sInvalidSession+"|"+session);
						if (sInvalidSession.indexOf("1100 ATP")>0 || sInvalidSession.equalsIgnoreCase("1100ATP")) {
							if (session!=null) { 
								// MULTIPLE LOGIN 
								String values[] = {"","","","","",""};
								values[0]="1"; // kick out due to invalid session details, redirect to home page 
								values[1]=oN2NSession.getSetting("InvalidSession.MultipleLogin.EN");
								values[2]=oN2NSession.getSetting("HTMLRootHome");
								values[3]=session.getAttribute("loginid")!=null?session.getAttribute("loginid").toString().trim():"";
								values[4]=""+new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
								values[5]="";
								writeValues(values, outs);							
							}								
							System.out.println("["+m_nID+"]invalidating session ... from "+sFromUrl+":error:"+sInvalidSession);				
							oN2NSession.setLogoutStatus(1);
							try {
								if (session.getAttribute("userPrams")!=null) {
									if (!session.getAttribute("userPrams").toString().trim().equals("") && !session.getAttribute("userPrams").toString().trim().equals("null")) {
										context = conn.tradeLogout(session);	
									}
								}
							} catch (Exception e) {
								e.printStackTrace();
							}
							if (session!=null) {
								session.invalidate();	
							}
//							printJSS(4,oN2NSession.getSetting("InvalidSession.MultipleLogin.EN"),oN2NSession.getSetting("HTMLRootHome"),"",oN2NSession);

						} else if (sInvalidSession.indexOf("1201 ATP")>0 || sInvalidSession.equalsIgnoreCase("1201ATP")) {
							// TODO Error 1201 ATP - Session time outprint
							// Reconnect session
							if (session.getAttribute("loginid")!=null && session.getAttribute("encID")!=null && session.getAttribute("encPwd")!=null) {
								System.out.println("["+m_nID+"]Log-in ... from "+sFromUrl+":error:"+sInvalidSession+"|loginId:"+session.getAttribute("loginid")+"|encID:"+session.getAttribute("encID")+"|encPwd:"+session.getAttribute("encPwd"));								
								try {
//									String mode_session = session.getAttribute("appletMode")!=null?session.getAttribute("appletMode").toString():"2";
//									context = connectATPAgain(session, conn, oN2NSession, session.getAttribute("loginid").toString(), sClientIP, mode_session, lang, sHTMLROOT);	
									context = connectATPAgain(session, conn, oN2NSession, session.getAttribute("loginid").toString(), sClientIP, lang, sHTMLROOT);
									session.setAttribute("tradingAcc",context.getReason());
									session.setAttribute("errMsg","");
									session.setAttribute("loginid",session.getAttribute("loginid").toString());
									session.setAttribute("en_loginid",context.getLoginID()); 
									session.setAttribute("pwdreset","N");
									session.setAttribute("lang",lang);
									session.setAttribute("isJVM","");
									session.setAttribute("URL_loginMessage", oN2NSession.getSetting("HTMLRoot") + oN2NSession.getSetting("projectFolder") + oN2NSession.getSetting("MessageDisplay"));
								} catch (Exception exec) {
									exec.printStackTrace();
								}
								System.out.println("loginid:"+session.getAttribute("loginid")!=null?session.getAttribute("loginid").toString().trim():context.getLoginID());
								if (session!=null) {
									if (session.getAttribute("loginid")!=null) {
										// RECONNECT SESSION
										String values[] = {"","","","","",""};
										values[0]="0"; // reconnect to ATP, returned new session param
										values[1]="";
										values[2]="";
										values[3]=session.getAttribute("loginid")!=null?session.getAttribute("loginid").toString().trim():context.getLoginID();
										values[4]=""+new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
										values[5]=session.getAttribute("userPrams")!=null?session.getAttribute("userPrams").toString().trim():context.getSessionParam();
										writeValues(values, outs);										
									}
								}
								
							} else { // Unable to retrieve the session objects
								// WEB IDLE SESSION TIME outprint
								String values[] = {"","","","","",""};
								values[0]="2"; // web idle session, unable to find the web session 
								values[1]=oN2NSession.getSetting("Session.Timeoutprint.EN");
								values[2]=sHTMLROOT + oN2NSession.getSetting("logoutPage");
								values[3]="";
								values[4]=""+new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
								values[5]="";
								writeValues(values, outs);
								
								System.out.println("["+m_nID+"]invalidating new session ... from "+sFromUrl+":error:"+sInvalidSession+"|loginId:"+session.getAttribute("loginid")+"|encID:"+session.getAttribute("encID")+"|encPwd:"+session.getAttribute("encPwd"));
								oN2NSession.setLogoutStatus(1);
								try {
									if (session.getAttribute("userPrams")!=null) {
										if (!session.getAttribute("userPrams").toString().trim().equals("") && !session.getAttribute("userPrams").toString().trim().equals("null")) {
											context = conn.tradeLogout(session);	
										}
									}
									if (session!=null) {
										session.invalidate();	
									}
									
								} catch (Exception e) {
									e.printStackTrace();
								}
								//printJSS(4,oN2NSession.getSetting("Session.Timeoutprint.EN"),oN2NSession.getSetting("HTMLRootHome"),"",oN2NSession);
							}
						} // end 1201ATP
						
					} else {
						System.out.println("["+m_nID+"]invalidating session ... from "+sFromUrl);
						oN2NSession.setLogoutStatus(1);
						try {
							if (session.getAttribute("userPrams")!=null) {
								if (!session.getAttribute("userPrams").toString().trim().equals("") && !session.getAttribute("userPrams").toString().trim().equals("null")) {
									context = conn.tradeLogout(session);	
								}
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
						if (session!=null) {
							session.invalidate();	
						}
						printJSS(4,"",oN2NSession.getSetting("HTMLRootHome"),"",oN2NSession);
					}
					
				} else if (sFromUrl.equalsIgnoreCase("research")) {
					System.out.println("["+m_nID+"]invalidating session... from "+sFromUrl);				
					oN2NSession.setLogoutStatus(1);
					try {
						if (session.getAttribute("userPrams")!=null) {
							if (!session.getAttribute("userPrams").toString().trim().equals("") && !session.getAttribute("userPrams").toString().trim().equals("null")) {
								context = conn.tradeLogout(session);	
							}
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
					if (session!=null) {
						session.invalidate();	
					}
					path = sHTMLROOT + loginPage;
					printJSS(8,sHTMLROOT + oN2NSession.getSetting("HTMLRealTimePage_research"),path,"",oN2NSession);
					response.sendRedirect(path);
				} else {
					path = sHTMLROOT + loginPage;	
					System.out.println("["+m_nID+"]invalidating session... from home page");				
					oN2NSession.setLogoutStatus(1);
					try {
						if (session.getAttribute("userPrams")!=null) {
							if (!session.getAttribute("userPrams").toString().trim().equals("") && !session.getAttribute("userPrams").toString().trim().equals("null")) {
								context = conn.tradeLogout(session);	
							}
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
					if (session!=null) {
						session.invalidate();	
					}
					response.sendRedirect(path);
				}
			} else {
				path = sHTMLROOT + loginPage;	
				System.out.println("["+m_nID+"]invalidating session... from home page");				
				oN2NSession.setLogoutStatus(1);
				try {
					if (session.getAttribute("userPrams")!=null) {
						if (!session.getAttribute("userPrams").toString().trim().equals("") && !session.getAttribute("userPrams").toString().trim().equals("null")) {
							context = conn.tradeLogout(session);	
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				if (session!=null) {
					session.invalidate();	
				}
				if(sFrm.equalsIgnoreCase("rt")){
					if (!sfrmpath.equals("")) {
						path= sHTMLROOT + oN2NSession.getSetting("logoutPage")+"?frmpath="+sfrmpath;
					} else {
						path= sHTMLROOT + oN2NSession.getSetting("logoutPage");	
					}
				}
				response.sendRedirect(path);
			}
		} else 
		if (sAction.equalsIgnoreCase("chgPasswdDefault")) {
			System.out.println("["+m_nID+"]userid "+session.getAttribute("loginid")+" in chgPasswdDefault:"+session.getAttribute("loginid"));
			path = sHTMLROOT + oN2NSession.getSetting("forceChgPwdPage");
			printJSS(3,"",path,windowSize,oN2NSession);
		} else 
		if (sAction.equalsIgnoreCase(oN2NSession.getSetting("ForceChgPwdActionString"))) {
			String errMessage = "";
			String usernameStored = "";
			try {
				usernameStored = session.getAttribute("uuid")!=null && (!session.getAttribute("uuid").equals(""))?dec.fetchDecode(session.getAttribute("uuid").toString()):""; // for the Force Change Default Password module after reset password
				usernameStored = usernameStored.equals("")?session.getAttribute("loginid").toString():usernameStored; // added for the Change Password module
				System.out.println("["+m_nID+"]errChgMsg in ForceChgPwdActionString for "+usernameStored+":"+session.getAttribute("errChgMsg"));
//				usernameStored = session.getAttribute("loginid")!=null?session.getAttribute("loginid").toString().trim():"";
				String extCliCodeStored = session.getAttribute("senderCode")!=null?session.getAttribute("senderCode").toString().trim():"";
				errMessage = conn.changePasswd(extCliCodeStored, usernameStored, sOldPassword, sNewPassword, session);
			} catch (TCException ex) {
				ex.printStackTrace();
			}
			if (errMessage!=null && !errMessage.equals("")) {
				System.out.println("["+m_nID+"]Error during changePasswd for userid "+usernameStored+":"+errMessage);
				session.setAttribute("errChgMsg",errMessage);
				path = sHTMLROOT + oN2NSession.getSetting("forceChgPwdPage");
				if (!sFromUrl.equals("")&&sFromUrl.equalsIgnoreCase("default")) {
					path = sHTMLROOT + oN2NSession.getSetting("forceChgDefaultPwdPage") + "?uuid="+enc.fetchEncode(usernameStored)+"&from_path=default";
				}
				System.out.println("path:"+path);
				response.sendRedirect(path);
			} else {
				session.setAttribute("errChgMsg",errMessage);
				session.setAttribute("URL_loginMessage", sHTMLROOT + oN2NSession.getSetting("MessageDisplay"));
				//session.setAttribute("URL_KeepAlive", oN2NSession.getSetting("HTMLRoot")+oN2NSession.getSetting("projectFolder")+oN2NSession.getSetting("HTMLRealTimeAlive")); // keep
//				session.setAttribute("companyFooter", getFooterStr(session.getAttribute("lang").toString(), oN2NSession));
				path = sHTMLROOT + oN2NSession.getSetting("forceChgPwdPage");
				if(sFromUrl != null && !sFromUrl.equals("")) {
					path = sHTMLROOT + oN2NSession.getSetting("forceChgDefaultPwdPage");
				}
				response.sendRedirect(path);
			}			
			
		} else 
		if (sAction.equalsIgnoreCase("forgetPin")) { 
			
		} else 
		if (sAction.equalsIgnoreCase("changePin")) { 
			
		} else if (sAction.equals("")) { // Login
			dateNow = new java.util.Date();
			System.out.println("Processing Login:"+dateNow);
			// Add the calling to SP check for status "P" Pending Activate Registration.
			// If "P" and sActivationReg!="ActivateReg" prompt error message
			// If "P" and sActivationReg=="ActivateReg" call SP to update status to "A" if the status is not "S" then redirect to Activation successful page
			boolean pendingReg = false;
			boolean bAct = false;

//			String regStatus[] = cliInfo.chkPendingUser(sUsername);
//			strBufferMsg = new StringBuffer();
//			strBufferMsg.append("Attempting to login at |"+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"|sUsername:"+sUsername+"|PendingUser:"+regStatus[0]+"|category:"+regStatus[1]+"|clienttype:"+regStatus[2]+"|");
//			com.n2n.util.Logging.logAPAgent1(strBufferMsg, "login");
			session.setAttribute("ActivateReg", "A");
//			if (regStatus[0].equals("Y")) {
//				session.setAttribute("ActivateReg", "P");
//				pendingReg = true;
//				if (!sActivationReg.equals("") && sActivationReg.equalsIgnoreCase("ActivateReg")) {
//					try {
//						bAct = true;
//						saLoginResult = cliInfo.cliLogInOut(sLoginType,sUsername,sPassword,sClientIP,regStatus[1],bAct);
//						//saLoginResult = oN2NSession.cliinfo.cliLogInOut(sLoginType,sUsername,sPassword,sClientIP,regStatus[1],bAct);
//						
//						session.setAttribute("category",regStatus[1]);
//						session.setAttribute("clienttype",regStatus[2]);
//					} catch (Exception e) {
//						e.printStackTrace();
//					}
//					if (saLoginResult!=null) {
//						pendingReg = false;
//					}
//				} else {
//					// status is "P" but not from email to activate registration - prompt error
//					path =sHTMLROOT + oN2NSession.getSetting("loginPage");
//					printJSS(2,oN2NSession.getSetting("registration.complete.EN"),path,"",oN2NSession);
//				}
//			}
			// If registration activated or status is A or S, connect ATP
			if (!pendingReg) {
				try {
					boolean alreadyLogin = false;
					if (session.getAttribute("rawLoginMessage")!=null) {
						if (!session.getAttribute("rawLoginMessage").toString().trim().equals("") && !session.getAttribute("rawLoginMessage").toString().trim().equals("null")) {
							alreadyLogin = true;
						}
					} else {
						alreadyLogin = false;
					}
//					if (!alreadyLogin) {// TODO
						// The first line of code generates a new session object, or retrieves an existing one. 
						// The second line sees if the session is new by checking the value from isNew(). 
						// A true tells you the session was just created; 
						// a false means this user already had a session and you need to invalidate it. 
						// One possible reason the user would have an old session is that he or she has two accounts and logged in on one, 
						// then tried to log in on the other
						session = request.getSession (true);
						if (session.isNew() == false) {
							if (session!=null) {
								session.invalidate();	
							}
							session = request.getSession(true);
						} 
						context = conn.login(sUsername, sPassword, sClientIP, session, oN2NSession);
						System.out.println("context at login:"+context.getErrorMsg());
//					}
					// clear the session after login successful
					session.setAttribute("errChgMsg","");
					session.setAttribute("errMsg","");
					// end clear the session
				} catch (TCException e) {
					e.printStackTrace();
				}
				if (context!=null) {
					session.setAttribute("errChgMsg","");
					if (context.getErrorMsg()!=null && !context.getErrorMsg().equals("")) {
						System.out.println("["+m_nID+"]Error during login for userid "+session.getAttribute("loginid")+":"+context.getErrorMsg());
						String errMsgFilter = context.getErrorMsg();
						try {
							if (filterErrorMessageLogin(context.getErrorMsg(), oN2NSession)) {
								errMsgFilter = oN2NSession.getSetting("error.message.during.login.exception.alert");
							}
						} catch (Exception e) {
							errMsgFilter = context.getErrorMsg();
						}
						session.setAttribute("errMsg",errMsgFilter);
						session.setAttribute("loginid","");
						session.setAttribute("en_loginid","");
						session.setAttribute("pwdreset","Y");
						session.setAttribute("clicode","");
						session.setAttribute("lang","");
						session.setAttribute("isJVM","");
						session.setAttribute("userPrams", "");
						session.setAttribute("userParam", "");
						session.setAttribute("userPram", "");
						session.setAttribute("rawLoginMessage", "");
						session.setAttribute("URL_loginMessage", "");
						
						if(sFromUrl.equals("regLogin")){
							path = sHTMLROOT + oN2NSession.getSetting("regLogin");
						} else {
							path = sHTMLROOT + loginPage;
						}
					} else { // login successfully with no error message
						session.setAttribute("errMsg","");
						session.setAttribute("loginid",sUsername);
						session.setAttribute("en_loginid",context.getLoginID()); 
						session.setAttribute("pwdreset","N");
						session.setAttribute("lang",lang);
						session.setAttribute("isJVM","");
						session.setAttribute("URL_loginMessage", sHTMLROOT + oN2NSession.getSetting("MessageDisplay"));

						if (!sActivationReg.equals("") && sActivationReg.equalsIgnoreCase("ActivateReg")) {
							path = sHTMLROOT + oN2NSession.getSetting("registrationActivatePage");
						} else {
							boolean pwdReset = false;
							// Check whether the password had reset, 1 is reset, 0 is not
							if (context.getIsPwdReset()!=null && context.getIsPwdReset().equals("1")) {
								pwdReset = true; 
							}
							pwdReset = checkPasswordNumeric(sPassword, pwdReset); // check whether the password is all numeric
								
							if (pwdReset) {
								session.setAttribute("uuid",enc.fetchEncode(sUsername));
								session.setAttribute("loginid", sUsername);
								session.setAttribute("rawLoginMessage", "");
								session.setAttribute("URL_loginMessage", "");								
								path = sHTMLROOT + oN2NSession.getSetting("forceChgDefaultPwdPage") + "?uuid="+enc.fetchEncode(sUsername)+"&from_path=default";
								printJSS(9,path,sHTMLROOT +   loginPage,"'left=310,top=225,width=380,height=400,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes'",oN2NSession);
							} else {
								// Successful Login
								session.setAttribute("encID",enc.fetchEncode(sUsername));
								session.setAttribute("loginid",sUsername);
								session.setAttribute("encPwd",enc.fetchEncode(sPassword));
								session.setAttribute("uuid","");
								try {
//									atpURL = atpServerURL;
//									atpURL = session!=null ? session.getAttribute("ATPURLprivate")!=null?session.getAttribute("ATPURLprivate").toString().trim():atpServerURL : atpServerURL;
//									conn = new com.n2n.util.N2NATPConnect(atpURL);
//									com.n2n.connection.LoginContext context_tradeClient = conn.tradeClient(sUsername, context.getExCliCode(), session);
//									if (context_tradeClient!=null) {
//										if (context_tradeClient.getErrorMsg()!=null && !("").equals(context_tradeClient.getErrorMsg())) {
//											String sInvalidSession_tradeClient = context_tradeClient.getErrorMsg();
//											
//											if (sInvalidSession_tradeClient.indexOf("1100 ATP")>0 || sInvalidSession_tradeClient.equalsIgnoreCase("1100ATP")) {
//												System.out.println("["+m_nID+"]invalidating session... from "+sFromUrl);				
//												oN2NSession.setLogoutStatus(1);
//												if (session!=null) {
//													session.invalidate();	
//												}
//												printJSS(4,oN2NSession.getSetting("InvalidSession.MultipleLogin.EN"),oN2NSession.getSetting("HTMLRootHome"),"",oN2NSession);
//												
//											} else {
//												// TODO Error 1201 ATP - Session time outprint
//												// Reconnect session
//												try {
//													atpURL = session.getAttribute("ATPURLprivate")!=null?session.getAttribute("ATPURLprivate").toString().trim():atpServerURL;
//													conn = new com.n2n.util.N2NATPConnect(atpURL);
//													
//													context_tradeClient = connectATPAgain(session, conn, oN2NSession, sUsername, sClientIP, lang, sHTMLROOT);	
//													context_tradeClient = conn.tradeClient(sUsername, context_tradeClient.getExCliCode(), session);
//												} catch (Exception exec) {
//													exec.printStackTrace();
//												}
//											}
//										}
//										session.setAttribute("tradingAcc",!("").equals(context_tradeClient.getUserParam())?"1":"0");
										session.setAttribute("tradingAcc",context.getReason());
//										session.setAttribute("clientTradAccList", !("").equals(context_tradeClient.getUserParam())?context_tradeClient.getUserParam().toString().trim():"");
										
//									}
									strBufferMsg = new StringBuffer();
									strBufferMsg.append("Login successfully at |"+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"|sUsername:"+session.getAttribute("encID")+"|sPassword:"+session.getAttribute("encPwd")+"|action:"+(sAction.equals("")?"login":sAction)+"|actionPath:"+actionPath+"|fromURL:"+sFromUrl+"|activateReg:"+sActivationReg+"|lang:"+lang+"|IP:"+sClientIP+"|loginId:"+session.getAttribute("loginid")+"|clicode:"+session.getAttribute("clicode")+"|category:"+sCategory+"|tradingAcc:"+session.getAttribute("tradingAcc")+"|");
									com.n2n.util.Logging.logAPAgent1(strBufferMsg, "login");
								} catch (Exception exeTradeClient) { // TODO
									System.out.println("["+m_nID+"]Unable to retrieve userid "+session.getAttribute("loginid")+" trading option exeTradeClient:"+exeTradeClient.getMessage());
								}
								String hidden_path = sHTMLROOT +   loginPage;
								if (actionPath.equalsIgnoreCase("eng_hall")) {
									if (sFromUrl.equalsIgnoreCase("en_trading_hall")) {
										path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage")+"?lang=en";
										printJSS(8,path,hidden_path,"",oN2NSession);
									} else if (sFromUrl.equalsIgnoreCase("en_trading_hall_inner")) {
										path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePageInner_EN")+"?lang=en";
										printJSS(8,path,hidden_path,"",oN2NSession);
									} else {
//										System.out.println("session now is:"+session.getAttribute("userPram"));
//										System.out.println("uuid now is:"+session.getAttribute("uuid"));
										//path = sHTMLROOT +   oN2NSession.getSetting("loginPage");
//										path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage_EN");
										path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage_EN")+"&t="+requestTime+"A"+en.fetchEncode(sUsername);
//										printJSS(8,path,hidden_path,"",oN2NSession);
//										printJSS(10,oN2NSession.getSetting("HTMLRoot") + oN2NSession.getSetting("HTMLRealTimePage_EN"),"","",oN2NSession);
									}
								} else if (actionPath.equalsIgnoreCase("chi_hall")) {
									if (sFromUrl.equalsIgnoreCase("zh_trading_hall")) {
										path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage")+"?lang=cn";
										printJSS(8,path,hidden_path,"",oN2NSession);
//										printJSS(10,path,"","",oN2NSession);
									} else if (sFromUrl.equalsIgnoreCase("zh_trading_hall_inner") || sFromUrl.equalsIgnoreCase("cn_trading_hall_inner")) {
										path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePageInner_ZH")+"?lang=cn";
										printJSS(8,path,hidden_path,"",oN2NSession);
									} else {
//										path = sHTMLROOT +   oN2NSession.getSetting("loginPage");
										path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage_ZH")+"&t="+requestTime+"A"+en.fetchEncode(sUsername);
//										path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage_ZH");
//										printJSS(8,path,hidden_path,"",oN2NSession);
//										printJSS(10,oN2NSession.getSetting("HTMLRoot") + oN2NSession.getSetting("HTMLRealTimePage_ZH"),"","",oN2NSession);
									}								
								} else if (actionPath.equalsIgnoreCase("deriv_hall")) {
//									path = sHTMLROOT +   oN2NSession.getSetting("loginPage");
									path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage_Derivative")+"&t="+requestTime+"A"+en.fetchEncode(sUsername);
//									printJSS(8,path,hidden_path,"",oN2NSession);
								} else if (actionPath.equalsIgnoreCase("research")) {
//									path = sHTMLROOT +   oN2NSession.getSetting("loginPage");
//									path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage_Research");
									path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage_Research")+"?t="+requestTime+"A"+en.fetchEncode(sUsername);
//									printJSS(8,path,hidden_path,"",oN2NSession);
								} else if (actionPath.equalsIgnoreCase("default")) {
									System.out.println("reach here..."+sFromUrl+"|");
//									path = sHTMLROOT +   oN2NSession.getSetting("loginPage");
									path = sHTMLROOT +   sFromUrl;
//									printJSS(8,path,hidden_path,"",oN2NSession);
								} else if (actionPath.equalsIgnoreCase("old_hall")) {
//									path = sHTMLROOT +   oN2NSession.getSetting("loginPage");
									path = sHTMLROOT +   oN2NSession.getSetting("HTMLRealTimePage_Old");
									printJSS(8,path,hidden_path,"",oN2NSession);
								}else if (actionPath.length() > 0) {
									path = sHTMLROOT + "/" + actionPath;
									printJSS(8,path,hidden_path,"",oN2NSession);
								}
								else {
									path = sHTMLROOT +   loginPage;
									if (!sFromUrl.equals("")) {
										if (sFromUrl.equalsIgnoreCase("research")) {
//											path = sHTMLROOT +   oN2NSession.getSetting("loginPage");
											path = sHTMLROOT + oN2NSession.getSetting("HTMLRealTimePage_research");
											printJSS(8,path,hidden_path,"",oN2NSession);
										}
									}
								}
							}
						} 
					}
					System.out.println("["+m_nID+"]redirect userid "+session.getAttribute("loginid")+":"+path+":"+new java.util.Date()+":"+(new java.util.Date().getTime()-dateNow.getTime()));
					response.sendRedirect(path);
				} else { // If hit Request Timeoutprint
					System.out.println("["+m_nID+"]redirect userid "+session.getAttribute("loginid")+":Timeout");
					session.setAttribute("uuid","");
					session.setAttribute("userPrams", "");
					session.setAttribute("userParam", "");
					session.setAttribute("userPram", "");
					session.setAttribute("loginid", "");
					session.setAttribute("rawLoginMessage", "");					
					session.setAttribute("errMsg",oN2NSession.getSetting("timeoutprintMsg"));
					session.setAttribute("isFirstTime","");
					path = sHTMLROOT +   loginPage;
					response.sendRedirect(path);
				}				
			} // end pendingReg
			
		} else if (sAction.equalsIgnoreCase("ForgetPasswd")) {
		
		} else if (sAction.equalsIgnoreCase("RegisterUser")) {

		} else if (sAction.equalsIgnoreCase("GetAccountInfo")) {

		} else if (sAction.equalsIgnoreCase("RegisterSubscription")) {
			String exchCodeList = request.getParameter("exchCode");
			String exchCodeDefault = request.getParameter("def");
			String exch_code[] = new String[2];
			if (exchCodeList!=null && !("").equals(exchCodeList)) {
				if (exchCodeList.length()<=2) { // if there is 1 or 2 exchange 
					if (exchCodeList.length()==2) { // ED
						if (exchCodeList.substring(0,1).equals(exchCodeDefault)) { // ED = E
							exch_code = new String[1];
							exch_code[0] = exchCodeList.substring(1,2).equals("D")?"MY":"KL";
						} else if (!exchCodeList.substring(0,1).equals(exchCodeDefault)) { // ED = D
							if (exchCodeList.substring(1,2).equals(exchCodeDefault)) { // ED = D
								exch_code = new String[1];
								exch_code[0]=exchCodeList.substring(0,1).equals("D")?"MY":"KL";
							} else if (!exchCodeList.substring(1,2).equals(exchCodeDefault)) { // ED = ""
								exch_code = new String[2];
								exch_code[0]=exchCodeList.substring(0,1).equals("D")?"MY":"KL";
								exch_code[1]=exchCodeList.substring(1,2).equals("D")?"MY":"KL";
							}
						}
					} else if (exchCodeList.length()==1) { // E or D
						if (exchCodeList.substring(0,1).equals(exchCodeDefault)) {
							exch_code = new String[1];
							exch_code[0]=null;
						} else {
							exch_code = new String[1];
							exch_code[0]=exchCodeList.substring(0,1).equals("D")?"MY":"KL";
						}
					}
				} // no checking for more than 2 exchange
			}
			try {
				BklAccessService accessService = cliInfo.getService_Plain(oN2NSession);
				System.out.println("["+m_nID+"]exchCodeList in addNewClientRegisteredExchange:"+exchCodeList+":clientCode:"+session.getAttribute("clicode")+":defaultExchange:"+exchCodeDefault+":exch_code:"+exch_code[0]);
				accessService.addNewClientRegisteredExchange(session.getAttribute("clicode").toString(), exch_code);
				path = sHTMLROOT + "/msgRegSucc.jsp";
				response.sendRedirect(path);
			} catch (MalformedURLException e) {
				System.out.println("["+m_nID+"]MalformedURLException :"+e.getMessage());
				e.printStackTrace();
				path = sHTMLROOT + "/acctInfo.jsp?regtype="+exchCodeDefault;
				session.setAttribute("regErrMsg", oN2NSession.getSetting("global_error_message"));
				response.sendRedirect(path);
			} catch (Exception excep) {
				System.out.println("["+m_nID+"]Exception :"+excep.getMessage());
				excep.printStackTrace();
				path = sHTMLROOT + "/acctInfo.jsp?regtype="+exchCodeDefault;
				session.setAttribute("regErrMsg", oN2NSession.getSetting("global_error_message"));
				response.sendRedirect(path);
			}			
		}
	}

	private boolean checkPasswordNumeric(String password, boolean pwdReset) {
		if (!pwdReset) {
			String regex = "^[0-9]*$";
			Pattern pattern = Pattern.compile(regex);
			if (password!=null) {
				if (!password.toString().equals("")) {
					Matcher matcher = pattern.matcher(password);
					// Find all the matches.
					while (matcher.find()) {
						pwdReset = true;
					}			
				}
			}
		}
		return pwdReset;
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	public void printJSS(int viType, String vsMsg, String vsRedirectUrl, String sizeMap, N2NSession oN2NSession) {
		if (vsMsg!=null) {
			vsMsg = vsMsg.trim();	
		}
		vsRedirectUrl = vsRedirectUrl.trim();
//		outs.println("<script language=JavaScript src=\"/gc/js/popupWindow.js\"></script>");
		outs.println("<script language='javascript'>");
		if (viType<8) {
			if (vsMsg.trim().length() > 0) {
				outs.println("	alert('" + vsMsg + "');");
			}
			
		}

		if (viType == 1) {
			if (vsRedirectUrl.equalsIgnoreCase("back")) {
				outs.println("	history.go(-1);");
			} else {
				outs.println("try{");
				outs.println("	if (parent != null) {");
				outs.println("       if (parent.location != null){");
				outs.println("           parent.location.href = '" + vsRedirectUrl + "';");
				outs.println("		} else {");
				outs.println("			this.location.href='" + vsRedirectUrl + "';");
				outs.println("		}");
				outs.println("	} else {");
				outs.println("		this.location.href='" + vsRedirectUrl + "';");
				outs.println("	}");
				outs.println("} catch(ex){");
				outs.println("	this.location.href='" + vsRedirectUrl + "';");
				outs.println("}");
			}
		} else if (viType == 2) {
			outs.println("this.location.href='" + vsRedirectUrl + "';");
		} else if (viType == 3) {
			outs.println("window.open('"+vsRedirectUrl+"','',"+sizeMap+")");
		} else if (viType == 4) {
			outs.println("parent.location.href='" + vsRedirectUrl + "';");
		} else if ((viType == 5) || (viType == 6) || (viType == 7)) {

			if (vsRedirectUrl.equalsIgnoreCase("back")) {
				outs.println("	history.go(-1);");
			} else {

				if (viType == 5) {
					outs.println("if(parent.opener.parent != null ) {");
					outs.println("	parent.opener.parent.location.reload(true);");
					outs.println("}");
				}
				outs.println("try{");
				outs.println("	if (parent != null) {");
				outs.println("       if (parent.location != null){");
				outs.println("           parent.location.href = '" + vsRedirectUrl + "';");
				outs.println("		} else {");
				outs.println("			this.location.href='" + vsRedirectUrl + "';");
				outs.println("		}");
				outs.println("	} else {");
				outs.println("		this.location.href='" + vsRedirectUrl + "';");
				outs.println("");
				outs.println("	}");
				outs.println("} catch(ex){");
				outs.println("	this.location.href='" + vsRedirectUrl + "';");
				outs.println("}");
			}
		} else if (viType==8) {
			outs.println("	this.location.href='" + vsRedirectUrl + "';");
			outs.println("   parent.location.href = '" + vsMsg + "';");
		} else if (viType==9) {
			outs.println("	this.location.href='" + vsRedirectUrl + "';");
			if (sizeMap==null&&"".equals(sizeMap)) {
				sizeMap = "'width=1020,height=1000,scrollbars=0'";
			}
			outs.println("window.open('"+vsMsg+"','title',"+sizeMap+")");
		} else if (viType==10) {
			outs.println("   parent.location.href = '" + vsMsg + "';");
		}

		outs.println("</script>");
		outs.flush();
		outs.close();
		outs = null;
	}

//	private String getFooterStr(String lang, N2NSession oN2NSession) {
//
//		try {
//			String rawfooter = URLReader("footer_" + lang, oN2NSession);
//			String patternBegin = "<td id=\"fontWhite_10EN\" class=\"fontWhite_10EN\" width=\"60%\">";
//			String patternEnd = "</td>";
//
//			if (!lang.equalsIgnoreCase("EN")) {
//				patternBegin = "<td id=\"fontWhite_10EN\" class=\"fontWhite_10AR\" width=\"60%\">";
//				patternEnd = "</td>";
//			}
//
//			int begin = rawfooter.indexOf(patternBegin);
//			int end = rawfooter.indexOf(patternEnd);
//
//			if (begin > 0 && end > 0) {
//				rawfooter = rawfooter.substring(begin, end);
//
//				return rawfooter.replaceFirst(patternBegin, "");
//			}
//			return "All rights reserved.";
//
//		} catch (Exception ex) {
//			ex.printStackTrace();
//		}
//
//		return "";
//	}

	private String URLReader(String newspath, N2NSession oN2NSession) {
		String myURL = "";
		myURL = oN2NSession.getSetting("LanguageFiles") + newspath + ".txt";
		try {
			File file = new File(myURL); 
			FileInputStream fis = null;
			StringBuffer buffer = new StringBuffer();
			fis = new FileInputStream(file);
			InputStreamReader isr = new InputStreamReader(fis, "UTF8");
			Reader in = new BufferedReader(isr);
			int ch;
			while ((ch = in.read()) > -1) {
				buffer.append((char) ch);
			}
			in.close();
			return buffer.toString();
		} catch (FileNotFoundException e) {
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public static void main(String[] args) {
//		xmlreader s = new xmlreader();
//		System.out.println("msg:"+xmlreader.getLangByKey("EN", "ALERT_TIMEoutprintMSGATP"));
		
		try {
			String scheduled_time = "0630";
			java.util.Calendar expDate = java.util.Calendar.getInstance();
			expDate.add(java.util.Calendar.DATE, 1);
			String strExpDate = new java.text.SimpleDateFormat("yyyyMMdd "+scheduled_time).format(expDate.getTime());
			java.util.Date expDates = null;
			expDates = new java.text.SimpleDateFormat("yyyyMMdd HHmm").parse(strExpDate);
			System.out.println("expDate:"+expDates);
			if (expDates.after(new java.util.Date())) {
				System.out.println("not expired");
			} else if (expDates.before(new java.util.Date())) {
				System.out.println("is expired");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		Encrypt en = new Encrypt();
		System.out.println("1:"+en.fetchEncode("http://www.mnaonline.com.my/n2n_gc/java/jar/swing/xml/057KL_ED_qsea.xml"));
		System.out.println("2:"+en.fetchEncode("http://test.asiaebroker.com/java/jar/swing/xml/057KL_ED_qsea.xml"));
		System.out.println("3:"+en.fetchEncode("http://test.asiaebroker.com/java/jar/swing/xml/057KL_qsea_i.xml"));
		System.out.println("4:"+en.fetchEncode("http://test.asiaebroker.com/java/jar/swing/xml/057KL_NA_qsea.xml"));
		System.out.println("5:"+en.fetchEncode("http://test.asiaebroker.com/java/jar/swing/xml/057KL_NA_qsea_i.xml"));
		System.out.println("6:"+en.fetchEncode("http://123.30.12.173:8010/WebService.asmx?wsdl"));
//		System.out.println("checksum:"+en.fetchEncode("amesecurities.com"));
		Decrypt de = new Decrypt();
		System.out.println(de.fetchDecode("835731311835731311868459391866455631865787711835731311867123551866455631867123551868459391865787711837067151838402991838402991837067151835063391867791471865787711865787711867123551865787711833727551865787711838402991835063391867791471865787711868459391865787711833059631838402991837067151"));
		System.out.println("1:"+de.fetchDecode("833727551836399231833727551833059631835731311833727551"));
		System.out.println("2:"+de.fetchDecode("833727551883153631849089711835063391857104751883153631833059631832391711832391711832391711883153631832391711831055871833059631838402991883153631832391711883153631833727551832391711833059631832391711830387951832391711834395471830387951832391711833059631883153631833727551836399231831055871837735071836399231883153631833059631836399231834395471831055871833059631835063391883153631832391711833059631834395471833059631835731311833727551836399231830387951832391711832391711833059631883153631830387951830387951830387951830387951830387951830387951883153631832391711883153631833727551883153631855768911847753871845750111883153631855768911847753871845750111883153631833059631883153631821704991883153631821704991883153631865787711883153631821704991"));
		System.out.println("3:"+de.fetchDecode("833727551836399231833727551833059631835731311833727551"));
		System.out.println("4:"+de.fetchDecode("832391711883153631883153631883153631832391711"));
		System.out.println("5:"+de.fetchDecode("832391711883153631833727551832391711833059631832391711830387951834395471830387951833059631883153631833727551832391711833059631832391711830387951834395471830387951833059631883153631833059631833059631"));
		System.out.println("6:"+de.fetchDecode("846418031847085951847753871849757631852429311855768911"));
		System.out.println("7:"+de.fetchDecode("843746351832391711832391711832391711834395471835063391"));
		System.out.println("8:"+de.fetchDecode("855768911849089711"));
		System.out.println("9:"+de.fetchDecode("852429311"));
		
		System.out.println("___________________:"+de.fetchDecode("869795231877810271877810271875138591839070911831723791831723791873802751833727551873802751877810271865787711868459391867123551833727551833727551831055871865119791877142351870463151865119791867791471865787711876474431874470671871798991867791471876474431831055871866455631874470671873134831831723791871131071865119791879146111865119791831723791871131071865119791876474431831723791877142351879814031870463151873802751869127311831723791880481951873134831872466911831723791832391711837067151834395471850425551851093471863783951875806511877142351867123551831055871880481951873134831872466911"));
		System.out.println("testing TA");
		System.out.println("______:"+en.fetchEncode("meeyen70"));
		System.out.println("___7a439b35634cd1ec1753082bb43dfa51 TA test:"+de.fetchDecode("833059631834395471837067151833059631833727551866455631838402991834395471834395471835731311865119791837735071838402991835063391838402991865119791837067151834395471837735071868459391868459391837067151865119791836399231833727551867791471832391711837067151865119791834395471832391711834395471"));
		System.out.println("ASASA____________________TA prod:"+de.fetchDecode("865119791865787711866455631833059631833727551834395471"));
		System.out.println("_______________________TA prod:"+en.fetchEncode("http://218.100.22.97/QSDA/qsda/073KL_qsda.xml"));
		System.out.println("_AS________:"+en.fetchEncode("http://jar.asiaebroker.com/java/jar/swing/xml/VN_ED_qsea.xml"));
		System.out.println("end TA");
		System.out.println("__________:"+en.fetchEncode("http://192.168.20.41:8010/WebSerDev/WebService.asmx"));
		System.out.println("___________:"+en.fetchEncode("http://123.30.12.173:8010/WebSerDev/WebService.asmx"));
		System.out.println("___________:"+en.fetchEncode("AuRjHQhdxQ=="));
		String sInvalidSession = "Error 501  1100 ATP - Invalid session";
		System.out.println("invalid1:"+sInvalidSession.indexOf("1100 ATP"));
		String loginID = "test200ABC";
		GCLoginServletATP gc = new GCLoginServletATP();
		String enc1 = en.fetchEncode(gc.encryptString(loginID));
		System.out.println("encrypt now:"+enc1);
		System.out.println("decrypt now:"+de.fetchDecode(enc1));
		System.out.println("original:"+loginID);
		System.out.println("time:"+new java.text.SimpleDateFormat("yyyyMMddHHmm").format(new java.util.Date()).equals("200912111705"));
		sInvalidSession = "1100ATP";
		if (sInvalidSession.indexOf("1100 ATP")>0 || sInvalidSession.equalsIgnoreCase("1100ATP")) {
			System.out.println("test");
		}
		String sResult = "121213.000";
		if (sResult.indexOf('.')>0) {
			sResult=sResult.substring(0, sResult.lastIndexOf('.'));	
		}
		System.out.println("sResult1:"+sResult);
		
		if (sResult.length() == 7 && sResult.substring(sResult.length()-2).equals("00")){
			sResult = sResult.substring(0, sResult.length()-2);
		}
		System.out.println("sResult2:" + sResult);
		
		if (sResult.length()<=5){
			for (int k = sResult.length(); k < 6; k++){
				sResult="0"+sResult;
			}
		}
		System.out.println("sResult3:"+sResult);
		
		String value="12412012";
		String regex = "^[0-9]*$";
		boolean values = false;
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(value);
		// Find all the matches.
		while (matcher.find()) {
			values = true;
		}
		System.out.println("matched found:"+values);
		
		//123.30.12.172  public ip
		//192.168.20.46  private ip
		String ip = "192.168.20.41";
		String ip1 = "123.30.12.173";
		System.out.println("ip1:"+ip.substring(0,3));
		System.out.println("ip2:"+ip1.substring(0,3));
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
	
	private com.n2n.connection.LoginContext connectATPAgain(HttpSession session, N2NATPConnect conn, N2NSession oN2NSession, String sUsername, String sClientIP, String lang, String sHTMLROOT) {
		Decrypt dec = new Decrypt();
		com.n2n.connection.LoginContext context = new com.n2n.connection.LoginContext();
		String encUsername = session.getAttribute("encID")!=null?dec.fetchDecode(session.getAttribute("encID").toString().trim()):"";
		String encPassword = session.getAttribute("encPwd")!=null?dec.fetchDecode(session.getAttribute("encPwd").toString().trim()):"";
//		System.out.println(new java.text.SimpleDateFormat("["+session.getId()+"]yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"|sUsername:"+encUsername+"|sPassword:"+encPassword+"|action:connectATPAgain|session:"+session+"|atpURL:"+session.getAttribute("ATPURLpublic")+"|oN2NSession:"+session.getAttribute("oN2NSession")+"|loginid:"+session.getAttribute("loginid")+"|");
		try {
			context = conn.login(encUsername, encPassword, sClientIP, session, oN2NSession);
			if (context!=null) {
				session.setAttribute("errMsg","");
				session.setAttribute("loginid",encUsername);
				session.setAttribute("en_loginid",context.getLoginID()); 
				session.setAttribute("pwdreset","N");
				session.setAttribute("lang",lang);
				session.setAttribute("isJVM","");
				session.setAttribute("URL_loginMessage", sHTMLROOT +   oN2NSession.getSetting("MessageDisplay"));
			}
		} catch (TCException e) {
			e.printStackTrace();
		}
		return context;
	}
	
	private void writeValues(String[] values, java.io.PrintWriter outprint) {
		if (outprint!=null) {
			outprint.print("--_BeginData_\r\n");
			outprint.print("[UserAction]="+values[0]+"\r\n");
			outprint.print("[UserResults]=0|"+values[1]+"\r\n");
			outprint.print("[UserPage]="+values[2]+"\r\n");
			outprint.print("[UserLoginID]="+values[3]+"\r\n");
			outprint.print("[UserDateTime]]="+values[4]+"\r\n");
			outprint.print("--_EndData_\r\n");	
		}
	}
	
	private boolean filterErrorMessageLogin(String errMsg, N2NSession oN2NSession) {
		String errMsgFilter = oN2NSession.getSetting("error.message.during.login.exception1");
		try {
			int count = new Integer(oN2NSession.getSetting("error.message.during.login.exception.count").toString()).intValue();
			for (int i=1;i<(count+1);i++) {
				errMsgFilter = oN2NSession.getSetting("error.message.during.login.exception"+i);
				if (errMsg.indexOf(errMsgFilter)>-1) {
					return true;
				}
			}
		} catch (Exception e) {
			return false;
		}
		return false;
	}
}