
<%@ page import = "java.sql.*, java.lang.*, java.util.*, java.text.SimpleDateFormat, com.n2n.util.N2NConst, java.net.MalformedURLException" %>
<%@ include file='common.jsp'%>
<jsp:useBean id="clibean" class="com.n2n.bean.N2NMFCliInfoBean" scope="page"/>
<jsp:setProperty name="clibean" property="*" />
<jsp:useBean id="cli" class="com.n2n.DB.N2NMFCliInfo" scope="page"/>
<jsp:setProperty name="clibean" property="*" />


<html>
<head>
	<META content="-1" http-equiv="Expires">
	<META content="no-cache" http-equiv="Pragma">
	<META content="no-cache" http-equiv="Cache-Control">	
	<link rel=stylesheet type=text/css href=<%=g_sStylePath%>/default.css>
	<title><%=oN2NSession.getSetting("WebSiteName")%> Registration Page</title>
	<script language=JavaScript src="<%=g_sJSPath%>/N2NCtrl.js"></script>
	<script language=JavaScript src="<%=g_sJSPath%>/email.js"></script>
</head>
<%
	//oN2NSession.N2NCheckMinSecLevel(request,response,2);
	String sLoginIdMinLength="", sPwdMinLength="", sPwdSecurityLvl="", sLoginIDDescText="", sPwdDescText="";
	String sAccPolicies = cli.getAccountPolicy(oN2NSession);
	String[] saAccPolicies;
	if(sAccPolicies.length()>3){
		saAccPolicies = sAccPolicies.split("\\|");
		//out.println("length="+saAccPolicies.length);
		if(saAccPolicies.length==4){
			sLoginIdMinLength = saAccPolicies[0];
			sPwdMinLength = saAccPolicies[1];
			sPwdSecurityLvl = saAccPolicies[3];
			sLoginIDDescText = "User ID should not be the same as Password and at least "+sLoginIdMinLength+" characters.";
			if(sPwdSecurityLvl.equals("1")){
				sPwdDescText = "Password must be at least "+sPwdMinLength+" characters.";
			}else if(sPwdSecurityLvl.equals("2")){
				sPwdDescText = "Password must be alphanumeric and at least "+sPwdMinLength+" characters.";
                        }else if(sPwdSecurityLvl.equals("3")){
				sPwdDescText = "Password must be alphanumeric with combination of upper-case, lower-case letters, numbers and at least "+sPwdMinLength+" characters";
                        }
		}
	}

	String clientType = request.getParameter("clientType").substring(0,1); //E=Existing, N=New
	clientType = clientType != null ? clientType : "";

	String category = request.getParameter("category").substring(0,1); //M=individual, C=Corporate, D=Dealer
	category = category != null ? category : "";
	
	String exchCodeList = request.getParameter("exchCodeList"); // E=equity, D=derivatives
	exchCodeList = exchCodeList != null ? exchCodeList : "";
	
	boolean bIndCli = false, bCorpCli = false, bDealer = false;
	boolean bNewCli = false, bExistCli = false;
	
	if (category.equals(N2NConst.CLI_CATEGORY_MEMBER)) {
		bIndCli = true;
	} else if (category.equals(N2NConst.CLI_CATEGORY_CORPORATE)) {
		bCorpCli = true;
	} else if(category.equals(N2NConst.CLI_CATEGORY_DEALER)) {
		bDealer = true;
	}
	
	if (clientType.equals(N2NConst.CLI_TYPE_NEW)) {
			bNewCli = true;
	} else if (clientType.equals(N2NConst.CLI_TYPE_EXISTING)) {
			bExistCli = true;
	} else {
			bIndCli   = false;
			bCorpCli  = false;
			bNewCli   = false;
			bExistCli = false;
			bDealer = false;
	}
	
	String sErrMsg = "";
	String sSuccMsg = "";
	String sClass = "";
	String [] saResult = new String[2];
	
	//System.out.println("LoginID: " + clibean.getLoginID());
	java.util.Date dtNow = new java.util.Date();

	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			
	if (clibean.getLoginID().trim().length() > 0) {
		System.out.println("HC: "+clibean.getClientType());	
		//start insert record to DB
		//usp_mfInsNewCli
		saResult = cli.insertNewCliWS(clibean, oN2NSession);
		
		if (saResult != null) {
			if (saResult[0].length() == 0) {
			
				sClass = "clsNoErrorMsg";
				
				sSuccMsg = "Thank you " + clibean.getTitleDesc() + " " + clibean.getCliName() + ". Your registration has been ";
				sSuccMsg += "submitted. In a few minutes, you will receive a validation email detailing ";
				sSuccMsg += "how you can validate your registration. Please follow the instructions within ";
				sSuccMsg += "3 days of receiving the email. If you do not validate your registration, you ";
				sSuccMsg += "will not be able to access to "+ oN2NSession.getSetting("WebSiteName")+".\\n\\nThe email will be sent to ";
				sSuccMsg += clibean.getEmail();
				
				out.print("<SCRIPT LANGUAGE='JavaScript'>");
				out.print("location.href='" + oN2NSession.getSetting("HTMLRoot") + request.getContextPath() );
				out.print("/msgRegSucc.jsp?clientType=" + clibean.getClientType() + "&category=" + clibean.getCategory());
				out.print("&name=" + clibean.getTitleDesc() + " " + clibean.getCliName() + "&email=" + clibean.getEmail() + "';");
				
				clibean.reset();
				out.println("</SCRIPT>");
				
			} else {
				sClass = "clsErrorMsg";
				sErrMsg = "Error: " + saResult[0];				
			}
		}
		
	} // End of if (clibean.getLoginID().trim().length() > 0)
%>

<body onload='Body_onLoad()' class='clsBody'>

<table border=0 cellPadding=0 cellSpacing=0 width='100%'>
<form id="frmUserReg" name="frmUserReg" action="cliAcctRegs.jsp?clientType=<%=clientType%>&category=<%=category%>&exchCodeList=<%=exchCodeList%>" method="post" onsubmit="javascript:return VerifyControl();">
	<tr>
		<td>
		<table border=0 cellPadding=0 cellSpacing=0>
			<tr height=20>
				<td width='80%' colspan=5 class=clsCliHeader>
				<table border=0 cellpadding=0 cellspacing=0 width='100%' height='100%'><%System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");	%>
<%	
	if (sErrMsg.length() > 0) {	
%>
					<tr>
						<td width='94%' class=<%=sClass%>>&nbsp;&nbsp;<%=sErrMsg%></td>
					</tr>
<%	
	}	
