<% if(bCorpCli && bExistCli){ /*if is existing or AmSec corporate client*/%>
<tr height=20>
	<td class=clsCliDtlLbl>Trading Account</td>
	<td>&nbsp;</td><!--onkeypress="window.event.keyCode=AlphaNumberCtrl(window.event.keyCode)" onPaste="event.returnValue=false"-->
	<td class=clsCliDtlInput colspan=3>
		<INPUT class=clsCliDtlInput id=bhCliCode name=bhCliCode size=15 maxlength=9 style='WIDTH:150px;HEIGHT:20px' value="<%=clibean.getBhCliCode()%>" onkeypress='window.event.keyCode=AlphaNumberCtrl(window.event.keyCode)'>
	</td>
</tr>
<% } %>
<tr height=20>
	<td width='25%' class=clsCliDtlLbl>Company Name</td>
	<td width='3%'>&nbsp;</td>
	<td width='72%' colspan=3>				
		<INPUT class=clsCliDtlInput id=cliName name=cliName maxlength=50 size=50 style='width:300px;height:20px' value="<%=clibean.getCliName()%>">
	</td>
</tr>
<tr height=20>
	<td class=clsCliDtlLbl>Company Reg No</td>
	<td>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3>
		<input class=clsCliDtlInput id=oldIcNo  name=oldIcNo maxLength=12 size=12 style="width:86px;height:20px" value="<%=clibean.getOldIcNo()%>">
		<!--Company Reg No should be at least 7 characters in length-->
	</td>
</tr>



<tr id=tblDOB height=20>
	<td class=clsCliDtlLbl>Date Of incorporation</td>
	<td>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3>
		<table border=0 cellpadding=0 cellspacing=0><tr><td align=left>
		<html:N2N_HtmlObject type="calendar" objectName="frmUserReg.dob" defaultValue="<%=clibean.getDob()%>"/>
			The format is dd/mm/yyyy
		</td></tr></table>
	</td>
</tr>

<tr id=tbladdr1 height=20>
	<td class=clsCliDtlLbl>Business Address</td>
	<td>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3><INPUT id=add1 name=add1 maxLength=120 size=120 style="width:400px;" value="<%=clibean.getAdd1()%>"></td>
</tr>
<tr id=tbladdr2 height=20>
	<td class=clsCliDtlLbl>&nbsp;</td>
	<td>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3><INPUT id=add2 name=add2 maxLength=120 size=120 style="width:400px;" value="<%=clibean.getAdd2()%>"></td>
</tr>
<tr id=tblCountry height=20>
	<td class=clsCliDtlLbl>Country</td>
	<td class=clsCliDtlLbl>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3>
	<html:N2N_HtmlObject type="select" 
		objectName="country" fieldName="LinkCode,Description"
		table="MF_Ref" condition="Type='country' order by Description asc" fieldValue="LinkCode" fieldLabel="Description" 
		onChangeEvent="" style="HEIGHT:20px;WIDTH:400px" defaultValue="<%=clibean.getCountry()%>"/>
	</td>
</tr>
<tr id=tblcity height=25>
	<td class=clsCliDtlLbl>State</td>
	<td class=clsCliDtlLbl>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3>
	<table border=0 cellpadding=0 cellspacing=0 width='100%'>
		<tr>
			<td width='23%'>
			<html:N2N_HtmlObject type="select" 
				objectName="state" fieldName="LinkCode,Description"
				table="vw_mfRef" condition="Type='state'" fieldValue="LinkCode" fieldLabel="Description" onChangeEvent="state_OnChange()" className="clsCliDtlInput"
				style="width:150px;height=20px" defaultValue="<%=clibean.getState()%>"/>
				<INPUT class=clsCliDtlInput id=otrState name=otrState maxlength=20 size=20 style="width:150px;height:20px;<%=clibean.getState().compareToIgnoreCase("OTR") != 0 ? "display:none" : ""%>" value='<%=clibean.getOtrState()%>'>
						
			<td class=clsCliDtlLbl colspan=3></td>
			<td class=clsCliDtlLbl width='11%'>Postcode</td>
			<td width='4%'>&nbsp;</td>
			<td width='62%'>
				<input class=clsCliDtlInput id=postcode name=postcode maxLength=6 size=9 style="width:86px;height:20px" value="<%=clibean.getPostcode()%>">
			</td>
		</tr>
	</table>
	</td>
</tr>
			
<tr height=20>
	<td class=clsCliDtlLbl>Phone No</td>
	<td class=clsCliDtlLbl>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3>
		<input class=clsCliDtlInput id=telno1 name=telno1 maxlength=4 style="width:40px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getTelno1()%>">&nbsp;- 
		<input class=clsCliDtlInput id=telno name=telno maxlength=8 style="width:70px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getTelno()%>">
		area code - phone
	</td>
</tr>
<tr height=20>
	<td class=clsCliDtlLbl>Fax No</td>
	<td class=clsCliDtlLbl>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3>
		<input class=clsCliDtlInput id=faxNo1 name=faxNo1 maxlength=4 style="width:40px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getFaxNo1()%>">&nbsp;- 
		<input class=clsCliDtlInput id=faxNo name=faxNo maxlength=8 style="width:70px;height:20px" onkeypress="window.event.keyCode = NumberCtrl(window.event.keyCode)" value="<%=clibean.getFaxNo()%>">
		area code - phone
	</td>
</tr>
<tr height=20>
	<td class=clsCliDtlLbl>Person Authorised To Trade</td>
	<td class=clsCliDtlLbl>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3>
		<table border=0 cellpadding=0 cellspacing=0 width='100%'>
			<tr>
				<td width='27%'><INPUT class=clsCliDtlInput id=displayName name=displayName maxlength=50 size=50 style='width:300px;height:20px' value="<%=clibean.getDisplayName()%>"></td>
				<td width='12%' class=clsCliDtlLbl>NRIC</td>
				<td width='9%'>&nbsp;</td>
				<td width='52%'>
					<input class=clsCliDtlInput id=icNo name=icNo maxLength=12  size=12 style="width:150px;height:20px" onkeypress="window.event.keyCode=AlphaNumberCtrl(window.event.keyCode)" value="<%=clibean.getIcNo()%>">
				</td>
			</tr>
		</table>
	</td>
</tr>

<tr height=20>
	<td class=clsCliDtlLbl>Contact Email</td>
	<td>&nbsp;</td>
	<td class=clsCliDtlInput colspan=3><INPUT id=email name=email maxLength=40  size=40 style="width:200px;height:20px" value="<%=clibean.getEmail()%>">&nbsp; eg. corporate@def.com.my</td>
</tr>