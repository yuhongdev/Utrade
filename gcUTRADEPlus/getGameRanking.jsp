<%@ page import = "java.sql.*, java.util.*, java.util.Date, java.text.*, java.net.*, java.io.*, com.n2n.DB.DBManager, com.n2n.util.N2NConst, com.n2n.DB.N2NDBObject" session="true" %>
<%@ include file='common.jsp'%>
<%
	String driver = oN2NSession.getSetting("DBDriver");
	String url = oN2NSession.getSetting("DBURL");
	String userID = oN2NSession.getSetting("DBUID");
	String userPwd = oN2NSession.getSetting("DBPwd");
	String sSP = "usp_mfGetRanking";
	String sBegin = "--_BeginData_";
	String sEnd = "--_EndData_";
	String sData = "";
	String sLineBreak = "\n";
	String sPipe = "|";
	String sOpenBal = "";
	String sUniversity = "";
	String sTeam = "";
	String sContract = "";
	String sPerc = "";
	String sTotal = "";
	BufferedWriter fout = null;
	String sOutFile = "";
	int nWeek = 0;
	String sCat = "";
	Date dtToday = new Date();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat sdfJS = new SimpleDateFormat("d MMMM yyyy");
	Calendar cal = Calendar.getInstance();
	cal.setTime(dtToday);
	cal.add(Calendar.DATE, -1);
	dtToday = cal.getTime();
	DecimalFormat df = new DecimalFormat("###,###,###,###,###.##");
	DecimalFormat dfPerc = new DecimalFormat("###.##");

	try {

		Object[][] m_oParam = null;
		N2NConst m_const = new N2NConst();
		DBManager m_db = new DBManager();
		N2NDBObject m_dbObject;
		ResultSet m_dataResultSet;
	
		m_db.openConnection(driver, url, userID, userPwd);

		m_oParam = new Object[][]
		{
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, sdf.format(dtToday), m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "1", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "0", m_const.TYPES_EMPTY}
		};
						
		m_dbObject = new N2NDBObject();
		m_dbObject.setSP(sSP);
		m_dbObject.setParam(m_oParam);

		out.println("[getGameRanking.jsp] " + sSP + " '" + sdf.format(dtToday) + "'");
		m_db.runRsSP(m_dbObject);
		m_dataResultSet = m_dbObject.getResultSet();

		sData = "var sRanking='" + sdfJS.format(dtToday) + sPipe;
	
		while(m_dataResultSet.next())
		{
			sUniversity = m_dataResultSet.getString("Country");
			sTeam = m_dataResultSet.getString("Team Name");
			sUniversity = sUniversity.trim();
			sTeam  = sTeam.trim();
/*
			sOpenBal = m_dataResultSet.getString("OpenBal");
			sTotal = m_dataResultSet.getString("Total");
			sPerc = m_dataResultSet.getString("PER_GAIN_LOSS");

			try {
				sOpenBal = df.format(new Double(sOpenBal));
				sTotal = df.format(new Double(sTotal));
				sPerc = dfPerc.format(new Double(sPerc));
			} catch(Exception ex) {
				sOpenBal = sOpenBal;
				sTotal = sTotal;
				sPerc = sPerc;
			}
*/

			sData = sData + sTeam + sPipe;
		}
		sData = sData + "';";

		m_db.closeConnection(m_dbObject);

		sOutFile = oN2NSession.getSetting("AppCodeGeneratorPathJS") + "ranking.js";

		fout = new BufferedWriter(new FileWriter(sOutFile));
		fout.write(sData);
		fout.flush();
		fout.close();


/** MY **/
		m_db.openConnection(driver, url, userID, userPwd);

		m_oParam = new Object[][]
		{
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, sdf.format(dtToday), m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "1", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "0", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "MY", m_const.TYPES_EMPTY}
		};
						
		m_dbObject = new N2NDBObject();
		m_dbObject.setSP(sSP);
		m_dbObject.setParam(m_oParam);

		out.println("[getGameRanking.jsp] " + sSP + " '" + sdf.format(dtToday) + "',1,0,'MY'");
		m_db.runRsSP(m_dbObject);
		m_dataResultSet = m_dbObject.getResultSet();

		sData = "var sRanking_MY='" + sdfJS.format(dtToday) + sPipe;
	
		while(m_dataResultSet.next())
		{
			sUniversity = m_dataResultSet.getString("Country");
			sTeam = m_dataResultSet.getString("Team Name");
			sUniversity = sUniversity.trim();
			sTeam  = sTeam.trim();

			sData = sData + sTeam + sPipe;
		}
		sData = sData + "';";

		m_db.closeConnection(m_dbObject);

		sOutFile = oN2NSession.getSetting("AppCodeGeneratorPathJS") + "ranking_MY.js";

		fout = new BufferedWriter(new FileWriter(sOutFile));
		fout.write(sData);
		fout.flush();
		fout.close();

