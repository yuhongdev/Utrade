<%@ page import ="java.io.PrintWriter"%>
<%!
	public final int m_nSTS_COLOR 		= 1;
	public final int m_nBAR_COLOR 		= 2;
	public final int m_nBAR_BOT_COLOR 	= 4;
	public final int m_nBTN_NAV_COLOR 	= 8;
	public final int m_nBTN_STK_COLOR 	= 16;
	public final int m_nPRICE_COLOR 	= 32;
	public final int m_nGRID_HDR_COLOR 	= 64;
	
	public String getAppletParam(int vnFeatures){
		String sParam = "";
		
		if ((vnFeatures & m_nSTS_COLOR) > 0){
			sParam += "<PARAM NAME=STS_OK_BG_COLOR VALUE='0,0,0'>\n";
			sParam += "<PARAM NAME=STS_OK_FG_COLOR VALUE='0,255,0'>\n";
			sParam += "<PARAM NAME=STS_ERR_BG_COLOR VALUE='255,0,0'>\n";
			sParam += "<PARAM NAME=STS_ERR_FG_COLOR VALUE='255,255,255'>\n";
		}
		
		if ((vnFeatures & m_nBAR_COLOR) > 0){
//			sParam += "<PARAM NAME=BAR_BG_COLOR VALUE='153,0,0'>\n";
			sParam += "<PARAM NAME=BAR_FG_COLOR VALUE='255,255,255'>\n";
			sParam += "<PARAM NAME=BAR_BG_COLOR VALUE='24,105,198'>\n";
//			sParam += "<PARAM NAME=BAR_FG_COLOR VALUE='0,0,0'>\n";
		}
		
		if ((vnFeatures & m_nBAR_BOT_COLOR) > 0){
			sParam += "<PARAM NAME=BAR_BOT_BG_COLOR VALUE='88,169,217'>\n";
			sParam += "<PARAM NAME=BAR_BOT_FG_COLOR VALUE='255,255,255'>\n";
		}
		
		if ((vnFeatures & m_nBTN_NAV_COLOR) > 0){
			sParam += "<PARAM NAME=BTN_NAV_BG_COLOR VALUE='30,96,167'>\n";
			sParam += "<PARAM NAME=BTN_NAV_FG_COLOR VALUE='255,255,255'>\n";
		}
		
		if ((vnFeatures & m_nBTN_STK_COLOR) > 0){
			sParam += "<PARAM NAME=BTN_STK_BG_COLOR VALUE='30,96,167'>\n";
			sParam += "<PARAM NAME=BTN_STK_FG_COLOR VALUE='255,255,255'>\n";
		}
		
		if ((vnFeatures & m_nPRICE_COLOR) > 0){
			sParam += "<PARAM NAME=UP_FG_COLOR VALUE='0,255,0'>\n";
			sParam += "<PARAM NAME=UNCHG_FG_COLOR VALUE='255,255,0'>\n";
			sParam += "<PARAM NAME=DOWN_FG_COLOR VALUE='255,0,0'>\n";
		}
		
		if ((vnFeatures & m_nGRID_HDR_COLOR) > 0){
			sParam += "<PARAM NAME=GRID_HDR_BG_COLOR VALUE='204,204,204'>\n";
			sParam += "<PARAM NAME=GRID_HDR_FG_COLOR VALUE='0,0,0'>\n";
		}
		
		return sParam;
	}
	
	public String RealTime_CSS_GetUIApplet() {
		StringBuffer strBuf = new StringBuffer();
		
		strBuf.append("<PARAM NAME=MENU1_BG_COLOR VALUE='204,204,204'>");
		strBuf.append("<PARAM NAME=MENU1_FG_COLOR VALUE='0,51,102'>");
		strBuf.append("<PARAM NAME=MENU2_BG_COLOR VALUE='204,204,204'>");
		strBuf.append("<PARAM NAME=MENU2_FG_COLOR VALUE='0,51,102'>");
		strBuf.append("<PARAM NAME=BTN_STK_BG_COLOR VALUE='204,204,204'>");
		strBuf.append("<PARAM NAME=BTN_STK_FG_COLOR VALUE='0,51,102'>");
		strBuf.append("<PARAM NAME=MKT_SUM_BG_COLOR VALUE='255,255,255'>");
		strBuf.append("<PARAM NAME=BTN_BIDS_BG_COLOR VALUE='0,51,102'>");
		strBuf.append("<PARAM NAME=BTN_BIDS_FG_COLOR VALUE='255,255,255'>");
		strBuf.append("<PARAM NAME=BTN_NAV_BG_COLOR VALUE='0,51,102'>");
		strBuf.append("<PARAM NAME=BTN_NAV_FG_COLOR VALUE='255,255,255'>");
		strBuf.append("<PARAM NAME=MENU1_BLINK_BG_COLOR VALUE='74,130,173'>");
		strBuf.append("<PARAM NAME=MENU1_BLINK_FG_COLOR VALUE='255,255,255'>");
		strBuf.append("<PARAM NAME=TOOLTIPS_BG_COLOR VALUE='192,192,192'>");
		strBuf.append("<PARAM NAME=TOOLTIPS_FG_COLOR VALUE='0,0,0'>");
		strBuf.append("<PARAM NAME=BG_COLOR VALUE='0,0,0'>");
		strBuf.append("<PARAM NAME=GRID_SELECTED_BG_COLOR VALUE='0,0,128'>");
		strBuf.append("<PARAM NAME=GRID_BG_COLOR VALUE='66,66,66'>");
	
		return strBuf.toString();
	}

	public String Tracker_CSS_GetUIApplet() {
		StringBuffer strBuf = new StringBuffer();
		
		strBuf.append("<PARAM NAME=STK_GRID_HEADER_BG_COLOR VALUE='0,51,102'>");
		strBuf.append("<PARAM NAME=STK_GRID_HEADER_FG_COLOR VALUE='255,255,255'>");
		strBuf.append("<PARAM NAME=BAR_BG_COLOR VALUE='0,51,102'>");
		strBuf.append("<PARAM NAME=BAR_FG_COLOR VALUE='255,255,255'>");
		strBuf.append("<PARAM NAME=buyColor VALUE='0,255,0'>");
		strBuf.append("<PARAM NAME=sellColor VALUE='255,0,0'>");
		strBuf.append("<PARAM NAME=STS_OK_BG_COLOR VALUE='0,255,0'>");
		strBuf.append("<PARAM NAME=STS_OK_FG_COLOR VALUE='0,0,0'>");
		
		return strBuf.toString();
	}
	
	public StringBuffer Indices_CSS_GetUIApplet(boolean vbGameMode) {
		StringBuffer sOutput = new StringBuffer();
		
		if (vbGameMode){
			sOutput.append("<PARAM NAME=MKT_SUM_BG_COLOR VALUE='74,130,173'>");
			sOutput.append("<PARAM NAME=MKT_SUM_FG_COLOR VALUE='255,255,255'>");
			sOutput.append("<PARAM NAME=BOTTOM_BAR_BG_COLOR VALUE='74,130,173'>");
			sOutput.append("<PARAM NAME=BTN_CHART_BG_COLOR VALUE='74,130,173'>");
			sOutput.append("<PARAM NAME=BTN_CHART_FG_COLOR VALUE='255,255,255'>");
			sOutput.append("<PARAM NAME=TRACKER_BAR_BG_COLOR VALUE='74,130,173'>");
			sOutput.append("<PARAM NAME=TRACKER_BAR_FG_COLOR VALUE='255,255,255'>");
			sOutput.append("<PARAM NAME=TRACKER_GRID_HDR_BG_COLOR VALUE='74,130,173'>");
			sOutput.append("<PARAM NAME=TRACKER_GRID_HDR_FG_COLOR VALUE='255,255,255'>");
		} else {
			sOutput.append("<PARAM NAME=MKT_SUM_BG_COLOR VALUE='255,255,255'>");
			sOutput.append("<PARAM NAME=MKT_SUM_FG_COLOR VALUE='0,0,0'>");
			sOutput.append("<PARAM NAME=BOTTOM_BAR_BG_COLOR VALUE='0,51,102'>");
			sOutput.append("<PARAM NAME=BTN_CHART_BG_COLOR VALUE='0,51,102'>");
			sOutput.append("<PARAM NAME=BTN_CHART_FG_COLOR VALUE='255,255,255'>");
			sOutput.append("<PARAM NAME=TRACKER_BAR_BG_COLOR VALUE='0,51,102'>");
			sOutput.append("<PARAM NAME=TRACKER_BAR_FG_COLOR VALUE='255,255,255'>");
			sOutput.append("<PARAM NAME=TRACKER_GRID_HDR_BG_COLOR VALUE='0,51,102'>");
			sOutput.append("<PARAM NAME=TRACKER_GRID_HDR_FG_COLOR VALUE='255,255,255'>");
		}
	
		sOutput.append("<PARAM NAME=STS_OK_BG_COLOR VALUE='0,255,0'>");
		sOutput.append("<PARAM NAME=STS_OK_FG_COLOR VALUE='0,0,0'>");
		sOutput.append("<PARAM NAME=GRID_SELECTED_BG_COLOR VALUE='51,51,51'>");
		sOutput.append("<PARAM NAME=DELAY_BG_COLOR VALUE='0,0,0'>");
		sOutput.append("<PARAM NAME=REALTIME_BG_COLOR VALUE='0,0,0'>");
		
		return sOutput;
	}	
	
	public void Scoreboard_CSS_GetGUIApplet(boolean vbGameMode, PrintWriter out) {
		if (vbGameMode) {
			out.println("<PARAM NAME=BAR_BG_COLOR VALUE='74,130,173'>");
			out.println("<PARAM NAME=BAR_FG_COLOR VALUE='255,255,255'>");
		} else {
			out.println("<PARAM NAME=BAR_BG_COLOR VALUE='0,51,102'>");
			out.println("<PARAM NAME=BAR_FG_COLOR VALUE='255,255,255'>");
		}
		
		out.println("<PARAM NAME=STS_OK_BG_COLOR VALUE='0,255,0'>");
		out.println("<PARAM NAME=STS_OK_FG_COLOR VALUE='0,0,0'>");
		out.println("<PARAM NAME=GRID_SELECTED_BG_COLOR VALUE='51,51,51'>");
		out.println("<PARAM NAME=DELAY_BG_COLOR VALUE='0,0,0'>");
		out.println("<PARAM NAME=REALTIME_BG_COLOR VALUE='0,0,0'>");
	}
%>