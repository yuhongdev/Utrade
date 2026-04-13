function N2NCSSFun(){
	
	// blinking font style 
	this.FontUnChange = "N2N_FontUnchange";
	this.FontUnChange_yellow = "N2N_FontUnchange_yellow";
	this.FontUp = "N2N_FontUp";
	this.FontDown = "N2N_FontDown";	
	this.FontOnBlink = "N2N_FontOnBlink";
	
	this.BackUnChange = "N2N_BackUnchange";
	this.BackUp = "N2N_BackUp";
	this.BackDown = "N2N_BackDown";
	
	
	
	// default grid cell style
	this.CellDefault = "quotePanelCell";

	// stock name design 
	this.FontStockName = "N2N_stockNameStyle";
	
	// normal string designs
	this.FontString = "N2N_stringStyle";
	
        // stock name and stock code always white color / blue color
        this.FontColorString = "N2N_FontColorString"; 
        
	// stock name color design
	this.Font_StockCategory_1 = "N2N_FontStockName_1";
	this.Font_StockCategory_2 = "N2N_FontStockName_2";
	this.Font_StockCategory_3 = "N2N_FontStockName_3";
	this.Font_StockCategory_4 = "N2N_FontStockName_4";

	
	
	// other font design
	this.FontWhite = "N2N_FontWhite";
	this.FontBlue = "N2N_FontBlue";
	
	this.FontBold = "N2N_FontBold";
	this.FontSize_13 = "N2N_FontSize_13";

	
	this.stockInfoLabel_color = "stockInfoLabel_color";
	
	this.MarketDepthLast_background = "MarketDepthLast_background";
	
	
	this.OrderPad_Buy 		= "N2N_OrderPad_BackBuy";
	this.OrderPad_Sell 		= "N2N_OrderPad_BackSell";
	this.OrderPad_Default 	= "N2N_OrderPad_BackDefault";
	this.MobileOrderPad_Default 	= "N2N_Mobile_OrderPad_BackDefault";
	
	
	this.allBlinkStyle = [this.FontUnChange, this.FontUnChange_yellow, this.FontUp, this.FontDown, this.FontOnBlink, this.BackUnChange, this.BackUp, this.BackDown];
	this.AllOrderPadStyle = [this.OrderPad_Buy, this.OrderPad_Default, this.OrderPad_Sell];
	
}

var N2NCSS = new N2NCSSFun();

