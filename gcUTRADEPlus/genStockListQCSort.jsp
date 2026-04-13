<%@ include file="/common.jsp"%>
<%@ page import = "java.net.*, java.io.*, java.util.Arrays"%>
<%
String QCIP = "http://RTEFEED:20000";
String[] exArr = {"PH"};
String sOutFile2 = oN2NSession.getSetting("AppCodeGeneratorPathJS") + "stkCodeNameSuggList.js";
BufferedWriter fout, fout2;
fout2 = new BufferedWriter(new FileWriter(sOutFile2));
String exchCode = "", charset = "";

for(int count = 0 ; count < exArr.length ; count++){
try{
	charset = "UTF-8";
	exchCode = exArr[count];
	URLConnection connection = new URL(QCIP+"/%5BvUpJYKw4QvGRMBmhATUxRwv4JrU9aDnwNEuangVyy6OuHxi2YiY=%5DImage?[FAST]="+exchCode+"&[SECTOR]=10&[FIELD]=33,38&[COMPRESS]=1|||").openConnection();
	connection.setRequestProperty("Accept-Charset", charset);
	InputStream input = connection.getInputStream();

	BufferedReader br = new BufferedReader(new InputStreamReader(input));
	StringBuilder sbArr = new StringBuilder();
	StringBuilder sbArr2 = new StringBuilder();
	String line = null;
	Boolean start = false;
	Boolean first = true;
	String[] seperator = null;
	
	

	String sOutFile = oN2NSession.getSetting("AppCodeGeneratorPath") + "StkCodeNameFillList"+exchCode+".ref";
	

	fout = new BufferedWriter(new FileWriter(sOutFile));
	
		
	while ((line = br.readLine()) != null) {
		if(!line.trim().equals("[END]")){
			
			if(start){
				seperator = line.split(",");
				
				if(seperator.length == 2){
					if(!first){
						sbArr.append(",");
						sbArr2.append(",");						
					}else{
						first = false;
					}
					sbArr.append(seperator[1].replace("."+exchCode,"")+"|"+seperator[0]);
					sbArr2.append("\""+seperator[1].replace("."+exchCode,"")+"("+seperator[0]+")\"");
				}
			}else{
				if(!line.trim().equals("") && line.indexOf("[]") >= 0){
					start=true;
				}
			}
		
		}else{

		}
	}
	
	String [] stkList = sbArr.toString().split(",");
	String [] stkList2 = sbArr2.toString().split(",");
	Arrays.sort(stkList);
	Arrays.sort(stkList2);

	fout.write(Arrays.toString(stkList).substring(1,Arrays.toString(stkList).length()-1));
	fout2.write("var arrStkCodeName"+exArr[count]+" = "+Arrays.toString(stkList2)+";");
	
	br.close();
	
	fout.flush();
	fout.close();
	fout = null; 
	
		
	
	out.println(exArr[count].toString());
}catch (Exception ex){
	ex.printStackTrace();
}
}
fout2.flush();
	fout2.close();
	fout2 = null; 	
%>