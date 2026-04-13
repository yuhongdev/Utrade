const ROOT_URL = "/gcAHIBPlus/";
const API_PATH = `${ROOT_URL}srvs/v3/`;
const CHECK_LOGIN_URL = `${API_PATH}chkSession?${Date.now()}`;

const HOME_PAGE = `${ROOT_URL}login/indexV2.html`;
// const HOME_PAGE = `/`; // for AFFIN UAT

const TCPLUS_URL = `${ROOT_URL}tcplus/index.jsp`;

const LOGOUT_URL = `${ROOT_URL}logout.jsp`;

let login_agent = "";
const activate_login_id = getQueryParam("LoginID");

window.console = window.console || { log: () => {} };

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || "";
}

function checkLogin() {
  showLoader(true);

  const url = `${CHECK_LOGIN_URL}&loginID=${encodeURIComponent(
    activate_login_id
  )}`;
  let data = null;

  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    async: false,
    success: function (response) {
      data = response;
    },
    error: function (xhr, status, err) {
      console.error("Login check failed:", err);
      handleError(err);
    },
    complete: function () {
      showLoader(false);
    },
  });

  login_agent = data;
}

function showLoader(show) {
  $("#response").css("display", show ? "" : "none");
}

function handleError(err) {
  console.error("Login check failed:", err);
  showLoader(false);
  // alert("System under maintenance. Please try again later.");
  // window.location.href = HOME_PAGE;
}

// for AFFIN UAT
function openCliAccInfo() {
  window.open(
    `${ROOT_URL}acctInfo.jsp?secure=Y`,
    "oSubWin",
    "left=310,top=225,width=800,height=320,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes"
  );
}

function confirmLogout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = LOGOUT_URL;
  }
}

function chgLayout(layout) {
  $("#divLogin").css("display", "none");
  $("#divLogon").css("display", "none");

  switch (layout) {
    case 1:
      $("#divLogin").css("display", "");
      break;
    case 4:
      $("#divLogon").css("display", "");
      break;
    default:
      $("#divLogin").css("display", "");
  }
}

$(document).ready(function () {
  checkLogin();

  document
    .getElementById("homeLink")
    ?.setAttribute("href", `${ROOT_URL}login/indexV2.html`);
  document
    .getElementById("tcplusLink")
    ?.setAttribute("href", `${ROOT_URL}tcplus/index.jsp`);
});
