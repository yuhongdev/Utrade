# MFA Integration Project Status

## Overall Progress
**Phase 1: Frontend Library & HTML Migration** (Completed)
**Phase 2: Backend Configuration & Shared Modals** (Completed)
**Phase 3: Integration Testing & Manual Migrations** (In Progress)

---

## What Is Done (Completed Tasks)
1. **jQuery Upgrades**: Successfully upgraded `jquery-3.6.0.js` references to `jquery-3.7.1.min.js`.
2. **jQuery Validator**: Upgraded references to `jquery.validate-1.22.0.min.js` across all registration files.
3. **CryptoJS Refactor**: Safely commented out legacy `aes.js` and `pbkdf2.js` logic and injected `crypto-js-4.2.0.min.js` while maintaining `AesUtil.js` backwards compatibility.
4. **Bootstrap 5 Injection**: Injected the Two-Track Bootstrap 5 bundle (`bootstrap-5.3.6.bundle.min.js` and `bootstrap-5.3.6.min.css`) alongside the legacy Bootstrap 3 files to support the MFA modal specifically on login HTML files.
5. **UI Trigger Migrations**: Swapped legacy `onclick` handlers for `openModalBtn` classes and added `data-type` properties to authentication elements (Login, Forgot PIN, etc.). Fixed the `<button type="submit">` bug causing page reloads.
6. **CSS Link Replacement**: Executed bulk replacement to change `bootstrap_v3.3.5.css` into `bootstrap-5.3.6.min.css` across 10 specific files (e.g. `withdrawal.html`, `sipbuy.html`).
7. **Knowledge Documentation**: Compiled and updated `mfa_upgrade_skill.md` with best-practices and critical bug fixes.
8. **Shared Modal CSS**: Defined `:root` variables for the shared modal (`--color-primary`, `--modal-bg`) inside `docker/gcUTRADEPlus/login/css/login.css`.
9. **Broker Context Exposure**: Created `passport-login-bc.jsp` to expose the `window.LOGIN_BC` property for the frontend JS.
10. **Backend Configuration**: Injected the `passportLoginBc` property into `WEB-INF/globalsetting.properties`.
11. **Logout Logic**: Overwrote `logout.jsp` and `cliLogout.jsp` to cleanly ping the passport server via `fetch('/srvs/v3/logout')` before executing legacy local redirects.
12. **JSMXD Config**: Extracted the raw JSON cryptographic keys from `key.jsp` into the new static `jsmxd.json`.
13. **Secondary JSP Injections**: Injected the BS5 CSS/JS sequence into `cliLoginH.jsp`, `cliLoginV.jsp`, `cliLoginLite.jsp`, and `main.jsp`. Re-routed all absolute `/passport/login/` paths to point locally to avoid 404 errors.
14. **Docker Implementation**: Rewrote the `Dockerfile` to respect case-sensitive directory paths (`PROD/gcUTRADE`), added `CATALINA_OPTS` JVM memory arguments to prevent `OutOfMemoryError` crashes, and generated a strict `.dockerignore` file.

---

## What To Do Next (Pending Tasks)
*The automated Phase 2 is complete. The following manual steps remain:*
1. **Manual HTML Bootstrap Migrations**: The user is currently manually handling the syntax migration of Bootstrap 3 classes to Bootstrap 5 classes inside the 10 specific HTML files (tracked in `mfa_integration.md`).
2. **Apply Broker Credential Token**: Manually insert the specific encrypted token value into the `passportLoginBc=` property inside `WEB-INF/globalsetting.properties`.
3. **Handle Hardcoded Backend Paths**: Currently, the legacy Java server crashes with `NullPointerException` on Windows because `globalsetting.properties` cannot be loaded. The Java code contains hardcoded Linux paths (`/usr/share/tomcat/webapps/...`). **Solution**: Either boot the project using the completed Docker container, or manually refactor the Java classes to use relative servlet context paths.
4. **AMBank Deployments**: If deploying to AMBank, remember that the `openModalBtn` triggers require an additional `data-typeam="e"` or `data-typeam="f"` attribute.

---

## ⚠️ Critical Precautions & Warnings
*   **DO NOT TOUCH `bootstrap.css`**: The original `docker/gcUTRADEPlus/web/css/bootstrap.css` is heavily customized with legacy overrides. Do not overwrite it with Bootstrap 5. Only replace the clean, unedited `bootstrap_v3.3.5.css` files.
*   **AVOID ABSOLUTE PASSPORT PATHS**: The frontend modal scripts in the `login/` folder should be mapped locally (e.g., `../../login/js/login-popup-bootstrap5.js`). Pointing them to `/passport/login/...` will cause 404 network abort errors if a standalone Passport container isn't running.
*   **NEVER USE `type="submit"` ON MODAL BUTTONS**: Triggering the MFA modal via a `<button type="submit">` inside a form will cause the browser to refresh and cancel the `fetch` request. Always change the button to `<button type="button">`.