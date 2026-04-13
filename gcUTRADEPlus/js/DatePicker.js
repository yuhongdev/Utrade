var NS4 = (document.layers);
var IE4 = (document.all);
var week_days = [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ];
var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

var years  = null;
var today = new Date();
var curr_day = today.getDate();
var curr_month = today.getMonth();
var curr_year = today.getFullYear();

var default_left = 100;          //Left co-ord. of picker if not supplied.
var default_top = 80;            //Top co-ord. of picker if not supplied.
var default_width = 210;         //Width of picker if not supplied.
var default_height = 250;        //Height of picker if not supplied.
var default_cell_width = 20;     //Cell width of picker if not supplied.
var default_cell_height = 20;    //Cell height of picker if not supplied.
var default_bg_color = '#98D1CA'; //Back. color of picker if not supplied.
var cal_offset_y = 32;           //Y offset of the calendar inside the picker.

function initDatePicker(nYear, nMinAge)
{
   years = new Array(nYear);   
   var dLastYear
   dLastYear = curr_year - (nYear + nMinAge - 1)
   for (i = 0; i < years.length; i++) years[i] = dLastYear + i;
}

//is_popup = true if date picker should popup in a separate window
//win = Parent window object
//handler = Function to handle date selection
//left = Left co-ord; window client pixels (optional)
//top = Top co-ord; window client pixels (optional)
//width = Width (optional)
//height = Height (optional)
//cell_width = Calendar cell width (optional)
//cell_height = Calendar cell height (optional)
//bg_color = Background color (optional)
//sel_month = Selected month (optional)
//sel_year = Selected year (optional)
function DatePicker(is_popup, win, handler, left, top, width, height,
  cell_width, cell_height, bg_color, sel_month, sel_year)
{ 
  if (years==null)
    initDatePicker(80, 18);

  this.is_popup = is_popup;
  this.parent = null;
  this.window = null;
  if (this.is_popup)
    this.parent = win;
  else
    this.window = win;
  if (handler)
    this.handler = handler;
 else
    this.handler = default_selected;

  this.left = left;
  this.top = top;
  this.width = width || default_width;
  this.height = height || default_height;
  this.cell_width = cell_width || default_cell_width;
  this.cell_height = cell_height || default_cell_height;
  this.bg_color = bg_color || default_bg_color;
  this.sel_month = sel_month;
  this.sel_year = sel_year;
  if (this.sel_month == null) this.sel_month = curr_month;
  if (this.sel_year == null) this.sel_year = curr_year;
  this.days = new Array(42);
  this.cal = null;
  this.day_table = null;

  if (NS4)
  {
    DatePicker.prototype.create_cal = DatePicker_create_cal_NS4;
    DatePicker.prototype.show_days = DatePicker_show_days_NS4;
  }
  else
  {
    DatePicker.prototype.create_cal = DatePicker_create_cal_IE4;
    DatePicker.prototype.show_days = DatePicker_show_days_IE4;
  }
  DatePicker.prototype.popup_cal = DatePicker_popup_cal;
  DatePicker.prototype.new_month = DatePicker_new_month;
  DatePicker.prototype.prev_month = DatePicker_prev_month;
  DatePicker.prototype.next_month = DatePicker_next_month;
  DatePicker.prototype.clicked_day = DatePicker_clicked_day;
  //Variables for IE
  if (DatePicker.prototype.id == null) DatePicker.prototype.id = 0;
  DatePicker.prototype.id++;
  this.id = DatePicker.prototype.id;
  this.cal_id = 'cal' + this.id;
  this.day_table_id = 'day_table' + this.id;
  this.select_form_id = 'select_form' + this.id;
}

