<script language=VBScript runat=server>
sub BuySell_CSS_GetUIBorderBegin(vnHeight, vsOrdType, vbOddLot)
	dim sBorderColor

	if (sOrdType = TRD_TYPE_SELL) then
'		sBorderColor = "#E12929"
sBorderColor = "#CC0000"

	else
'		sBorderColor = "#0FC200"
sBorderColor = "#009900"


	end if

	Response.Write("<table border=0 cellpadding=1 cellspacing=0 width=586>")
	Response.Write("<tr><td>")
	Response.Write("<table id=tblMainFrame border=2 cellpadding=1 cellspacing=0 bordercolor="& sBorderColor &" style='border-style:groove' width='100%'>")
	Response.Write("<tr><td>")
end sub

sub BuySell_CSS_GetUIBorderEnd(vnHeight, vsOrdType, vbOddLot)
	Response.Write("</td></tr></table></td></tr></table>")
end sub


sub BuySell_CSS_GetFeature()
'	Response.Write("<PARAM NAME=Feature VALUE=255>")
	Response.Write("<PARAM NAME=Feature VALUE=159>")
end sub


' ColorScheme = TopPanel | BottomPanel | Bottom-Right Button
sub BuySell_CSS_GetUIApplet(vsOrdType, vbOddLot)
	if (vbOddLot = "Y") then
		Response.Write("<PARAM NAME=ColorScheme VALUE='#FFFFE3|#C0C0C0|#00A0C6|#FCFCAF'>")
		

	else
		'Response.Write("<PARAM NAME=ColorScheme VALUE='#BBE4FF|#C0C0C0|#00A0C6|#FCFCAF'>")
	'	 Response.Write("<PARAM NAME=ColorScheme VALUE='#E0E0E0|#999999|#0276A4|#FCFCAF'>")

	end if
end sub
</script>