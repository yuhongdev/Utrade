<%@ page import = "java.sql.*, java.util.*, java.util.Date, java.text.*, java.net.*, java.io.*, com.n2n.DB.DBManager, com.n2n.util.N2NConst, com.n2n.DB.N2NDBObject" session="true" %>
<%
	String driver = "net.sourceforge.jtds.jdbc.Driver";
	String url = "jdbc:jtds:sqlserver://localhost:1433;DatabaseName=EBCGF;AppName=ebcGame;";
	String userID = "appuser";
	String userPwd = "YvEa9zQWR9FN7DA9S3dgRA==";
	String sSP = "usp_MFGetMthRank";
	String sBegin = "--_BeginData_";
	String sEnd = "--_EndData_";
	String sData = "";
	String sLineBreak = "\n";
	String sPipe = "|";
	String sCountry = "";
	String sUniversity = "";
	String sCliName = "";
	String sContract = "";
	String sCashOnHand = "";
	String sTotal = "";
	BufferedWriter fout = null;
	String sOutFile = "";

	try {

		Object[][] m_oParam = null;
		N2NConst m_const = new N2NConst();
		DBManager m_db = new DBManager();
		N2NDBObject m_dbObject;
		ResultSet m_dataResultSet;
	
		m_db.openConnection(driver, url, userID, userPwd);
	/*
		m_oParam = new Object[][]
		{
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, sNewsID, m_const.TYPES_EMPTY}
		};
	*/						
		m_dbObject = new N2NDBObject();
		m_dbObject.setSP(sSP);
		//m_dbObject.setParam(m_oParam);

		out.println(sSP);								
		m_db.runRsSP(m_dbObject);
		m_dataResultSet = m_dbObject.getResultSet();

		sData = sBegin + sLineBreak + sData;
	
		while(m_dataResultSet.next())
		{
			out.println(sData);
			sCliName = m_dataResultSet.getString("CliName");
			sCashOnHand = m_dataResultSet.getString("CashOnHand");
			sCountry = m_dataResultSet.getString("Country");
			sUniversity = m_dataResultSet.getString("University");
			sContract = m_dataResultSet.getString("Contract");
			sTotal = m_dataResultSet.getString("Total");
			sData = sData + sCliName + sPipe + sCountry + sPipe + sUniversity + sPipe + sCashOnHand + sPipe + sContract + sPipe + sTotal + sLineBreak;
		}
		sData = sData + sEnd;

		m_db.closeConnection(m_dbObject);

		sOutFile = "D:\\Tomcat 6.0\\webapps\\gcCIMB\\ref\\ranking.txt";
		fout = new BufferedWriter(new FileWriter(sOutFile));
		fout.write(sData);
		fout.flush();
		fout.close();

	} catch(Exception e) {
		out.println("Exception in SQL Execution");
		out.println(e.getMessage());
	}
%>
			