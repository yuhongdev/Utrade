<%@ page import = "java.sql.*, java.lang.*, java.util.Date, java.text.SimpleDateFormat, com.n2n.util.N2NConst" %>
<%
boolean m_bConnected = false;
com.n2n.DB.DBManager m_db = new com.n2n.DB.DBManager();
com.n2n.DB.N2NDBObject m_dbObject = new com.n2n.DB.N2NDBObject();
try {
	m_db.openConnection(oN2NSession.getSetting("DBDriver"), oN2NSession.getSetting("DBURL"), oN2NSession.getSetting("DBUID"), oN2NSession.getSetting("DBPwd"));
	m_bConnected = true;
} catch (SQLException ex) {
	ex.printStackTrace();
	m_bConnected = false;
}

String chkSessionAgreement = "";
if(session.getAttribute("agreement_"+g_sLoginId)!=null) {
	chkSessionAgreement = session.getAttribute("agreement_"+g_sLoginId)!=null?session.getAttribute("agreement_"+g_sLoginId).toString():"";
}
if (chkSessionAgreement.equals("")) {
String agreedIndicator = request.getParameter("agreed")!=null?request.getParameter("agreed").toString():"";
String agreedClient = "";
if(session.getAttribute("client_"+g_sLoginId)!=null) {
	agreedClient = session.getAttribute("client_"+g_sLoginId)!=null?session.getAttribute("client_"+g_sLoginId).toString():request.getParameter("client_"+g_sLoginId)!=null?request.getParameter("client_"+g_sLoginId).toString():"";
}
String status = checkStatus(g_sCliCode,m_db,m_dbObject);
System.out.println("cliChkAgreement:"+status);
if (status!=null) {
  if (agreedIndicator.equals("") && agreedClient.equals("") && status.equals("Y")) {
//    out.println("<script language=JavaScript>window.open(\""+oN2NSession.getSetting("HTMLRoot")+g_sPath+"/web/agreement.jsp\",\"winAgreement\",\"left=100,top=100,width=705,height=615,resizable=yes,status=yes\",\"true\");</script>");
    out.println("<script language=JavaScript>window.location.href=\""+oN2NSession.getSetting("HTMLRoot")+g_sPath+"/web/agreement.jsp\"</script>");
  }
}
} // check only display once for the agreement


if (m_db!=null) {
	if (m_dbObject!=null) {
		m_db.closeConnection(m_dbObject);
	}
}

%>
<%!
public String checkStatus(String clientCode, com.n2n.DB.DBManager m_db, com.n2n.DB.N2NDBObject m_dbObject){
String value = "";
	try {	
		m_dbObject = new com.n2n.DB.N2NDBObject();
		m_dbObject.setSQL("usp_mfGetCliLoginInfo '"+clientCode+"' ");
		System.out.println("m_dbObject:"+m_dbObject.getSQL());
		m_db.runRsSQL(m_dbObject);
		if (m_dbObject.getResultSet()!=null) {
			while (m_dbObject.getResultSet().next()) {
				value = m_dbObject.getResultSet().getString("UpdTCInfo");
			}
		}
		return value;
	} catch (SQLException ex) {
		System.err.println("checkStatus:" + ex.getMessage());
		ex.printStackTrace();
		return null;
	}				
}
%>
