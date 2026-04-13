<table border=0 cellspacing=0 cellpadding=0 valign="top">
<tr>
	<form id="frmFastQuote" onsubmit="return butFastQuote_OnClick();" method="get" action="http://charttb.asiaebroker.com/ebcServlet/stkFastQuote?bhcode=065&key=" name="frmFastQuote"/>
	<td style="font-size: 8pt; font-family: Arial; color: rgb(212, 212, 212);">
	<input id="txtFastQuote" style="font-size: 8pt; height: 19px;" autocomplete="off" size="23" name="txtFastQuote" onmouseover="javascript:document.getElementById('txtFastQuote').select();" value="Stock Quotes" />
	&nbsp;&nbsp;<font onclick="butFastQuote_OnClick();" style="font-family: arial; color: rgb(5, 165, 228); cursor: pointer;">Search</font>
	</td>
	<input id="FilterCode" type="hidden" value="" name="FilterCode"/>
	<input id="StockName" type="hidden" value="" name="StockName"/>
	</form>
</tr>
</table>
