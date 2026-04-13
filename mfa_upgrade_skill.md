# MFA Implementation & Library Upgrade Playbook

This document serves as a long-term playbook for upgrading legacy web applications (e.g., JSP/Java environments using Bootstrap 3, jQuery 3.6, etc.) to integrate a Single Source Multi-Factor Authentication (MFA) modal system, alongside necessary frontend library upgrades.

## 1. Frontend Library Upgrades

Before injecting the MFA module, ensure the foundational libraries are up-to-date across all relevant authentication and registration pages.

### A. jQuery & Plugins
*   **jQuery**: Upgrade from `3.6.x` to `3.7.1`.
    *   Find instances of `<script src=".../jquery-3.6.0.js"></script>`
    *   Replace with `<script src=".../jquery-3.7.1.min.js"></script>`
*   **jQuery Validation**: Upgrade to version `1.22.0`.
    *   Find instances of `<script src=".../jquery.validate.js"></script>`
    *   Replace with `<script src=".../jquery.validate-1.22.0.min.js"></script>`

### B. CryptoJS Migration
*   **Objective**: Replace legacy individual crypto files (`aes.js`, `pbkdf2.js`) with the modern bundled `crypto-js-4.2.0.min.js`.
*   **Action**: 
    1. Comment out or remove references to `aes.js` and `pbkdf2.js`.
    2. Ensure `AesUtil.js` (which acts as a bridge wrapper) is kept intact as the API calls (`CryptoJS.PBKDF2` and `CryptoJS.AES`) remain compatible between v3 and v4.
    3. Inject `<script src=".../crypto-js-4.2.0.min.js"></script>` before `AesUtil.js`.

---

## 2. MFA Bootstrap 5 Integration (The Two-Track Strategy)

Legacy projects often rely heavily on Bootstrap 3. Upgrading the entire application to Bootstrap 5 is risky and scope-creeping. Instead, use a **Two-Track Approach**:
*   **Track 1 (Legacy Core)**: Maintain the old `bootstrap.css` and `bootstrap_min.js` (e.g., v3.3.5) for the main application pages.
*   **Track 2 (MFA Pages)**: Inject `bootstrap-5.3.6.min.css` and `bootstrap-5.3.6.bundle.min.js` strictly on pages that utilize the MFA modal (Login, Activation, Account Management).

### A. CSS/JS Sequence Injection
On all login/MFA related pages (e.g., `cliLogin.html`, `cliLoginActivate.html`), inject the following sequence exactly in this order:

**In `<head>`:**
```html
<link rel="stylesheet" href="../css/bootstrap-5.3.6.min.css" />
<link rel="stylesheet" href="../css/login.css" />
<link rel="stylesheet" href="/passport/login/css/popup-modal-bootstrap5.css" />
```

**Before `</body>`:**
```html
<script src="../js/bootstrap-5.3.6.bundle.min.js"></script>
<script src="../../passport-login-bc.jsp"></script>
<script src="/passport/login/js/login-popup-bootstrap5.js"></script>
```
*Note: Adjust relative paths (`../`, `../../`) based on the file depth.*

### B. Triggering the MFA Modal
The MFA system relies on specific class names and data attributes to hijack button clicks and render the shared modal.
*   **Action**: Find all authentication-related buttons/links (Login, Change Password, Forgot PIN, etc.)
*   **Modifications**:
    1. Remove legacy inline `onclick` handlers (e.g., `onclick="chgLayout(2)"`).
    2. Add the class `openModalBtn`.
    3. Add the corresponding `data-type` attribute. Valid types: `login`, `chgPwd`, `chgPin`, `fgtPin`.
*   **Example**:
    ```html
    <!-- Before -->
    <a onclick="chgLayout(2)">Forgot Password</a>
    
    <!-- After -->
    <a href="javascript:void(0);" class="openModalBtn" data-type="fgtPin">Forgot Password</a>
    ```

---

## 3. Bootstrap 3 to Bootstrap 5 Syntax Migration

Because the login pages now use Bootstrap 5, any legacy Bootstrap 3 layout classes on those specific pages must be manually converted to prevent UI breakage.

**Common Conversions:**
*   **Layout/Spacing**: 
    *   `margin-top: 8px;` -> `mt-2`
    *   `margin-bottom: 8px;` -> `mb-2`
*   **Grid System**:
    *   `col-xs-*` no longer exists. Use `col-*` (e.g., `col-xs-6` becomes `col-6`).
*   **Forms**:
    *   `control-group` -> `mb-3`
    *   `control-label` -> `form-label`
    *   `input-block-level` -> `form-control`
*   **Buttons**:
    *   `btn-default` -> `btn-secondary` or `btn-outline-secondary`
    *   `btn-block` -> `w-100`
    *   `btn-large` -> `btn-lg`
    *   `btn-small` -> `btn-sm`
*   **Positioning**:
    *   `pull-right` -> `float-end`
    *   `pull-left` -> `float-start`
    *   `text-left` -> `text-start`
    *   `text-right` -> `text-end`
*   **Icons**:
    *   `glyphicon` is deprecated. Use FontAwesome (`fa fa-*`) if already loaded, or Bootstrap Icons (`bi bi-*`).

---

## 4. Backend / Shared Configuration Hooks

The shared modal system requires dynamic backend parameters to identify the calling broker/tenant.

1.  **`login.css`**: Define CSS variables to theme the shared modal to match the tenant.
    ```css
    :root {
        --color-primary: #009b4d;
        --modal-bg: #009b4d;
    }
    ```
2.  **`globalsetting.properties`**: Define the unique broker code.
    ```properties
    passportLoginBc=LkV69ZRVgax3i2sNLFQrGg==
    ```
3.  **`passport-login-bc.jsp`**: Create an endpoint that exposes this property to the frontend JS.
    ```jsp
    <%@ page import="com.n2n.login.config.N2NSession" %>
    <%@ page import="com.n2n.login.util.LoginUtil" %>
    <%
        response.setContentType("application/javascript");
        String bcValue = LoginUtil.getN2NSession2(application).getSetting("passportLoginBc");
        out.println("window.LOGIN_BC = '" + bcValue + "';");
    %>
    ```
4.  **`logout.jsp`**: Ensure logouts ping the central passport server via `fetch()` before terminating the local session and redirecting.

## 5. Typical Files Touched
*   `web/html/cliLogin.html`, `cliLoginActivate.html`, `cliLoginv2.html`, `cliAcctUpgrade.html` (Full MFA integration & BS5 upgrade)
*   `cliLoginH.jsp`, `cliLoginV.jsp`, `cliLoginLite.jsp` (Partial integration, usually injected via `out.println()`)
*   `main.jsp` (Inject MFA hooks for authenticated users to change PIN/Password)
*   Registration pages: `cliOpenAcctReg.html`, `cliCorpAcctReg.html`, `cliTrialAcctReg.html` (Library updates: jQuery, Validator, CryptoJS)