<%
'---------------------------------------------------------------------------------
'Purpose:	central area for maintaining style and style sheet settings for the entire
'					project
'By     : Edward
'Date   : Mar 4, 1999
'Args		: none
'---------------------------------------------------------------------------------
Sub GenStyles
if (Application("AppMode") = "game") then
Response.Write("<link rel=stylesheet href=/style/game.css>")
else
Response.Write("<link rel=stylesheet href=/style/default.css>")
Response.Write("<link rel=""shortcut icon"" href=/img/favicon.ico >")
end if
End Sub
%>
