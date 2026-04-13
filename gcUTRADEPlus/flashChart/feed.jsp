<%@ page import = "java.net.*, java.io.*, java.util.Date, java.text.SimpleDateFormat, java.util.Vector" %>
<%
	Boolean isHK = false;
	String sParam = request.getParameter("request");
	String parameter = "?"+request.getQueryString();
	System.out.println("[INFO] ["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] [feed.jsp] QueryString : " + request.getRequestURL()+parameter);
	SimpleDateFormat dtFormat = new SimpleDateFormat("yyyy-MM-dd");
	
	String strDayOfWeek = new java.text.SimpleDateFormat("E").format(new java.util.Date());
	Boolean tradingDay = true;

	//Sat & Sun no intrady data
	if(strDayOfWeek.equalsIgnoreCase("SAT") || strDayOfWeek.equalsIgnoreCase("SUN"))
		tradingDay = false;
		
	String urlIntraDay = "http://172.17.2.211/rt/transactminute.jsp?[T]=";
	String urlHistorical = "http://172.17.2.211/hist/flschart.jsp";

	URLConnection connection = null;
	InputStream input = null;
	BufferedReader br = null;
	StringBuilder sbIntraDay = null;
	StringBuilder sbHistorical = null;
	Vector vList = new Vector(0, 0);
	
	String[] aData;
	String minDT = "", line = "", intra = "";
	String charset = "UTF-8";
	String delimiter = " ";

	//This is for Index Counter must use SGI exchange
	if(parameter.indexOf("INDEX_") > 0 && parameter.indexOf(".SG") > 0)
		parameter = parameter.replace(".SG",".SGI");

	if(sParam.indexOf("INDEX_") > 0 && sParam.indexOf(".SG") > 0)
		sParam = sParam.replace(".SG",".SGI");
		
	//This is for HK force to Delay
	if(parameter.indexOf(".HK") > 0){
		parameter = parameter.replace(".HK",".HKD");
		isHK = true;
	}

	if(sParam.indexOf(".HK") > 0)
		sParam = sParam.replace(".HK",".HKD");
	
	parameter = parameter.replace("+TICKS+", "+TICK+");

	/*
		INTRADAY
		aParam[1] - stock code.exchange	
		aParam[2] - Intraday
		aParam[3] - 60/30/5/1 minute	
		aParam[4] - number of record
		
		HISTORICAL
		aParam[1] - stock code.exchange	
		aParam[2] - Daily/Monthly/Yearly...
		aParam[3] - number of record
	*/
	
	System.out.println("[INFO] ["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] [feed.jsp] Historical URL : " + urlHistorical+parameter);
	
	String[] aParam = sParam.split(delimiter);
	
	/*
		For CIMB SG Local (Exchange = SG) Historical will return data until yesterday close,
		Therefore will need to append Intraday data to historical.
		
		Whereby for CIMB SG OB (Exchange != SG) will return data up to today historical.
		e.g. now is 11.00am, request 5 minutes chart, historical will return until 10.55am.
	*/
	/*
	if(parameter.indexOf(".SG") > 0){
		if(aParam.length>3) {
			if(aParam[1].length()>0 && aParam[2].length()>0) {
				if((aParam[2].equalsIgnoreCase("INTRADAY") || aParam[2].equalsIgnoreCase("DAILY")) && tradingDay) {
					if(aParam[2].equalsIgnoreCase("DAILY")) 
						aParam[3] = "0";
						
						urlIntraDay = urlIntraDay + aParam[1].trim() + ",Y," + aParam[3].trim();
						
						System.out.println("[INFO] ["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] [feed.jsp] Intraday URL : " + urlIntraDay);
						
						connection = new URL(urlIntraDay).openConnection();
						connection.setRequestProperty("Accept-Charset", charset);
						input = connection.getInputStream();

						br = new BufferedReader(new InputStreamReader(input));
						sbIntraDay = new StringBuilder();
					
						while ((line = br.readLine()) != null) {
							if(line.indexOf(",") > 0){
								aData = line.split(",");
								if(aData.length>5) {
									intra = "";
									for(int i=0; i<aData.length; i++) {
										if(i==0) {
											aData[0] = aData[0].trim();
											if(aData[0].length()>4) {
												aData[0] = "-" + aData[0].substring(0, 2) + "-" + aData[0].substring(2, 4);
												aData[0] = dtFormat.format(new Date()) + aData[0].trim();
												minDT = dtFormat.format(new Date());
											}
										}

										intra += aData[i] + ";";
										if(i==5) {
											intra += "0;";
										}
									}
								}
								vList.add(intra);
							}
						}			
						br.close();
						input.close();
				}
			}
		}

		for(int j=0; j<vList.size(); j++) {
			sbIntraDay.append(vList.get(j).toString() + "\n");
		}
		
		connection = new URL(urlHistorical+parameter).openConnection();
		connection.setRequestProperty("Accept-Charset", charset);
		input = connection.getInputStream();

		br = new BufferedReader(new InputStreamReader(input));
		sbHistorical = new StringBuilder();
		line = "";

		while ((line = br.readLine()) != null) {
			if(line.trim().length()>0) {
				if(!minDT.equals("")?line.indexOf(minDT) == -1:true){
					if(line.indexOf("---packet end---")>-1) {
						if(sbIntraDay!=null)
							sbHistorical.append(sbIntraDay.toString());
					}
					sbHistorical.append(line + "\n");
				}
			}
		}
	}else{
		if(aParam.length>3) {
			if(aParam[1].length()>0 && aParam[2].length()>0) {
				if(aParam[2].equalsIgnoreCase("INTRADAY") && tradingDay) {
					if(aParam[4].length()>0) {
						urlIntraDay = urlIntraDay + aParam[1].trim() + ",Y," + aParam[3].trim();

						System.out.println("[INFO] ["+new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date())+"] [feed.jsp] Intraday URL : " + urlIntraDay);
						connection = new URL(urlIntraDay).openConnection();
						connection.setRequestProperty("Accept-Charset", charset);
						input = connection.getInputStream();

						br = new BufferedReader(new InputStreamReader(input));
						sbIntraDay = new StringBuilder();
					
						while ((line = br.readLine()) != null) {
							if(line.indexOf(",") > 0){
								aData = line.split(",");
								if(aData.length>5) {
									intra = "";
									for(int i=0; i<aData.length; i++) {
										if(i==0) {
											aData[0] = aData[0].trim();
											if(aData[0].length()>4) {
												aData[0] = "-" + aData[0].substring(0, 2) + "-" + aData[0].substring(2, 4);
												aData[0] = dtFormat.format(new Date()) + aData[0].trim();
												minDT = aData[0];
											}
										}

										intra += aData[i] + ";";
										if(i==5) {
											intra += "0;";
										}
									}
								}
							}
						}
						
						intra = intra!=null?intra:"";
						if(!intra.equals(""))
							vList.add(intra);
						
						br.close();
						input.close();
					}
				} else if (aParam[2].equalsIgnoreCase("DAILY") && tradingDay) {
					if(aParam[3].length()>0) {
						urlIntraDay = urlIntraDay + aParam[1].trim() + ",Y,0";

						connection = new URL(urlIntraDay).openConnection();
						connection.setRequestProperty("Accept-Charset", charset);
						input = connection.getInputStream();

						br = new BufferedReader(new InputStreamReader(input));
						sbIntraDay = new StringBuilder();
					
						while ((line = br.readLine()) != null) {
							if(line.indexOf(",") > 0){
								aData = line.split(",");
								if(aData.length>5) {
									intra = "";
									for(int i=0; i<aData.length; i++) {
										if(i==0) {
											aData[0] = aData[0].trim();
											if(aData[0].length()>4) {
												aData[0] = "-" + aData[0].substring(0, 2) + "-" + aData[0].substring(2, 4);
												aData[0] = dtFormat.format(new Date()) + aData[0].trim();
												minDT = dtFormat.format(new Date());
											}
										}

										intra += aData[i] + ";";
										if(i==5) {
											intra += "0;";
										}
									}
								}
							}
						}
						
						intra = intra!=null?intra:"";
						if(!intra.equals(""))
							vList.add(intra);
							
						br.close();
						input.close();
					}
				}
			}
		}


		for(int j=0; j<vList.size(); j++) {
			sbIntraDay.append(vList.get(j).toString() + "\n");
		}

		//if(sbIntraDay!=null)
		//	out.println(sbIntraDay.toString());
*/				
		connection = new URL(urlHistorical+parameter).openConnection();
		connection.setRequestProperty("Accept-Charset", charset);
		input = connection.getInputStream();

		br = new BufferedReader(new InputStreamReader(input));
		sbHistorical = new StringBuilder();
		line = "";

		if(isHK)
			minDT = dtFormat.format(new Date());

		while ((line = br.readLine()) != null) {
			if(line.trim().length()>0) {
				if(!minDT.equals("")?line.indexOf(minDT) == -1:true){
					if(line.indexOf("---packet end---")>-1) {
						if(sbIntraDay!=null)
							sbHistorical.append(sbIntraDay.toString());
					}
					sbHistorical.append(line + "\n");
				}else if(!minDT.equals("")?line.indexOf(minDT) > -1:false){
					if(sbIntraDay!=null){
						sbHistorical.append(sbIntraDay.toString());
						sbIntraDay = null;
					}
				}
			}
		}
	//}
	
	br.close();
	input.close();
	out.clearBuffer();
	out.print(sbHistorical.toString());
	out.flush();
%>