%>				
					<tr>
						<td width='100%' class=clsCliHeader>
						<%=bCorpCli?"Corporate":"Personal"%> Information
						</td>
					</tr>
				</table>
				</td>
			</tr>
			<tr><td colspan=5><img src='<%=g_sImgPath%>/empty.gif' height=3></td></tr>
	
			<%	if(bExistCli && bIndCli) {%>			
			<tr height=20>
				<td class=clsCliDtlLbl>
				Trading Account
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<INPUT class=clsCliDtlInput id=bhCliCode name=bhCliCode size=15 maxlength=9 style='WIDTH:150px;HEIGHT:20px' value='<%=clibean.getBhCliCode()%>'>
				</td>
			</tr>
			<% } %>

			<% if((bIndCli && bNewCli) || (bIndCli && bExistCli) || (bNewCli && bDealer)){ %>
			<tr height=20>
				<td width='25%' class=clsCliDtlLbl>
				Name (As per NRIC)
				</td>
				<td width='3%'>&nbsp;</td>
				<td width='72%' colspan=3>
					
					<select style="width:150px;height=50" onchange="javascript:title_OnChange()" id="title" name="title">
						<option value="EMPT">Select From List</option>
						<option value="Mr__">Mr.</option>
						<option value="Mrs_">Mrs.</option>
						<option value="Ms__">Ms.</option>
						<option value="Mdm_">Mdm.</option>
						<option value="DSri">Datuk Sri</option>
						<option value="DiSr">Datin Sri</option>
						<option value="Dtuk">Datuk</option>
						<option value="Dtin">Datin</option>
						<option value="TSri">Tan Sri</option>
						<option value="PSri">Puan Sri</option>
						<option value="Tun_">Tun</option>
						<option value="ThPn">Toh Puan</option>
						<option value="Dr._">Dr.</option>
						<option value="DATO">Dato'</option>
					</select>
					
					<INPUT class=clsCliDtlInput id=cliName name=cliName maxlength=50 size=50 style='width:247px;height:20px' value="<%=clibean.getCliName()%>" onkeyup="javascript:dodacheck(frmUserReg.cliName);">
				</td>
			</tr>
			
			<tr width='25%' id=tblPassport height=20 <%=clibean.getCitizenShip().compareToIgnoreCase("MY")!=0 ? "" : "style='display:none'"%>>
				<td class=clsCliDtlLbl>Identification Code</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3><INPUT class=clsCliDtlInput  id=passport name=passport size=15 maxlength=15 style="WIDTH:120px;HEIGHT:20px" value="<%=clibean.getPassport()%>"></td>
			</tr>
			<tr id=tblNRIC height=20 <%=clibean.getCitizenShip().compareToIgnoreCase("MY")==0 ? "" : "style='display:none'"%>>
				<td class=clsCliDtlLbl align=right>NRIC</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<input class=clsCliDtlInput id=icNo name=icNo maxLength=12  size=12 style="width:150px;height:20px" value="<%=clibean.getIcNo()%>">
					<font color=#ff0000> or Old (Optional)
						<input class=clsCliDtlInput id=oldIcNo  name=oldIcNo maxLength=9 size=9 style="width:93px;height:20px" value="<%=clibean.getOldIcNo()%>">
					</font>
				</td>
			</tr>
			
			<tr height=20>
				<td class=clsCliDtlLbl>
				Gender
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellpadding=0 cellspacing=0 width='100%'>
					<tr>
						<td width='23%'>
						<input class=clsCliDtlInput id=sex name=sex type=radio maxLength=1  size=1 value=M style="width:20px;height:20px ; valign=middle" <% if(clibean.getSex().equalsIgnoreCase("M")) out.println("CHECKED"); %>>Male
						<input class=clsCliDtlInput id=sex name=sex type=radio maxLength=1  size=1 value=F style="width:20px;height:20px; valign=middle" <% if(clibean.getSex().equalsIgnoreCase("F")) out.println("CHECKED"); %>>Female</td>
						<td class=clsCliDtlLbl colspan=3></td>
						
						<!--td class=clsCliDtlLbl width='11%'>Race</td>
						<td width='4%'>&nbsp;</td>
						<td width='62%'>
							<input class=clsCliDtlInput id=race name=race type=radio maxLength=1  size=1 value=M style="width:20px;height:20px ; valign=middle" <%// if(clibean.getRace().equalsIgnoreCase("B")) out.println("CHECKED"); %>>Bumiputra
							<input class=clsCliDtlInput id=race name=race type=radio maxLength=1  size=1 value=C style="width:20px;height:20px; valign=middle" <%// if(clibean.getRace().equalsIgnoreCase("C")) out.println("CHECKED"); %>>Chinese
							<input class=clsCliDtlInput id=race name=race type=radio maxLength=1  size=1 value=I style="width:20px;height:20px; valign=middle" <%// if(clibean.getRace().equalsIgnoreCase("I")) out.println("CHECKED"); %>>Indian						<input class=clsCliDtlInput id=race name=race type=radio maxLength=1  size=1 value=O style="width:20px;height:20px; valign=middle" <% if(clibean.getRace().equalsIgnoreCase("O")) out.println("CHECKED"); %>>Others
						</td-->
					</tr>
				</table>
				</td>
			</tr>
			

			<tr id=tblDOB height=20>
				<td class=clsCliDtlLbl>
				Date Of Birth
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<table border=0 cellpadding=0 cellspacing=0>
						<tr>
							<td align=left>
							<%
							String [] sdtTemp = null;
							String dt_year = "";
							
							String dt_words = clibean.getDob();
							
							if ((dt_words!=null)&&(dt_words.length()==10)) {
									sdtTemp = dt_words.split("-");
									dt_year = sdtTemp[0];
									if (dt_year.length()==4)
											dt_words = sdtTemp[2] + "-" + sdtTemp[1] + "-" + sdtTemp[0];
									else
											dt_words = clibean.getDob();
							} else {
									dt_words = clibean.getDob();
							}
							%>
							<html:N2N_HtmlObject type="dobCalendar" objectName="frmUserReg.dob" defaultValue="<%=dt_words%>"/>
							You must be at least 18 years old. The format is dd/mm/yyyy 
							</td>
						</tr>
					</table>
				</td>
			</tr>
			
			<tr height=20>
				<td class=clsCliDtlLbl>
				Email
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3><INPUT id=email name=email maxLength=40  size=40 style="width:200px;height:20px" value="<%=clibean.getEmail()%>">&nbsp; eg. abc@def.com.my</td>
			</tr>
			
			<tr id=tbladdr1 height=20>
				<td class=clsCliDtlLbl>
				Address
				</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3><INPUT id=add1 name=add1 maxLength=120 size=120 style="width:400px;" value="<%=clibean.getAdd1()%>"></td>
			</tr>
			<tr id=tbladdr2 height=20>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3><INPUT id=add2 name=add2 maxLength=120 size=120 style="width:400px;" value="<%=clibean.getAdd2()%>"></td>
			</tr>	

			<tr id=tblcity height=25>
				<td class=clsCliDtlLbl>Province</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellpadding=0 cellspacing=0 width='100%'>
					<tr>
						<td width='23%'>
							<select style="width:150px;height=20px" onchange="javascript:state_OnChange()" class="clsCliDtlInput" id="state" name="state">
								<option value="State1">Province</option>
								<option value="Abra">Abra</option>
								<option value="Agusan del Norte">Agusan del Norte</option>
								<option value="Agusan del Sur">Agusan del Sur</option>
								<option value="Aklan">Aklan</option>
								<option value="Albay">Albay</option>
								<option value="Antique">Antique</option>
								<option value="Bataan">Bataan</option>
								<option value="Batanes">Batanes</option>
								<option value="Batangas">Batangas</option>
								<option value="Benguet">Benguet</option>
								<option value="Bohol">Bohol</option>
								<option value="Bukidnon">Bukidnon</option>
								<option value="Bulacan">Bulacan</option>
								<option value="Cagayan Valley">Cagayan Valley</option>
								<option value="Camarines Norte">Camarines Norte</option>
								<option value="Camarines Sur">Camarines Sur</option>
								<option value="Camiguin">Camiguin</option>
								<option value="Capiz">Capiz</option>
								<option value="Catanduanes">Catanduanes</option>
								<option value="Cavite">Cavite</option>
								<option value="Cebu">Cebu</option>
								<option value="Davao Oriental">Davao Oriental</option>
								<option value="Davao del Norte">Davao del Norte</option>
								<option value="Davao del Sur">Davao del Sur</option>
								<option value="Davao">Davao</option>
								<option value="Ifugao">Ifugao</option>
								<option value="Ilocos Norte">Ilocos Norte</option>
								<option value="Ilocos Sur">Ilocos Sur</option>
								<option value="Iloilo">Iloilo</option>
								<option value="Isabela">Isabela</option>
								<option value="Kalinga-Apayao">Kalinga-Apayao</option>
								<option value="La Union">La Union</option>
								<option value="Laguna">Laguna</option>
								<option value="Lanao del Norte">Lanao del Norte</option>
								<option value="Lanao del Sur">Lanao del Sur</option>
								<option value="Leyte">Leyte</option>
								<option value="Maguindanao">Maguindanao</option>
								<option value="Marinduque">Marinduque</option>
								<option value="Masbate">Masbate</option>
								<option value="Metro Manila">Metro Manila</option>
								<option value="Mindoro Occidental">Mindoro Occidental</option>
								<option value="Mindoro Oriental">Mindoro Oriental</option>
								<option value="Misamis Occidental">Misamis Occidental</option>
								<option value="Misamis Oriental">Misamis Oriental</option>
								<option value="Mountain Province">Mountain Province</option>
								<option value="Negros Occidental">Negros Occidental</option>
								<option value="Negros Oriental">Negros Oriental</option>
								<option value="North Cotabato">North Cotabato</option>
								<option value="Nueva Ecija">Nueva Ecija</option>
								<option value="Nueva Vizcaya">Nueva Vizcaya</option>
								<option value="Palawan">Palawan</option>
								<option value="Pampanga">Pampanga</option>
								<option value="Pangasinan">Pangasinan</option>
								<option value="Quezon">Quezon</option>
								<option value="Quirino">Quirino</option>
								<option value="Rizal">Rizal</option>
								<option value="Sorsogon">Sorsogon</option>
								<option value="South Cotabato">South Cotabato</option>
								<option value="Sultan Kudarat">Sultan Kudarat</option>
								<option value="Surigao del Norte">Surigao del Norte</option>
								<option value="Surigao del Sur">Surigao del Sur</option>
								<option value="Tarlac">Tarlac</option>
								<option value="Western Samar">Western Samar</option>
								<option value="Zambales">Zambales</option>
								<option value="Zamboanga del Norte">Zamboanga del Norte</option>
								<option value="Zamboanga del Sur">Zamboanga del Sur</option>
								</select>
							<INPUT class=clsCliDtlInput id=otrState name=otrState maxlength=20 size=20 style="width:150px;height:20px;<%=clibean.getState().compareToIgnoreCase("OTR") != 0 ? "display:none" : ""%>" value='<%=clibean.getOtrState()%>'>
						
						<td class=clsCliDtlLbl colspan=3></td>
						<td class=clsCliDtlLbl width='11%'>Area Code</td>
						<td width='4%'>&nbsp;</td>
						<td width='62%'>
							<input class=clsCliDtlInput id=postcode name=postcode onkeypress="return NumberChk(event)" maxLength=6 size=9 style="width:86px;height:20px" value="<%=clibean.getPostcode()%>">
						</td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr id=tblCountry height=20>
				<td class=clsCliDtlLbl>
				Country
				</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<select style="HEIGHT:20px;WIDTH:400px" id="country" name="country">
						<option value=""></option>	<option value="AF">AFGHANISTAN</option>
						<option value="AL">ALBANIA</option>
						<option value="DZ">ALGERIA</option>
						<option value="AS">AMERICAN SAMOA</option>
						<option value="AD">ANDORRA</option>
						<option value="AO">ANGOLA</option>
						<option value="AI">ANGUILLA</option>
						<option value="AQ">ANTARCTICA</option>
						<option value="AG">ANTIGUA AND BARBUDA</option>
						<option value="AR">ARGENTINA</option>
						<option value="AM">ARMENIA</option>
						<option value="AW">ARUBA</option>
						<option value="AU">AUSTRALIA</option>
						<option value="AT">AUSTRIA</option>
						<option value="AZ">AZERBAIJAN</option>
						<option value="BS">BAHAMAS</option>
						<option value="BH">BAHRAIN</option>
						<option value="BD">BANGLADESH</option>
						<option value="BB">BARBADOS</option>
						<option value="BY">BELARUS</option>
						<option value="BE">BELGIUM</option>
						<option value="BZ">BELIZE</option>
						<option value="BJ">BENIN</option>
						<option value="BM">BERMUDA</option>
						<option value="BT">BHUTAN</option>
						<option value="BO">BOLIVIA</option>
						<option value="BA">BOSNIA AND HERZEGOWINA</option>
						<option value="BW">BOTSWANA</option>
						<option value="BV">BOUVET ISLAND</option>
						<option value="BR">BRAZIL</option>
						<option value="IO">BRITISH INDIAN OCEAN TERRITORY</option>
						<option value="BN">BRUNEI DARUSSALAM</option>
						<option value="BG">BULGARIA</option>
						<option value="BF">BURKINA FASO</option>
						<option value="BI">BURUNDI</option>
						<option value="KH">CAMBODIA</option>
						<option value="CM">CAMEROON</option>
						<option value="CA">CANADA</option>
						<option value="CV">CAPE VERDE</option>
						<option value="KY">CAYMAN ISLANDS</option>
						<option value="CF">CENTRAL AFRICAN REPUBLIC</option>
						<option value="TD">CHAD</option>
						<option value="CL">CHILE</option>
						<option value="CN">CHINA</option>
						<option value="CX">CHRISTMAS ISLAND</option>
						<option value="CC">COCOS (KEELING) ISLANDS</option>
						<option value="CO">COLOMBIA</option>
						<option value="KM">COMOROS</option>
						<option value="CG">CONGO</option>
						<option value="CK">COOK ISLANDS</option>
						<option value="CR">COSTA RICA</option>
						<option value="CI">COTE D'IVOIRE</option>
						<option value="HR">CROATIA (Hrvatska)</option>
						<option value="CU">CUBA</option>
						<option value="CY">CYPRUS</option>
						<option value="CZ">CZECH REPUBLIC</option>
						<option value="DK">DENMARK</option>
						<option value="DJ">DJIBOUTI</option>
						<option value="DM">DOMINICA</option>
						<option value="DO">DOMINICAN REPUBLIC</option>
						<option value="TP">EAST TIMOR</option>
						<option value="EC">ECUADOR</option>
						<option value="EG">EGYPT</option>
						<option value="SV">EL SALVADOR</option>
						<option value="GQ">EQUATORIAL GUINEA</option>
						<option value="ER">ERITREA</option>
						<option value="EE">ESTONIA</option>
						<option value="ET">ETHIOPIA</option>
						<option value="FK">FALKLAND ISLANDS (MALVINAS)</option>
						<option value="FO">FAROE ISLANDS</option>
						<option value="FJ">FIJI</option>
						<option value="FI">FINLAND</option>
						<option value="FR">FRANCE</option>
						<option value="FX">FRANCE, METROPOLITAN</option>
						<option value="GF">FRENCH GUIANA</option>
						<option value="PF">FRENCH POLYNESIA</option>
						<option value="TF">FRENCH SOUTHERN TERRITORIES</option>
						<option value="GA">GABON</option>
						<option value="GM">GAMBIA</option>
						<option value="GE">GEORGIA</option>
						<option value="DE">GERMANY</option>
						<option value="GH">GHANA</option>
						<option value="GI">GIBRALTAR</option>
						<option value="GR">GREECE</option>
						<option value="GL">GREENLAND</option>
						<option value="GD">GRENADA</option>
						<option value="GP">GUADELOUPE</option>
						<option value="GU">GUAM</option>
						<option value="GT">GUATEMALA</option>
						<option value="GN">GUINEA</option>
						<option value="GW">GUINEA-BISSAU</option>
						<option value="GY">GUYANA</option>
						<option value="HT">HAITI</option>
						<option value="HM">HEARD AND MC DONALD ISLANDS</option>
						<option value="HN">HONDURAS</option>
						<option value="HK">HONG KONG</option>
						<option value="HU">HUNGARY</option>
						<option value="IS">ICELAND</option>
						<option value="IN">INDIA</option>
						<option value="ID">INDONESIA</option>
						<option value="IR">IRAN (ISLAMIC REPUBLIC OF)</option>
						<option value="IQ">IRAQ</option>
						<option value="IE">IRELAND</option>
						<option value="IL">ISRAEL</option>
						<option value="IT">ITALY</option>
						<option value="JM">JAMAICA</option>
						<option value="JP">JAPAN</option>
						<option value="JO">JORDAN</option>
						<option value="KZ">KAZAKHSTAN</option>
						<option value="KE">KENYA</option>
						<option value="KI">KIRIBATI</option>
						<option value="KP">KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF</option>
						<option value="KR">KOREA, REPUBLIC OF</option>
						<option value="KW">KUWAIT</option>
						<option value="KG">KYRGYZSTAN</option>
						<option value="LA">LAO PEOPLE'S DEMOCRATIC REPUBLIC</option>
						<option value="LV">LATVIA</option>
						<option value="LB">LEBANON</option>
						<option value="LS">LESOTHO</option>
						<option value="LR">LIBERIA</option>
						<option value="LY">LIBYAN ARAB JAMAHIRIYA</option>
						<option value="LI">LIECHTENSTEIN</option>
						<option value="LT">LITHUANIA</option>
						<option value="LU">LUXEMBOURG</option>
						<option value="MO">MACAU</option>
						<option value="MK">MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF</option>
						<option value="MG">MADAGASCAR</option>
						<option value="MW">MALAWI</option>
						<option value="MY">MALAYSIA</option>
						<option value="MV">MALDIVES</option>
						<option value="ML">MALI</option>
						<option value="MT">MALTA</option>
						<option value="MH">MARSHALL ISLANDS</option>
						<option value="MQ">MARTINIQUE</option>
						<option value="MR">MAURITANIA</option>
						<option value="MU">MAURITIUS</option>
						<option value="YT">MAYOTTE</option>
						<option value="MX">MEXICO</option>
						<option value="FM">MICRONESIA, FEDERATED STATES OF</option>
						<option value="MD">MOLDOVA, REPUBLIC OF</option>
						<option value="MC">MONACO</option>
						<option value="MN">MONGOLIA</option>
						<option value="MS">MONTSERRAT</option>
						<option value="MA">MOROCCO</option>
						<option value="MZ">MOZAMBIQUE</option>
						<option value="MM">MYANMAR</option>
						<option value="NA">NAMIBIA</option>
						<option value="NR">NAURU</option>
						<option value="NP">NEPAL</option>
						<option value="NL">NETHERLANDS</option>
						<option value="AN">NETHERLANDS ANTILLES</option>
						<option value="NC">NEW CALEDONIA</option>
						<option value="NZ">NEW ZEALAND</option>
						<option value="NI">NICARAGUA</option>
						<option value="NE">NIGER</option>
						<option value="NG">NIGERIA</option>
						<option value="NU">NIUE</option>
						<option value="NF">NORFOLK ISLAND</option>
						<option value="MP">NORTHERN MARIANA ISLANDS</option>
						<option value="NO">NORWAY</option>
						<option value="OM">OMAN</option>
						<option value="PK">PAKISTAN</option>
						<option value="PW">PALAU</option>
						<option value="PA">PANAMA</option>
						<option value="PG">PAPUA NEW GUINEA</option>
						<option value="PY">PARAGUAY</option>
						<option value="PE">PERU</option>
						<option value="PH">PHILIPPINES</option>
						<option value="PN">PITCAIRN</option>
						<option value="PL">POLAND</option>
						<option value="PT">PORTUGAL</option>
						<option value="PR">PUERTO RICO</option>
						<option value="QA">QATAR</option>
						<option value="RE">REUNION</option>
						<option value="RO">ROMANIA</option>
						<option value="RU">RUSSIAN FEDERATION</option>
						<option value="RW">RWANDA</option>
						<option value="KN">SAINT KITTS AND NEVIS</option>
						<option value="LC">SAINT LUCIA</option>
						<option value="VC">SAINT VINCENT AND THE GRENADINES</option>
						<option value="WS">SAMOA</option>
						<option value="SM">SAN MARINO</option>
						<option value="ST">SAO TOME AND PRINCIPE</option>
						<option value="SA">SAUDI ARABIA</option>
						<option value="SN">SENEGAL</option>
						<option value="SC">SEYCHELLES</option>
						<option value="SL">SIERRA LEONE</option>
						<option value="SG">SINGAPORE</option>
						<option value="SK">SLOVAKIA (Slovak Republic)</option>
						<option value="SI">SLOVENIA</option>
						<option value="SB">SOLOMON ISLANDS</option>
						<option value="SO">SOMALIA</option>
						<option value="ZA">SOUTH AFRICA</option>
						<option value="GS">SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS</option>
						<option value="ES">SPAIN</option>
						<option value="LK">SRI LANKA</option>
						<option value="SH">ST. HELENA</option>
						<option value="PM">ST. PIERRE AND MIQUELON</option>
						<option value="SD">SUDAN</option>
						<option value="SR">SURINAME</option>
						<option value="SJ">SVALBARD AND JAN MAYEN ISLANDS</option>
						<option value="SZ">SWAZILAND</option>
						<option value="SE">SWEDEN</option>
						<option value="CH">SWITZERLAND</option>
						<option value="SY">SYRIAN ARAB REPUBLIC</option>
						<option value="TW">TAIWAN, PROVINCE OF CHINA</option>
						<option value="TJ">TAJIKISTAN</option>
						<option value="TZ">TANZANIA, UNITED REPUBLIC OF</option>
						<option value="TH">THAILAND</option>
						<option value="TG">TOGO</option>
						<option value="TK">TOKELAU</option>
						<option value="TO">TONGA</option>
						<option value="TT">TRINIDAD AND TOBAGO</option>
						<option value="TN">TUNISIA</option>
						<option value="TR">TURKEY</option>
						<option value="TM">TURKMENISTAN</option>
						<option value="TC">TURKS AND CAICOS ISLANDS</option>
						<option value="TV">TUVALU</option>
						<option value="UG">UGANDA</option>
						<option value="UA">UKRAINE</option>
						<option value="AE">UNITED ARAB EMIRATES</option>
						<option value="GB">UNITED KINGDOM</option>
						<option value="US">UNITED STATES</option>
						<option value="UM">UNITED STATES MINOR OUTLYING ISLANDS</option>
						<option value="UY">URUGUAY</option>
						<option value="UZ">UZBEKISTAN</option>
						<option value="VU">VANUATU</option>
						<option value="VA">VATICAN CITY STATE (HOLY SEE)</option>
						<option value="VE">VENEZUELA</option>
						<option value="VN">VIET NAM</option>
						<option value="VG">VIRGIN ISLANDS (BRITISH)</option>
						<option value="VI">VIRGIN ISLANDS (U.S.)</option>
						<option value="WF">WALLIS AND FUTUNA ISLANDS</option>
						<option value="EH">WESTERN SAHARA</option>
						<option value="YE">YEMEN</option>
						<option value="YU">YUGOSLAVIA</option>
						<option value="ZR">ZAIRE</option>
						<option value="ZM">ZAMBIA</option>
						<option value="ZW">ZIMBABWE</option>
					</select>
					
				</td>
			</tr>
			
			<tr height=20>
				<td class=clsCliDtlLbl>Tel No</td>
				<td>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellpadding=0 cellspacing=0 width='100%'>
					<tr>
						<td width='23%'>
						<input class=clsCliDtlInput id=telno1 name=telno1 onkeypress="return NumberChk(event)" maxlength=4 style="width:40px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getTelno1()%>">&nbsp;- 
						<input class=clsCliDtlInput id=telno  name=telno  onkeypress="return NumberChk(event)" maxlength=8 style="width:70px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getTelno()%>">
						<td class=clsCliDtlLbl colspan=3></td>
						
						<td class=clsCliDtlLbl width='15%'>Mobile No</td>
						<td width='4%'>&nbsp;</td>
						<td width='62%'> 
							<input class=clsCliDtlInput id=mobile1 name=mobile1 onkeypress="return NumberChk(event)" maxlength=4 style="width:40px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getMobile1()%>">&nbsp;- 
							<input class=clsCliDtlInput id=mobile name=mobile onkeypress="return NumberChk(event)" maxlength=8 style="width:70px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getMobile()%>">
						</td>
					</tr>
				</table>
				</td>
			</tr>

			
			<% } else if(bCorpCli) { /*if is corporate client(new or existing)*/%>
			<%@ include file='cliCorpAcctReg.jsp'%>
			<% } %>