function DatePicker_create_cal_NS4()
{
  if (this.is_popup)
  {
    var x = this.parent.screenX + (this.parent.outerWidth - this.parent.innerWidth) + (this.left || default_left);
    var y = this.parent.screenY + (this.parent.outerHeight - this.parent.innerHeight) + (this.top || default_top);
    this.window = this.parent.open("", this.cal_id, 'screenX=' + x + ',screenY=' + y + ',innerWidth=' + this.width + ',innerHeight=' + this.height + ',scrollbars=no,resizeable=no');
    this.window.document.open();  //Need to open and close document in Navigator
    this.window.document.writeln('<title>Select a date</title>');
    this.window.document.close();
  }

  this.cal = new Layer(this.width, this.window);
  this.cal.name = this.cal_id;
  if (this.is_popup)
  {
    this.cal.left = 0;
    this.cal.top = 0;
  }
  else
  {
    this.cal.left = this.left || default_left;
    this.cal.top = this.top || default_top;
  }
  this.cal.zIndex = 1;
  this.cal.clip.width = this.width;
  this.cal.clip.height = this.height;
  this.cal.bgColor = this.bg_color;
  this.cal.visibility = 'show';
  var doc = this.cal.document;
  doc.picker = this;
  doc.open();
  doc.writeln("<center>");
  doc.writeln("<table border='0'>");
  doc.writeln("  <tr>");
  doc.writeln("    <td align='center'>");
  doc.writeln("      <form name='" + this.select_form_id + "'>");
  doc.writeln("        <input type='button' value='&lt;&lt;' onClick='document.picker.prev_month()'>");
  doc.writeln("        &nbsp;<select name='month_sel' onChange='document.picker.new_month()'>");
  for (i = 0; i < months.length; i++)
    doc.writeln("        <option value='" + i + "'>" + months[i]);
  doc.writeln("        </select>");
  doc.writeln("        <select name='year_sel' onChange='document.picker.new_month()'>");
  for (i = 0; i < years.length; i++)
    doc.writeln("        <option value='" + years[i] + "'>" + years[i]);
  doc.writeln("        </select>&nbsp;");
  doc.writeln("        <input bgcolor=white type='button' value='&gt;&gt;' onClick='document.picker.next_month()'>");
  doc.writeln("      </form>");
  doc.writeln("    </td>");
  doc.writeln("  </tr>");
  doc.writeln("</table>");
  doc.writeln("</center>");
  doc.close();
  this.day_table = new Layer(this.width, this.cal);
  this.day_table.name = this.day_table_id;
  this.day_table.left = 0;
  this.day_table.top = cal_offset_y;
  this.day_table.zIndex = 2;
  this.day_table.visibility = 'inherit';
}

function DatePicker_show_days_NS4()
{
  var month_select = this.cal.document.forms[this.select_form_id]['month_sel'];
  var year_select = this.cal.document.forms[this.select_form_id]['year_sel'];
  month_select.selectedIndex = this.sel_month;
  if (this.sel_year > years[years.length-1])
		this.sel_year = years[years.length-1]
  year_select.selectedIndex = this.sel_year - years[0];
  var days_in_month = get_days_in_month(this.sel_month, this.sel_year);
  var day_of_week_first = (new Date(this.sel_year, this.sel_month, 1)).getDay();
  for (i = 0; i < this.days.length; i++) this.days[i] = 0;
  for (i = 0; i < days_in_month; i++)
    this.days[i + day_of_week_first] = i + 1;

  var doc = this.day_table.document;
  doc.picker = this;
  doc.open();
  doc.writeln("<center>");
  doc.writeln("<table border='1' cellpadding='0' cellspacing='0'>");
  doc.writeln("<form>");
  doc.writeln("  <tr>");
  for (j = 0; j < week_days.length; j++)
  {
    doc.writeln("    <td align='center' valign='middle' width='" + this.cell_width + "'>" + week_days[j] + "</td>");
  }
  doc.writeln("  </tr>");
  for (i = 0; i < 6; i++)
  {
    doc.writeln("  <tr>");
    for(j = 0; j < 7; j++)
    {
      var val = this.days[i * 7 + j];
      if (val > 0 && val < 10) val = " " + val + " ";
      if (this.days[i * 7 + j])
        doc.writeln("    <td align='center' valign='middle' height='" + this.cell_height + "'><input type='button' value='" + val + "' onClick='document.picker.clicked_day(" + this.days[i * 7 + j] + ")'></td>");
      else
        doc.writeln("    <td>&nbsp;</td>");
    }
    doc.writeln("  </tr>");
  }
  doc.writeln("</form>");
  doc.writeln("</table>");
  doc.writeln("</center>");
  doc.close();
}

