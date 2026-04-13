// Common base params
const bc = window.LOGIN_BC; // Encoded value for the bc
const loginType = "l"; // normal login
const loginRopType = "r"; // redirect to online platform login

// URL map by type
const popupUrls = {
  login: { url: `/passport/blogin?bc=${bc}&type=${loginType}`, size: "b" },
  loginRop: {
    url: `/passport/blogin?bc=${bc}&type=${loginRopType}`,
    size: "b",
  },
  chgPwd: { url: `/passport/bchgpwd?bc=${bc}`, size: "s" },
  chgPin: { url: `/passport/bchgpin?bc=${bc}`, size: "s" },
  fgtPin: { url: `/passport/bfgtpin?bc=${bc}`, size: "s" },
};

/**
 * Show iframe with fade transition after loading
 */
function showIframeWithFade($iframe, $loader, delay = 200) {
  $loader.addClass("fade-scale-out");
  setTimeout(() => {
    $loader.hide().removeClass("fade-scale-out");
    $iframe.fadeIn(100);
  }, delay);
}

/**
 * Open modal with given type
 * @param {string} popupType - key in popupUrls
 */
function openPopupByType(popupType) {
  const cfg = popupUrls[popupType];
  if (!cfg) {
    console.error(`No URL configured for popupType: ${popupType}`);
    return;
  }

  const $modal = $("#dynamicModal");
  const $content = $modal.find(".modal-content");
  const $body = $modal.find(".modal-body");
  const $iframe = $("#modalIframe");
  const $loader = $("#iframeLoader");

  // reset size class
  $content.removeClass("modal-mw");
  $body.removeClass("modal-pz");
  if (cfg.size === "s") {
    $content.addClass("modal-mw");
    $body.addClass("modal-pz");
  }

  // reset loader + iframe
  $loader.show().removeClass("fade-scale-out");
  $iframe.hide().off("load").attr("src", cfg.url);

  // bind load event
  $iframe.on("load", function () {
    showIframeWithFade($iframe, $loader, 200);
  });

  $modal.modal("show");
  console.log("iframe loading:", popupType);
}

function triggerPopup(type) {
  try {
    // inside iframe
    if (window.self !== window.top) {
      // through postMessage call parent
      window.parent.postMessage({ action: "openPopup", type }, "*");
    } else {
      // not inside iframe
      openPopupByType(type);
    }
  } catch (e) {
    console.error("triggerPopup error:", e);
  }
}

function ensureDynamicModalExists() {
  if ($("#dynamicModal").length === 0) {
    $("body").append(`
      <div class="modal fade custom-modal" id="dynamicModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-body">
              <div id="iframeLoader" class="iframe-loader">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <iframe
                id="modalIframe"
                scrolling="yes"
                frameborder="0"
                style="display: none"
              ></iframe>
            </div>
            <div class="modal--close" data-dismiss="modal">
              <svg class="close-icon" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `);
  }
}

/**
 * Init universal modal iframe events
 */
$(function () {
  ensureDynamicModalExists();

  const $modal = $("#dynamicModal");
  const $iframe = $("#modalIframe");
  const $loader = $("#iframeLoader");

  // clear iframe on hide
  $modal.on("hidden.bs.modal", function () {
    $iframe.attr("src", "").hide();
    $loader.hide().removeClass("fade-scale-out");
  });

  window.addEventListener("message", function (event) {
    if (event.data?.action === "openPopup") {
      openPopupByType(event.data.type);
    }
  });

  // allow iframe trigger close
  window.addEventListener("message", function (event) {
    if (event.data?.action === "closePopup") {
      $modal.modal("hide");
      $iframe.attr("src", "");
    }
  });

  // bind the button
  $(document).on("click", ".openModalBtn", function () {
    const type = $(this).data("type");
    triggerPopup(type);
  });
});