<!-- Login Information -->

			<tr height=20>
				<td colspan=5 class=clsCliHeader>
				<table border=0 cellpadding=0 cellspacing=0 width='100%' height='100%'>
					<tr>
						<td width='100%' class=clsCliHeader>
						Login Information
						</td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr height=30>
				<td class=clsCliDtlLbl>
				Username
				</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellspacing=0 cellpadding=0>
					<tr>
						<td style="width:170px"><INPUT class=clsCliDtlInput id=loginID name=loginID maxLength=15  size=15 style="width:150px;height:20px" onkeyup="javascript:dodacheckAll(frmUserReg.loginID);" value="<%=clibean.getLoginID()%>"></td>
						<td><%=sLoginIDDescText%></td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr height=30>
				<td class=clsCliDtlLbl>Password</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellspacing=0 cellpadding=0>
					<tr>
						<td style="width:170px">
							<INPUT class=clsCliDtlInput type=password id=pwd name=pwd maxLength=15 size=12 style="width:150px;height:20px">
						</td>
						<td><%=sPwdDescText%></td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr height=20>
				<td class=clsCliDtlLbl>Re-type Password</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<INPUT class=clsCliDtlInput type=password id=txtConfirmed name=txtConfirmed maxLength=12  size=12 style="width:150px;height:20px">
				</td>
			</tr>
			
			<tr height=20>
				<%	if(bIndCli) {%>
				<td class=clsCliDtlLbl>Trading PIN</td>
				<% } else {%>
					<td class=clsCliDtlLbl>PIN</td>
				<%}%>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellspacing=0 cellpadding=0>
					<tr>
						<td style="width:170px">
							<INPUT class=clsCliDtlInput type=password id=pin name=pin onkeypress="return NumberChk(event)" maxLength=6 size=12 style="width:150px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)">
						</td>						
						<td>PIN is a 6 digit number. eg. 883388 </td>
					</tr>
				</table>
				</td>
			</tr>
			
			<tr height=20>
				<%	if(bIndCli) {%>
				<td class=clsCliDtlLbl>Re-type Trading PIN</td>
				<% } else {%>
					<td class=clsCliDtlLbl>Re-type PIN</td>
				<%}%>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
					<INPUT type=password id=txtConPIN name=txtConPIN onkeypress="return NumberChk(event)" maxLength=6 size=12 style="width:150px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)">
				</td>
			</tr>
			
			<tr height=25>
				<td class=clsCliDtlLbl>
				Hint for Forgotten Password/PIN
				</td>
				<td class=clsCliDtlLbl>&nbsp;</td>
				<td class=clsCliDtlInput colspan=3>
				
				<select name=hintType id=selCliRegHint style='width:150px' OnChange='selCliRegHint_OnClick()'>
						<option value='OTR' <%=(clibean.getHintType().compareToIgnoreCase("OTR")==0 || clibean.getHintType().equalsIgnoreCase("")) ? "selected" : ""%>>My own question</option>
						<option value='Mother maiden name' <%=clibean.getHintType().compareToIgnoreCase("Mother maiden name") == 0 ? "selected" : ""%>>
							Mother maiden name</option>
						<option value='My favourite cartoon' <%=clibean.getHintType().compareToIgnoreCase("My favourite cartoon") == 0 ? "selected" : ""%>>
							My favourite cartoon</option>
						<option value='My favourite car' <%=clibean.getHintType().compareToIgnoreCase("My favourite car") == 0 ? "selected" : ""%>>
							My favourite car</option>
						<option value='Name of my pet' <%=clibean.getHintType().compareToIgnoreCase("Name of my pet") == 0 ? "selected" : ""%>>
							Name of my pet</option>
				</select>
				
				<INPUT class=clsCliDtlInput id=hint name=hint maxLength=50  size=50 style="width:200px;height:20px" value='<%=clibean.getHint()%>' <%=(clibean.getHintType().equalsIgnoreCase("OTR") || clibean.getHintType().equalsIgnoreCase("")) ? "" : "style='display:none'"%>></td>
			</tr>
			
			<tr height=30 valign=top>
				<td class=clsCliDtlLbl>Answer to your hint</td>
				<td class=clsCliDtlLbl>&nbsp;
					
					<input type='hidden' name='titleDesc'  id='titleDesc'  value= '<%=clibean.getTitleDesc()%>'>
					<input type='hidden' name='status'     id='status'     value= 'S'>
					<input type='hidden' name='defPrtf'    id='defPrtf'    value= '1'>
					<input type='hidden' name='nomineeCli' id='nomineeCli' value= 'N'>
					<input type='hidden' name='defBhCode'  id='defBhCode'  value= '<%=oN2NSession.getSetting("BHCode")%>'>					
					<input type='hidden' name='category'   id='category'   value= '<%=category%>'>
					<input type='hidden' name='clientType' id='clientType' value= '<%=clientType%>'>
					<input type='hidden' name='exchCodeList' id='exchCodeList' value= '<%=exchCodeList%>'>
					
				</td>
				<td class=clsCliDtlInput colspan=3>
				<table border=0 cellPadding=0 cellSpacing=0 width="100%">
					<tr>
						<td width=60% class=clsCliDtlInput>
						<input class=clsCliDtlInput id=hintAns name=hintAns maxLength=20 size=20 style="width:150px;height:20px" value='<%=clibean.getHintAns()%>'>
						</td>
						<td width=20% class=clsCliDtlLbl align=right>
						<input type=submit name=btnSubmit style="width:80px; CURSOR: hand" title="Submit for registration" value=Submit>
						</td>
			</form>
						<td width=20% class=clsCliDtlLbl>
						<input type=button name=btnClose onclick='window.close();' style="width:80px; CURSOR: hand" title="Close" value=Close>
						</td>
						
					</tr>
				</table>
				</td>
			</tr>
			
			<tr class=clsCliHeader><td width='100%' class=clsCliDtlInput colspan=5><img width=4 height=4 src='<%=g_sImgPath%>/empty.gif'></td></tr>
		</table>
		</td>
	</tr>
	
	<tr><td>&nbsp;</td></tr>