function DatePicker_create_cal_IE4()
{
  if (this.is_popup)
  {

    var x = this.parent.screenLeft + (this.left || default_left);
    var y = this.parent.screenTop + (this.top || default_top);

    this.window = this.parent.open("", this.cal_id, 'left=' + x + ',top=' + y + ',width=' + this.width + ',height=' + this.height + ',scrollbars=no,resizeable=no');
    this.window.document.open();
    this.window.document.writeln('<title>Select a date</title>');
    this.window.document.close();
  }

  this.window.document.body.insertAdjacentHTML("beforeEnd", "<div id='" + this.cal_id + "' style='position:absolute'></div>");
  this.cal = this.window.document.all[this.cal_id];
  if (this.is_popup)
  {
    this.cal.style.pixelLeft = 0;
    this.cal.style.pixelTop = 0;
  }
  else
  {
    this.cal.style.pixelLeft = this.left || default_left;
    this.cal.style.pixelTop = this.top || default_top;
  }
  this.cal.style.zIndex = 1;
  this.cal.style.width = this.width;
  this.cal.style.height = this.height;
  this.cal.style.backgroundColor = this.bg_color;
  this.cal.style.visibility = 'visible';
  this.cal.picker = this;
  var str =
  "<center>\n" +
  "<table border='0'>\n" +
  "  <tr>\n" +
  "    <td align='center'>\n" +
  "      <form name='" + this.select_form_id + "'>\n" +
  "        <input type='button' value='&lt;&lt;' onClick='document.all." + this.cal_id + ".picker.prev_month()'>\n" +
  "        &nbsp;<select name='month_sel' onChange='document.all." + this.cal_id + ".picker.new_month()'>\n";
  for (i = 0; i < months.length; i++)
    str += "        <option value='" + i + "'>" + months[i] + "\n";
  str += "        </select>\n" +
  "        <select name='year_sel' onChange='document.all." + this.cal_id + ".picker.new_month()'>\n";
  for (i = 0; i < years.length; i++)
    str += "        <option value='" + years[i] + "'>" + years[i] + "\n";
  str += "        </select>&nbsp;\n" +
  "        <input type='button' value='&gt;&gt;' onClick='document.all." + this.cal_id + ".picker.next_month()'>\n" +
  "      </form>\n" +
  "    </td>\n" +
  "  </tr>\n" +
  "</table>\n" +
  "</center>\n" +
  "<div id='" + this.day_table_id + "' style='position:absolute'></div>\n";
  this.cal.innerHTML = str;
  this.day_table = this.window.document.all[this.day_table_id];
  this.day_table.style.pixelLeft = 4;
  this.day_table.style.pixelTop = cal_offset_y;
  this.day_table.style.zIndex = 2;
  this.day_table.style.visibility = 'inherit';
  this.day_table.picker = this;
}

