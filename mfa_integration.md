# MFA Integration Details

## Task 3: Verifying Bootstrap 5 usage
1. All login-related HTML pages (`cliLogin.html`, `cliLoginActivate.html`, `cliLoginv2.html`, `cliAcctUpgrade.html`) have been successfully updated to use `bootstrap-5.3.6.bundle.min.js` and `bootstrap-5.3.6.min.css`.
2. The login script sequence is properly injected.

## Task 4: Bootstrap v3 to v5 Migration Checklist
The following files need to have their CSS components manually upgraded. This is a manual migration requirement to prevent automated tools from breaking custom layouts.

- [ ] `web/html/withdrawal.html`
- [ ] `web/html/stocklist2.html`
- [ ] `web/html/stocklist.html`
- [ ] `web/html/sipsta2.html`
- [ ] `web/html/sipsta.html`
- [ ] `web/html/sipbuy2.html`
- [ ] `web/html/sipbuy.html`
- [ ] `web/html/sipadd2.html`
- [ ] `web/html/sipadd.html`
- [ ] `web/html/rptMthStmt.html`
- [ ] `web/html/rptInv.html`
- [ ] `web/html/ClientSummReport.html`
- [ ] `web/eRights/eRightsStatus.html`
- [ ] `web/eRights/ERights.html`
- [ ] `web/html/caSubscription.html`
- [ ] `web/html/caStatus.html`

### Migration Syntax Notes
When manually converting these pages from v3 to v5, check for:
1. **Modals**: `data-toggle` -> `data-bs-toggle`, `data-dismiss` -> `data-bs-dismiss`.
2. **Dropdowns & Tooltips**: `data-toggle` -> `data-bs-toggle`.
3. **Buttons**: `btn-default` -> `btn-secondary` or `btn-outline-secondary`.
4. **Grid System**: Remove `-xs-` from columns. e.g. `col-xs-6` -> `col-6`.
5. **Alignment**: `pull-right` -> `float-end`, `text-right` -> `text-end`.
6. **Icons**: Replace `glyphicon` with `bi bi-*` or `fa fa-*`.
7. **Utilities**: `hidden-xs` -> `d-none d-sm-block`.