/** SG **/
		m_db.openConnection(driver, url, userID, userPwd);

		m_oParam = new Object[][]
		{
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, sdf.format(dtToday), m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "1", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "0", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "SG", m_const.TYPES_EMPTY}
		};
						
		m_dbObject = new N2NDBObject();
		m_dbObject.setSP(sSP);
		m_dbObject.setParam(m_oParam);

		out.println("[getGameRanking.jsp] " + sSP + " '" + sdf.format(dtToday) + "',1,0,'SG'");
		m_db.runRsSP(m_dbObject);
		m_dataResultSet = m_dbObject.getResultSet();

		sData = "var sRanking_SG='" + sdfJS.format(dtToday) + sPipe;
	
		while(m_dataResultSet.next())
		{
			sUniversity = m_dataResultSet.getString("Country");
			sTeam = m_dataResultSet.getString("Team Name");
			sUniversity = sUniversity.trim();
			sTeam  = sTeam.trim();

			sData = sData + sTeam + sPipe;
		}
		sData = sData + "';";

		m_db.closeConnection(m_dbObject);

		sOutFile = oN2NSession.getSetting("AppCodeGeneratorPathJS") + "ranking_SG.js";

		fout = new BufferedWriter(new FileWriter(sOutFile));
		fout.write(sData);
		fout.flush();
		fout.close();

/** ID **/
		m_db.openConnection(driver, url, userID, userPwd);

		m_oParam = new Object[][]
		{
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, sdf.format(dtToday), m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "1", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "0", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "ID", m_const.TYPES_EMPTY}
		};
						
		m_dbObject = new N2NDBObject();
		m_dbObject.setSP(sSP);
		m_dbObject.setParam(m_oParam);

		out.println("[getGameRanking.jsp] " + sSP + " '" + sdf.format(dtToday) + "',1,0,'ID'");
		m_db.runRsSP(m_dbObject);
		m_dataResultSet = m_dbObject.getResultSet();

		sData = "var sRanking_ID='" + sdfJS.format(dtToday) + sPipe;
	
		while(m_dataResultSet.next())
		{
			sUniversity = m_dataResultSet.getString("Country");
			sTeam = m_dataResultSet.getString("Team Name");
			sUniversity = sUniversity.trim();
			sTeam  = sTeam.trim();

			sData = sData + sTeam + sPipe;
		}
		sData = sData + "';";

		m_db.closeConnection(m_dbObject);

		sOutFile = oN2NSession.getSetting("AppCodeGeneratorPathJS") + "ranking_ID.js";

		fout = new BufferedWriter(new FileWriter(sOutFile));
		fout.write(sData);
		fout.flush();
		fout.close();

/** TH **/
		m_db.openConnection(driver, url, userID, userPwd);

		m_oParam = new Object[][]
		{
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, sdf.format(dtToday), m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "1", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "0", m_const.TYPES_EMPTY},
			{m_db.DB_PARAM_INPUT, m_db.TYPES_VARCHAR, "TH", m_const.TYPES_EMPTY}
		};
						
		m_dbObject = new N2NDBObject();
		m_dbObject.setSP(sSP);
		m_dbObject.setParam(m_oParam);

		out.println("[getGameRanking.jsp] " + sSP + " '" + sdf.format(dtToday) + "',1,0,'TH'");
		m_db.runRsSP(m_dbObject);
		m_dataResultSet = m_dbObject.getResultSet();

		sData = "var sRanking_TH='" + sdfJS.format(dtToday) + sPipe;
	
		while(m_dataResultSet.next())
		{
			sUniversity = m_dataResultSet.getString("Country");
			sTeam = m_dataResultSet.getString("Team Name");
			sUniversity = sUniversity.trim();
			sTeam  = sTeam.trim();

			sData = sData + sTeam + sPipe;
		}
		sData = sData + "';";

		m_db.closeConnection(m_dbObject);

		sOutFile = oN2NSession.getSetting("AppCodeGeneratorPathJS") + "ranking_TH.js";

		fout = new BufferedWriter(new FileWriter(sOutFile));
		fout.write(sData);
		fout.flush();
		fout.close();

	} catch(Exception e) {
		out.println("Exception in SQL Execution");
		out.println(e.getMessage());
	}
%>
			