function DatePicker_show_days_IE4()
{
  var month_select = this.window.document.forms[this.select_form_id]['month_sel'];
  var year_select = this.window.document.forms[this.select_form_id]['year_sel'];
  month_select.selectedIndex = this.sel_month;
  if (this.sel_year > years[years.length-1])
		this.sel_year = years[years.length-1]
  year_select.selectedIndex = this.sel_year - years[0];

  var days_in_month = (new Date(this.sel_year, this.sel_month+1, 0)).getDate();
  var day_of_week_first = (new Date(this.sel_year, this.sel_month, 1)).getDay();
  for (i = 0; i < this.days.length; i++) this.days[i] = 0;
  for (i = 0; i < days_in_month; i++)
    this.days[i + day_of_week_first] = i + 1;

  var str =
  "<center>\n" +
  "<table border='1'>\n" +
  "<form>\n" +
  "  <tr>\n";
  for (j = 0; j < week_days.length; j++)
  {
    str += "    <td align='center' valign='middle' width='" + this.cell_width + "'>" + week_days[j] + "</td>\n";
  }
  str += "  </tr>\n";
  for (i = 0; i < 6; i++)
  {
    str += "  <tr>\n";
    for(j = 0; j < 7; j++)
    {
      var val = this.days[i * 7 + j];
      if (val > 0 && val < 10) val = " " + val + " ";
      if (this.days[i * 7 + j])
        str += "    <td align='center' valign='middle' height='" + this.cell_height + "'><input type=button value='" + val + "' onClick='document.all." + this.day_table_id + ".picker.clicked_day(" + this.days[i * 7 + j] + ")'></td>\n";
      else
        str += "    <td>&nbsp;</td>\n";
    }
    str += "  </tr>\n";
  }
  str +=
  "</form>\n" +
  "</table>\n" +
  "</center>\n";
  this.day_table.innerHTML = str;
}

function DatePicker_popup_cal()
{
  if (this.is_popup)
  {
    if (this.cal && this.window && !this.window.closed)
      this.window.close();
    else
    {
      this.create_cal();
      this.show_days();
    }
  }
  else
  {
    if (!this.cal)
    {
      this.create_cal();
      this.show_days();
    }
    else
    {
      if (NS4)
      {
        if (this.cal.visibility == 'show')
          this.cal.visibility = 'hide';
        else
          this.cal.visibility = 'show';
      }
      else
      {
        if (this.cal.style.visibility == 'visible')
          this.cal.style.visibility = 'hidden';
        else
          this.cal.style.visibility = 'visible';
      }
    }
  }
}

function DatePicker_new_month()
{
  var month_select = this.cal.document.forms[this.select_form_id]['month_sel'];
  this.sel_month = new Number(month_select.options[month_select.selectedIndex].value);
  var year_select = this.cal.document.forms[this.select_form_id]['year_sel'];
  this.sel_year = new Number(year_select.options[year_select.selectedIndex].value);
  this.show_days();
}

function DatePicker_prev_month()
{
  this.sel_month--;
  if (this.sel_month < 0)
  {
    this.sel_month = 11;
    this.sel_year--;
		if (this.sel_year < years[0]) {
		   this.sel_month = 0;
			  this.sel_year++;
		 }
  }
  this.show_days();
}

function DatePicker_next_month()
{
  this.sel_month++;
  if (this.sel_month > 11)
  {
    this.sel_month = 0;
    this.sel_year++;
		if (this.sel_year > years[years.length-1]) {
			this.sel_month = 11;
			this.sel_year--;
		}
  }
  this.show_days();
}

function default_selected(cal, date)
{
  var dd, mm;

  dd = date.getDate();
  if (dd < 10) { dd = '0'+ dd; };
  mm = date.getMonth() +1;
  if (mm < 10) { mm = '0'+ mm; };
  if (cal.date_fld) {
    if (cal.date_format != null && cal.date_format == "dd/mm/yyyy") {
      cal.date_fld.value = dd +"/"+ mm +"/"+ date.getFullYear();
    } else {
      cal.date_fld.value = date.getFullYear() +'-'+ mm +'-'+ dd;
    }
  }
}

function DatePicker_clicked_day(day)
{
  if (this.is_popup)
    this.window.close();
  else
    if (NS4)
      this.cal.visibility = 'hide';
    else
      this.cal.style.visibility = 'hidden';
  var sel_date = new Date(this.sel_year, this.sel_month, day);
  if (this.handler) this.handler(this, sel_date);
}

function get_days_in_month(mon, yr)
{
  var month = new Number(mon);
  var year = new Number(yr);
  var mdays = [ [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] ];
  var isleap =
     (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) ? 1 : 0;
  return mdays[isleap][month];
}
