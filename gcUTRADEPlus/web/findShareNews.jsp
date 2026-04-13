<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<style>
			input, select {font-family : Tahoma,Arial,Verdana;font-size:11px;}
			body, th, td {font-family:Tahoma, Verdana;font-size:11px;}
			body {margin:0px auto;overflow-x:hidden;}
			a{color:#169b49;text-decoration:none;}
			hr {height:1px;}
			.noBorder{border:0px;}
			.titlebar{position:relative;width:614px;height:30px;background:#0056A6;border:1px solid #0056A6;}
			.white{color:#FFF;}
			.cellbottomline{border-bottom:1px solid #CCC;position:relative;}
			.cellupperline{border-top:1px solid #CCC;}
			.textual a{color:#000;}
			#container_all{background:white;margin:0px auto;width:860px;}
			*HTML body{text-align:center;margin:0px auto;background:#C1D3E5;}
			*HTML #container_all{text-align:left;margin:0px auto;width:860px;}
			#HTMLBody{margin:0px;padding:0px;overflow-x:hidden;position:absolute;background:#FFF;height:100%;}
			#HTMLBody > #Wrapper{
				border:0px solid;
				margin:0px;
				padding:0px;
				height:auto;
			}

			#HTMLBody > #Wrapper > #ValuesContainer{
				border:0px solid red; 
				overflow:hidden; 
				height:auto;
				padding-bottom:45px;
			}
		</style>
		<style type="text/css">
			.pluginCountButton {
			    background: white;
			    border: 1px solid #9197a3;
			    border-radius: 2px;
			    color: #4e5665;
			    display: inline-block;
			    font-size: 11px;
			    height: auto;
			    line-height: 18px;
			    margin-left: 6px;
			    min-width: 15px;
			    padding: 0 3px;
			    text-align: center;
			    white-space: nowrap;
			    vertical-align: bottom;
			}

			#fs_recs {
				padding-left: 10px;
				padding-right: 10px;
				padding-bottom: 30px;
			}
			.pluginFontHelvetica td, .pluginFontHelvetica textarea {
			    font-family: helvetica, arial, sans-serif;
			}

			.pluginCountButtonNub s, .pluginCountButtonNub i {
			    border-color: transparent #9197a3;
			    border-style: solid;
			    border-width: 4px 5px 4px 0;
			    display: block;
			    position: relative;
			    top: 1px;
			}

			.pluginCountButton {
				max-width: 50px;
			} 
			.pluginCountButtonNub i {
			    border-right-color: #fff;
			    top: -7px;
			    left: 2px;
			}

			._51mz {
			    border: 0;
			    border-collapse: collapse;
			    border-spacing: 0;
			}

			.pluginCountButtonNub {
			    height: 0;
			    left: 2px;
			    position: relative;
			    top: -15px;
			    width: 5px;
			    z-index: 2;
			}
			.fb-share-button {
				display: inline-block;
			}
			.fs_news_title {
				padding-right: 5px;
			}

			.fs_news_source {
				font-weight: bold;
			}
			.fs_news_div{
				padding-top: 10px;
				text-align: left;
			}

			.relnewstitle {
			    font-weight: bold;
			    color:#0A7A4A;
			    background-color: transparent;
			    width: 860px;
			    height: 27px;
			    line-height: 27px;
			    position: relative;
			    border-bottom: 1px solid #A6AAAD;
			    margin-left: -10px;
			    font-size: 11px;
			    text-align: left;
			}

			.findshare_logo {
				margin-top: 10px;
			}
		</style>
		<style type="text/css">
			#findshare_popup a {
				text-decoration: none;
			}
			#findshare_popup {
				position: fixed;
				width: 200px;
				height: 200px;
				border-radius: 5px;
				padding: 20px;
				border: 1px solid #dddddd;
				color: #808080;
				background-color: white;
				overflow-y: auto;
				transition: 0.5s;
				font-family: Helvetica;
			  	-webkit-border-radius:4px;
			  	-moz-border-radius:4px;border-radius:4px;
			    -webkit-box-shadow:4px 4px 12px 2px #d2d2d2;
			    -moz-box-shadow:4px 4px 12px 2px #d2d2d2;
			    box-shadow:4px 4px 12px 2px #d2d2d2;
			}
		</style>
	</head>
	<body>
		<div id="HPContainer-FindShare" style="height: auto; margin: 0;padding:0; width: auto; background: rgb(255, 255, 255) none repeat scroll 0% 0%;border:0px solid red;">
			<div id="FindShareContent" style="height: auto; margin: 0px auto; width: 860px;border:0px solid blue;">
				<div id="fs_recs">
					<div id="fb-root"></div>
					<br>
					<br>
					<br>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="../js/jquery-3.6.0.js"></script>
		<script type="text/javascript" src="https://ws3.findshare.com/assets/js/utrade/findshare_web_service.js"></script>		
	</body>
</html>