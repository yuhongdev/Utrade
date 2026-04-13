<%@ page import = "com.n2n.util.N2NConst, java.net.*, java.io.*, java.util.HashMap"%>
<%@include file="/common.jsp"%>
<%!
	private java.util.Map<String, String>[] processMapData(String str) {
		String[] arrsResults = str.split("\n");

		String sTmpKey = arrsResults[0];
		String[] arrsKey = {};

		if (sTmpKey.length() > 1) {
			sTmpKey = sTmpKey.substring(sTmpKey.indexOf("(=") + 2);
			arrsKey = sTmpKey.split("\\|");
		}

		java.util.Map<String, String>[] mResults = new HashMap[arrsResults.length - 1];

		for (int i = 1; i < arrsResults.length; i++) {
			String sTmpValue = arrsResults[i].substring(arrsResults[i]
					.indexOf(")=") + 2);
			java.util.Map<String, String> mTmpResult = new HashMap<String, String>();

			String[] arrsValue = sTmpValue.split("\\|");

			for (int j = 0; j < arrsKey.length; j++) {
				String tmp = "";
				try {
					tmp = new String(arrsValue[j].getBytes("ISO-8859-1"),
							"UTF-8");
				} catch (java.io.UnsupportedEncodingException e) {
				} catch (ArrayIndexOutOfBoundsException e) {
				}
				mTmpResult.put(arrsKey[j], tmp);
			}
			mResults[i - 1] = mTmpResult;
		}

		return mResults;
	}
%>
<%
	int count = 0;
	String stkCode = request.getParameter("stkCode");
	stkCode = stkCode!=null?stkCode:"";
	
	if(stkCode.indexOf(".") > 0){
		stkCode = stkCode.substring(0,stkCode.indexOf("."));
	}
	
	String url = "http://"+session.getAttribute("ATPURLpublic")+"/["+session.getAttribute("userPrams")+"]TradePortfolio?'="+session.getAttribute("clicode")+"|.=|+="+stkCode+"|3=|M=|Z=1|b=";
	URLConnection connection = new URL(url).openConnection();
	connection.setRequestProperty("Accept-Charset", "UTF-8");
	InputStream input = connection.getInputStream();
	BufferedReader br = new BufferedReader(new InputStreamReader(input));
	StringBuilder sb = new StringBuilder();
	String line = null;

	while ((line = br.readLine()) != null) {
		if(count == 0){sb.append(line + "\n");}else if(line.indexOf(stkCode) > 0){sb.append(line + "\n");}
		count++;
	}
			
	br.close();
	
	java.util.Map<String, String>[] userParamMap = processMapData(sb.toString());
	for (java.util.Map<String, String> map : userParamMap) {
		out.println(map.get("N"));
		break;
	}
%>