# Arena War Table UI/UX Repair Audit

Date: 2026-10-11

## Scope

This pass revisited the full planning and combat interface after the previous implementation missed the intended concepts. The audit covered the setup screen, commanders, top HUD, six-step command deck, hero and enemy selectors, animation, and the Plan, Clash, and Tactical views.

## Audit results

1. **Planning setup — Pass**
   - Reworked the screen as a cohesive War Council with stronger hierarchy, hero-and-army cards, doctrine and authority controls, readable labels, and a prominent arena entry action.
2. **General panels — Pass**
   - Expanded panels fit inside the battlefield at opposite corners. Collapsing removes the panel completely and leaves only the General portrait, compact health/resolve meter, and expand affordance.
3. **View modes — Pass**
   - Plan is a command-map composition with routes and orders; Clash is a cinematic action composition; Tactical is a lane-and-grid composition. These are structural view changes, not zoom presets.
4. **Top HUD and command deck — Pass with narrow-layout watch item**
   - The top HUD, objective, surge orb, authority control, and commit action were visually unified. The six-step deck is compact and uses distinct complete, current, and incomplete states. At the narrowest tested in-app viewport, step labels are intentionally compact.
5. **Heroes and enemies — Pass**
   - Hero and enemy actors are individually selectable, visually separated, and independently animated. Enemy-facing artwork is mirrored toward the allied side.
6. **Accessibility visual/interaction check — Pass**
   - Primary controls use touch-friendly targets, visible focus/selection states, larger labels, and reduced-motion support. This was a visual and interaction check, not a formal WCAG conformance audit.
7. **Build and behavior checks — Pass**
   - Production build passes. Combat tests pass 12/12. Sites packaging tests pass 4/4. Isolated formatting checks pass for the edited source files.

## Evidence

- `01-setup.jpg` — planning setup
- `02-plan-expanded-generals.jpg` — Plan view with both General panels expanded
- `03-clash-view.jpg` — Clash composition
- `04-tactical-view.jpg` — Tactical composition
- `05-collapsed-generals.jpg` — both General panels collapsed to portrait-only controls

## Verification notes

- The in-app browser capture surface remained approximately 610 × 575 despite viewport overrides, so the visual loop represents a narrow in-app viewport rather than a dedicated 390 px device or full desktop capture. Responsive rules for those breakpoints are implemented, but a separate physical-device/browser pass remains useful before release.
- The repository-wide `npm run check` is blocked before its test phase because Prettier attempts to read large unrelated APK/XAPK files under `APK/` and reports `Invalid string length`. The edited source files pass an isolated Prettier check.
