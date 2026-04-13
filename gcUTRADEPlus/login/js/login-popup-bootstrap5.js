// Common base params
const bc = window.LOGIN_BC; // Encoded value for the bc
const loginType = "l"; // normal login
const loginRopType = "r"; // redirect to online platform login

// Define popup URL mappings by popup type
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

// Fade in iframe after content is ready
function showIframeWithFade($iframe, $loader) {
  $loader.addClass("fade-scale-out");
  setTimeout(() => {
    $loader.hide();
    $iframe.fadeIn(200);
  }, 300);
}

function openPopupByType(popupType, extraParams = {}) {
  // Get popup config
  let cfg = popupUrls[popupType];
  if (!cfg) {
    console.error(`No URL configured for popupType: ${popupType}`);
    return;
  }

  // Build final URL with optional query params
  let finalUrl = cfg.url;
  const queryParams = new URLSearchParams();
  for (const [k, v] of Object.entries(extraParams)) {
    queryParams.append(k, v);
  }
  if (queryParams.toString()) {
    finalUrl += `&${queryParams.toString()}`;
  }

  // Get modal elements
  const $modal = $("#dynamicModal");
  const $content = $modal.find(".modal-content");
  const $body = $modal.find(".modal-body");
  const $iframe = $("#modalIframe");
  const $loader = $("#iframeLoader");

  // Reset modal size classes
  $content.removeClass("modal-mw");
  $body.removeClass("modal-pz");
  if (cfg.size === "s") {
    $content.addClass("modal-mw");
    $body.addClass("modal-pz");
  }

  // Prepare loading spinner
  $loader.show().removeClass("fade-scale-out");
  $iframe.hide().off("load");

  // Show modal
  const modal = new bootstrap.Modal($modal[0]);
  modal.show();

  // Fallback: show warning if iframe fails to load
  let loaded = false;
  const timeoutMs = 4000;
  const timeout = setTimeout(() => {
    if (!loaded) {
      $loader.hide();
      $iframe.show().css("opacity", 0.5);
      $iframe.before(
        `<div class="text-center text-muted small">⚠️ Failed to load content. Please try again.</div>`
      );
    }
  }, timeoutMs);

  // When iframe successfully loads
  $iframe.on("load", function () {
    loaded = true;
    clearTimeout(timeout);
    showIframeWithFade($iframe, $loader);
  });

  // Start loading iframe content
  $iframe.attr("src", finalUrl);

  // Safety fallback: show iframe even if 'load' event missed
  setTimeout(() => {
    if (!loaded) {
      loaded = true;
      showIframeWithFade($iframe, $loader);
    }
  }, 300);

  console.log("iframe loading:", finalUrl);
}

// Trigger popup (supports nested iframe)
function triggerPopup(type, extraParams = {}) {
  try {
    if (window.self !== window.top) {
      // Send message to parent frame
      window.parent.postMessage(
        { action: "openPopup", type, extraParams },
        "*"
      );
    } else {
      // Directly open in current window
      openPopupByType(type, extraParams);
    }
  } catch (e) {
    console.error("triggerPopup error:", e);
  }
}

// Dynamically create modal if not exists
function ensureDynamicModalExists() {
  if ($("#dynamicModal").length === 0) {
    $("body").append(`
      <div class="modal fade custom-modal" id="dynamicModal" tabindex="-1" aria-hidden="true" style="display:none;">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-body">
              <div id="iframeLoader" class="iframe-loader">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <iframe
                id="modalIframe"
                scrolling="yes"
                frameborder="0"
                style="display: none"
              ></iframe>
            </div>
            <div class="modal--close" data-bs-dismiss="modal" aria-label="Close">
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

// Init universal modal iframe events
$(function () {
  ensureDynamicModalExists();

  const $modal = $("#dynamicModal");
  const $iframe = $("#modalIframe");
  const $loader = $("#iframeLoader");

  // Reset iframe when modal closes
  $modal.on("hidden.bs.modal", function () {
    $iframe.attr("src", "").hide();
    $loader.hide().removeClass("fade-scale-out");
  });

  // Listen for messages from iframe
  window.addEventListener("message", function (event) {
    if (event.data?.action === "openPopup") {
      openPopupByType(event.data.type, event.data.extraParams || {});
    } else if (event.data?.action === "closePopup") {
      $modal.modal("hide");
      $iframe.attr("src", "");
    }
  });

  // Attach click handler to buttons
  $(document).on("click", ".openModalBtn", function () {
    const type = $(this).data("type");
    const typeAm = $(this).data("typeam");
    const extraParams = {};

    if (typeAm) extraParams.typeam = typeAm;
    triggerPopup(type, extraParams);
  });
});