</table>

</body>
</html>

<script language="JavaScript">
var m_nSubmitCount = new Number(0);
function Body_onLoad() {
	
	frm = document.frmUserReg;

	//if (document.frmUserReg.defBhBranch[0].value == "") {
	//	document.frmUserReg.defBhBranch[0].text = "Select From List";
	//}

	<% if(bIndCli || (bNewCli && bExistCli)){ 
	/*if is individual client(new or existing) or new remisier or existing AmSec client*/%>
	if (document.frmUserReg.title[0].value == "") {
		document.frmUserReg.title[0] = null;
		//document.frmUserReg.title.selectedIndex = 0;
	}
	
	if (document.frmUserReg.title.selectedIndex == -1) {
		document.frmUserReg.title.selectedIndex = 0;
	}
	
	//for (i = 0; i < document.frmUserReg.title.length; i++) {
	//	document.frmUserReg.title[i].text = document.frmUserReg.title[i].text.replace(".", "");
	//}
	<% } %>
	
	
	<% if(bIndCli || bDealer) { %>
	//Nationality
	/*if (document.frmUserReg.citizenShip.selectedIndex == 0) {
		document.frmUserReg.citizenShip.value = "MY";
		citizenShip_OnChange();
	}*/
	<%}%>
	
	//State
	/*if (document.frmUserReg.state.selectedIndex == 0) {
		document.frmUserReg.state.value = "WPS";
		state_OnChange();
	}*/
	
	//Country
	if (document.frmUserReg.country.selectedIndex == 0) {
		document.frmUserReg.country.value = "PH";
	}
	
	<% if(bCorpCli) { %>
		//DOB
		if(document.frmUserReg.dob.value != ""){
			var dob = document.frmUserReg.dob.value; // yyyy-MM-dd
			dob = dob.substring(8,10) + "-" + dob.substring(5,7) + "-" +  dob.substring(0,4);
			document.frmUserReg.dob.value = dob;
		} 
		
	<%}%>
	
	// DOB
	var dToday = new Date();
	var w = self.gfPop;
	
	if (w!=null) {
			w.gEnd = [dToday.getFullYear(), dToday.getMonth()+1, dToday.getDate()];
	}

<%	
	if (clibean.getLoginID().trim().length() > 0) {
			if (saResult != null) {
					if (saResult[0].length() == 0) { 
%>
				alert('<%=sSuccMsg%>');
				
				if(opener && !opener.closed)
					opener.location.href='main.jsp';
				else
					window.open('main.jsp', 'winMain', 'top=0,left=0,width=' + screen.width + ',height=' + screen.height + ',location=yes,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,status=yes');
					
				window.close();
<%				
					clibean.reset();
					}
			}
	} 
%>

}

function state_OnChange() {
	//document.frmUserReg.otrState.value = document.frmUserReg.state.value;

	if (document.frmUserReg.state.value =="OTR") {
		document.frmUserReg.otrState.value="";
		document.frmUserReg.otrState.style.display = "";
	} else
		document.frmUserReg.otrState.style.display = "none";			
}

function VerifyControl() {
	
	var bGoNext=true;
	var sControl = null;
	
	frm = document.frmUserReg;
	<%	if(bExistCli) {  %>
	//Check Trading Acct (bhCliCode) --------------------------------------------
	var sBHCliCode = frm.bhCliCode.value;
	if (sBHCliCode.length <= 0) {
			if (sControl == null) sControl = frm.bhCliCode;
			setInValidColor(frm.bhCliCode);
			bGoNext = false;
	} else {
			setValidColor(frm.bhCliCode);
	}
	<%}%>
	//Check Referred By (refBy) ------------------------------------------------
	/*if (frm.refBy.value == '') {
			if (sControl == null) sControl = frm.refBy;
			setInValidColor(frm.refBy);
			bGoNext = false;
	} else {
			setValidColor(frm.refBy);
	}*/
	
	/*if(frm.refBy.value == 'C'){
		if (frm.refByUid.value == '') {
			if (sControl == null) sControl = frm.refByUid;
			setInValidColor(frm.refByUid);
			bGoNext = false;
		} else {
				setValidColor(frm.refByUid);
		}
	}*/
	
	//Check Preferred Broking Branch (defBhBranch) ------------------------------------------------
	//if (frm.defBhBranch.value == '') {
	//		if (sControl == null) sControl = frm.defBhBranch;
	//		setInValidColor(frm.defBhBranch);
	//		bGoNext = false;
	//} else {
	//		setValidColor(frm.defBhBranch);
	//}

	<%	if(bIndCli) {  %>
	//Check Designation (title) -------------------------------------------------
	if (frm.title.value == "EMPT") {
         if (sControl == null) sControl = frm.title;
			setInValidColor(frm.title);
			bGoNext = false;
	} else {
			setValidColor(frm.title);
	}
	<% } %>
	
	//Check name (cliName) ------------------------------------------------------
	var sCliName = frm.cliName.value;
	sCliName = sCliName.split("'");
	sCliName = sCliName.join("`");
	
	if ((sCliName.length <= 0)||!CheckWierdChar(sCliName)) {
			if (sControl == null) sControl = frm.cliName;
			setInValidColor(frm.cliName);
			bGoNext = false;
	} else {
			setValidColor(frm.cliName);
	}
	
	<%	if(bCorpCli) {  %>
	//Check oldIcNo
	if ((document.frmUserReg.oldIcNo.value.length <=0)||!CheckWierdChar(document.frmUserReg.oldIcNo.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.oldIcNo;
		setInValidColor(document.frmUserReg.oldIcNo);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.oldIcNo);
	<% } %>
		

	<%	if(bIndCli || bDealer) {  %>
	//Check Nationality (citizenShip) -------------------------------------------
	/*if ((frm.citizenShip.value.length <=0)||!CheckWierdChar(frm.citizenShip.value)) {
			if (sControl == null) sControl = frm.citizenShip;
			setInValidColor(frm.citizenShip);
			bGoNext = false;
	} else {
			setValidColor(frm.citizenShip);
	}

	if(frm.citizenShip.value == "MY"){
		//Check NRIC/Passport (icno) --------------------------------------------
		if ((frm.icNo.value.length < 4)) {
				if (sControl == null) sControl = frm.icNo;
				setInValidColor(frm.icNo);
				bGoNext = false;
		} else {
				setValidColor(frm.icNo);
		}		
	} else {*/
		//Check NRIC/Passport (passport) --------------------------------------------
		if ((frm.passport.value.length < 4)||!CheckWierdChar(frm.passport.value)) {
				if (sControl == null) sControl = frm.passport;
				setInValidColor(frm.passport);
				bGoNext = false;
		} else {
				setValidColor(frm.passport);
		}
	//}

	//Check gender (sex) --------------------------------------------------------
	if ((!frm.sex[0].checked) && (!frm.sex[1].checked)) {
			if (sControl == null) sControl = frm.sex[0];
			setInValidColor(frm.sex[0]);
			bGoNext = false;
	} else {
			setValidColor(frm.sex[0]);
	}

	//Check race (race) ---------------------------------------------------------
	/*if ((!document.frmUserReg.race[0].checked)  && (!document.frmUserReg.race[1].checked) &&
		(!document.frmUserReg.race[2].checked)  && (!document.frmUserReg.race[3].checked)) {
		if (sControl == null)
			//alert(sControl)
			sControl = document.frmUserReg.race[0];
		setInValidColor(document.frmUserReg.race[0]);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.race[0]);
	*/
	<% } %>

	//Check date of birth (dob) -------------------------------------------------
	if (frm.dob.value.length <= 0) {
			if (sControl == null) sControl = frm.dob;
			setInValidColor(frm.dob);
			bGoNext = false;
	} else {
			setValidColor(frm.dob);
	}

	//Check Address 1 (add1) ----------------------------------------------------
   var sAddr1 = frm.add1.value;
	sAddr1 = sAddr1.split("'");
	sAddr1 = sAddr1.join("`");
	if ((frm.add1.value.length <= 0)||!CheckWierdChar(sAddr1)) {
			if (sControl == null) sControl = frm.add1;
			setInValidColor(frm.add1);
			bGoNext = false;
	} else {
			setValidColor(frm.add1);
	}
	//Check Address 2 (add2) ----------------------------------------------------
   var sAddr2 = frm.add2.value;
	sAddr2 = sAddr2.split("'");
	sAddr2 = sAddr2.join("`");
	if (!CheckWierdChar(sAddr2)) {
			if (sControl == null) sControl = frm.add2;
			setInValidColor(frm.add2);
			bGoNext = false;
	} else {
			setValidColor(frm.add2);
	}

	//Check Country (country) ---------------------------------------------------
	if ((frm.country.value.length <=0)||!CheckWierdChar(frm.country.value)) {
			if (sControl == null) sControl = frm.country;
			setInValidColor(frm.country);
			bGoNext = false;
	} else {
			setValidColor(frm.country);
	}

	//Check PostCode (postcode) -------------------------------------------------
	if ((frm.postcode.value.length <=0) || !CheckWierdChar(frm.postcode.value)) {
			if (sControl == null) sControl = frm.postcode;
			setInValidColor(frm.postcode);
			bGoNext = false;
	} else {
			setValidColor(frm.postcode);
	}

	//check e-Mail (email) ------------------------------------------------------
	if (!checkEMail(frm.email.value)||(frm.email.value.indexOf(" ")!=-1)||!CheckWierdChar(frm.email.value) || !validateEmail(frm.email.value,true,true)) {
			if (sControl == null) sControl = frm.email;
			setInValidColor(frm.email);
			bGoNext = false;
	} else {
			setValidColor(frm.email);
	}

	//check phone
	if ((document.frmUserReg.telno1.value.length < 2) || isNaN(document.frmUserReg.telno1.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.telno1;
		setInValidColor(document.frmUserReg.telno1);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.telno1);

	if ((document.frmUserReg.telno.value.length < 6) || isNaN(document.frmUserReg.telno.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.telno;
		setInValidColor(document.frmUserReg.telno);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.telno);

	//check Office phone (faxNo1, faxNo) ----------------------------------------
	/*bFaxPhone_Prefix = true;
	bFaxPhone_Postfix = false;
	
	if ( ((frm.faxNo1.value.length>0)||(frm.faxNo.value.length>0)) && 
			 ( frm.faxNo.value.length < 6) || 
			isNaN(frm.faxNo.value)) {
			if (sControl == null) sControl = frm.faxNo;
			setInValidColor(frm.faxNo);
			bGoNext = false;
	} else {
			setValidColor(frm.faxNo);
			if (frm.faxNo.value.length>0) bFaxPhone_Postfix = true;
	}*/
	
	<% if(bCorpCli){ %>
	//check Office phone
	if ((document.frmUserReg.faxNo1.value.length < 2) || isNaN(document.frmUserReg.faxNo1.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.faxNo1;
		setInValidColor(document.frmUserReg.faxNo1);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.faxNo1);

	if ((document.frmUserReg.faxNo.value.length < 6) || isNaN(document.frmUserReg.faxNo.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.faxNo;
		setInValidColor(document.frmUserReg.faxNo);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.faxNo);
		
	//Check Person Authorised To Trade(displayName) -------------------------------------------------
	if ((frm.displayName.value.length <=0) || !CheckWierdChar(frm.displayName.value)) {
			if (sControl == null) sControl = frm.displayName;
			setInValidColor(frm.displayName);
			bGoNext = false;
	} else {
			setValidColor(frm.displayName);
	}
	
	//Check NRIC (icNo) --------------------------------------------
	if ((frm.icNo.value.length < 4)||!CheckWierdChar(frm.icNo.value)) {
		if (sControl == null) sControl = frm.icNo;
		setInValidColor(frm.icNo);
		bGoNext = false;
	} else {
		setValidColor(frm.icNo);
	}
		
	<%} %>

	<% 	if(bIndCli){ %>
	//check mobile phone
	if ((document.frmUserReg.mobile1.value.length < 2) || isNaN(document.frmUserReg.mobile1.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.mobile1;
		setInValidColor(document.frmUserReg.mobile1);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.mobile1);

	if ((document.frmUserReg.mobile.value.length < 6) || isNaN(document.frmUserReg.mobile.value)) {
		if (sControl == null)
			sControl = document.frmUserReg.mobile;
		setInValidColor(document.frmUserReg.mobile);
		bGoNext = false;
	}
	else
		setValidColor(document.frmUserReg.mobile);

	<% } %>
	//---------------------------------------------------------------------------

	// ------------------
	// Login Information
	// ------------------
	
	//check userid (loginID) ----------------------------------------------------
	if (frm.loginID.value.length == 0|| (frm.loginID.value.indexOf(" ")!=-1) || !CheckWierdCharATP(frm.loginID.value)) {
			if (sControl == null)
					sControl = frm.loginID;
					setInValidColor(frm.loginID);
					bGoNext = false;
	} else {
			setValidColor(frm.loginID);
	}
	
	var bPassword=false;
	var strPassword;
	var bGotNumeric=false;
	var bGotAlphaNumeric=false;
	var bValidPassword = false;
	var bValidPin = false;
	var cChkPass;
	
	//Valid password ------------------------------------------------------------
	strPassword = frm.pwd.value; 
	
	for (var i=0; i <= strPassword.length-1; i++) {
		
			cChkPass = strPassword.charAt(i);
		
			if ((cChkPass >= "0") && (cChkPass <= "9"))
					bGotNumeric = true;
			else
					bGotAlphaNumeric = true;

			if (bGotNumeric && bGotAlphaNumeric)
					bPassword = true;
	}

	if (!bPassword || !CheckWierdCharATP(frm.txtConfirmed.value) || (frm.txtConfirmed.value.indexOf(" ")!=-1) || (frm.pwd.value.indexOf(" ")!=-1)) {
			if (sControl == null) sControl = frm.pwd;
			setInValidColor(frm.txtConfirmed);
			setInValidColor(frm.pwd);
			bValidPassword = false;
			bGoNext = false;
	} else {
			setValidColor(frm.txtConfirmed);
			setValidColor(frm.pwd);
			bValidPassword = true;
	}

	//compare password against confirmed password
	if (bValidPassword) {
			if ((frm.txtConfirmed.value.length == 0) || (frm.pwd.value != frm.txtConfirmed.value) || 
					(frm.pwd.value == frm.loginID.value)) {
					if (sControl == null) sControl = frm.pwd;
					setInValidColor(frm.pwd);
					setInValidColor(frm.txtConfirmed);
					bValidPassword = false;
					bGoNext = false;
			} else {
					setValidColor(frm.pwd);
					setValidColor(frm.txtConfirmed);
					bValidPassword = true;
			}
	}

	//check password (pwd)
	if (bValidPassword) {
			if (frm.pwd.value.length == 0) {
					if (sControl == null) sControl = frm.pwd;
					setInValidColor(frm.pwd);
					bValidPassword = false;
					bGoNext = false;
			} else {
					setValidColor(frm.pwd);
					bValidPassword = true;
			}
	}

	//check confirmed
	if (bValidPassword) {
			if (frm.txtConfirmed.value.length == 0) {
					if (sControl == null) sControl = frm.txtConfirmed;
					setInValidColor(frm.txtConfirmed);
					bGoNext = false;
			} else {
					setValidColor(frm.txtConfirmed);
			}
	}		

	//check PIN (pin) -----------------------------------------------------------
	if (frm.txtConPIN.value.length != 6 || isNaN(frm.txtConPIN.value)) {
			if (sControl == null) sControl = frm.txtConPIN;
			setInValidColor(frm.txtConPIN);
			bGoNext = false;
	}else{
			setValidColor(frm.txtConPIN);
			bValidPin = true;
	}

	if (frm.pin.value.length != 6 || isNaN(frm.pin.value)) {
			if (sControl == null) sControl = frm.pin;
			setInValidColor(frm.pin);
			bGoNext = false;
	}else{
			setValidColor(frm.pin);
			bValidPin = true;
	}

	if (bValidPin) {
			if (frm.pin.value != frm.txtConPIN.value) {
					if (sControl == null) sControl = frm.pin;
					setInValidColor(frm.pin);
					setInValidColor(frm.txtConPIN);
					bGoNext = false;
			} else {
					setValidColor(frm.pin);
					setValidColor(frm.txtConPIN);
			}
	}

	//Check for hint (hint) -----------------------------------------------------
	if ((frm.hint.value.length == 0)|| !CheckWierdCharATP(frm.hint.value)) {
			if (sControl == null) sControl = frm.hint;
			setInValidColor(frm.hint);
			bGoNext = false;
	} else {
			setValidColor(frm.hint);
	}

	//check for answer to hint (hintAns) ----------------------------------------
	if ((frm.hintAns.value.length == 0)|| !CheckWierdCharATP(frm.hintAns.value)) {
			if (sControl == null) sControl = frm.hintAns;
			setInValidColor(frm.hintAns);
			bGoNext = false;
	} else {
			setValidColor(frm.hintAns);
	}

	if (!bGoNext) {
			alert("Please complete the highlighted field(s) correctly.");
			if (!sControl.disabled) sControl.focus();
			return false;
	} else {
		if (m_nSubmitCount ==0) {
			m_nSubmitCount++;
			frm.dob.value = formatDateToODBC(1,frm.dob.value); //dd-mm-yyyy
			return true;
		} else {
			alert("Your request has been submitted. Please wait...");
			return false;
		}	
	}
}

function title_OnChange() {
	document.frmUserReg.titleDesc.value = document.frmUserReg.title[document.frmUserReg.title.selectedIndex].text;
	document.frmUserReg.titleDesc.value = document.frmUserReg.titleDesc.value.replace(".", "");
}

/*function citizenShip_OnChange() {
	frm = document.frmUserReg;
	if (frm.citizenShip.value != "SG")
			document.all.tbl_tr_PResident.style.display = "";
	else {
			document.all.tbl_tr_PResident.style.display = "none";
			document.frmUserReg.PResident[0].checked = false;
			document.frmUserReg.PResident[1].checked = false;
	}
}

function citizenShip_OnChange() {
	var sNationality;
	sNationality = document.frmUserReg.citizenShip.value;	
	if (sNationality.toUpperCase() == "MY") {
		document.all.tblPassport.style.display = "None";
		document.all.tblNRIC.style.display = "";
	} else {
		document.all.tblPassport.style.display = "";
		document.all.tblNRIC.style.display = "None";
	}
}*/

function country_OnChange() {
}

function selCliRegHint_OnClick() {

	document.frmUserReg.hint.value =document.frmUserReg.selCliRegHint.value;
	
	if (document.frmUserReg.selCliRegHint.value == "OTR") {
			document.frmUserReg.hint.value="";
			document.frmUserReg.hint.style.display = "";
	} else {
			document.frmUserReg.hint.style.display = "none";			
	}
}

function setInValidColor(ValidatedControl) {
	ValidatedControl.style.backgroundColor = "#ee8b86";
}

function setValidColor(ValidatedControl) {
	ValidatedControl.style.backgroundColor = "white";
}

function CheckWierdChar(string1) {
	
	if ((string1.indexOf("|")!=-1) || (string1.indexOf("'")!=-1) || (string1.indexOf("\"")!=-1))
			return false;
	else
			return true;
}

function CheckWierdCharATP(string1) {

	if ((string1.indexOf("|")!=-1) || (string1.indexOf("'")!=-1) || (string1.indexOf("\"")!=-1) || (string1.indexOf("&")!=-1))
			return false;
	else
			return true;
}

function CheckWierdCharCtrl(keypress) {
	// |, ', "
	if ((keypress == 124) || (keypress == 39) || (keypress == 34)) {
			return 0;	
	} else {
			return keypress;
	}
}

function checkEMail(inEmail) {

	var locAt;
	var locPeriod;
	var okEmail;

	locAt = inEmail.indexOf("@");
	okEmail = ((locAt != -1) &&  (locAt != 0) && (locAt != (inEmail.length - 1))&& (inEmail.indexOf("@", locAt + 1) == -1));
	
	if (okEmail) {
			locPeriod = inEmail.indexOf(".");
			okEmail = ((locPeriod != -1) && (locPeriod != (inEmail.length - 1)));
	}
	
	return okEmail;
}

function EmailCtrl(keypress) {
	
	//between '0' - '9', 'A' - 'Z', 'a'-'z', '.', '@', '_'
	if ((keypress >= 48 && keypress <= 57)  ||
			(keypress >= 65 && keypress <= 90)  || 
			(keypress >= 97 && keypress <= 122) ||
			(keypress == 46) || 
			(keypress == 64) || 
			(keypress == 95)
		) {
		return keypress;
	}
	
	return 0;
}

function UserIDCtrl(keypress)
{	
	//alert(keypress);
	
	//between '0' - '9', 'A' - 'Z', 'a'-'z',  '_'
	if ((keypress >= 48 && keypress <= 57)  || 
			(keypress >= 65 && keypress <= 90)  || 
			(keypress >= 97 && keypress <= 122) || 
			//(keypress == 45) || 
			//(keypress == 46) || 
			//(keypress == 47) || 
			//(keypress == 64) || 
			(keypress == 95)
			
		) {
		return true;
	} else {
		alert("This character is not allowed.");	
		return false;
	}
}

function NumberChk(evt) {
    evt = (evt) ? evt : window.event
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        status = "This field accepts numbers only."
        return false
    }
    status = ""
    return true
}

var mikExp = /[$\\\#%\^\&\*\(\)\[\]\+\_\{\}\`\~\=\|\'\"]/;
function dodacheck(val) {
	var strPass = val.value;
	var strLength = strPass.length;
	var lchar = val.value.charAt((strLength) - 1);
	if(lchar.search(mikExp) != -1) {
		var tst = val.value.substring(0, (strLength) - 1);
		val.value = tst;
	}
}


function dodacheckAll(val) {
	var mikExp = /[$\\\#%\^\&\*\(\)\[\]\+\{\}\`\~\=\|\~\!\@\-\:\;\"\'\<\>\,\.\?\/]/;

	var strPass = val.value;
	var strLength = strPass.length;
	var lchar = val.value.charAt((strLength) - 1);
	if(lchar.search(mikExp) != -1) {
	var tst = val.value.substring(0, (strLength) - 1);
	val.value = tst;
	   }
	}

/*var sRefByPrev='';

function selRefBy_OnChange() {
		
		var sRefBy = document.frmUserReg.refBy.value;
		
		if (sRefBy == 'C') {
			document.all.spanRefByBH.style.display = "";
		} else if (sRefBy == 'B') {
			document.all.spanRefByBank.style.display = "";
		}

		if (sRefByPrev == 'C') {
			document.all.spanRefByBH.style.display = "none";
		} else if (sRefByPrev == 'B') {
			document.all.spanRefByBank.style.display = "none";
		}
		
		sRefByPrev = sRefBy;
	}*/
</script>
