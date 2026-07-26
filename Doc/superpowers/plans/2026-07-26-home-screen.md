# Water Reminder Home Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first Lite Wearable home screen for viewing today’s water progress and adding the default amount.

**Architecture:** Keep the page self-contained in the existing `index` HML/CSS/JS files. JavaScript owns numeric state and a short-lived visual feedback flag; HML binds only presentation; CSS positions the circular safe-area layout and water-cup layers.

**Tech Stack:** HML, Lite Wearable CSS, JavaScript, local PNG media.

## Global Constraints

- Target HUAWEI WATCH GT4 466 × 466 circular display.
- Use only HML, CSS, JavaScript and local media; do not introduce frameworks or network resources.
- Implement only the home page in this change.
- Do not use continuous animation, timers, or unverified system APIs.
- Keep essential content inside the circular safe area.

---

### Task 1: Home-page state and interaction

**Files:**
- Modify: `entry/src/main/js/MainAbility/pages/index/index.js`
- Test: manual event/state verification in the Lite Wearable preview.

**Interfaces:**
- Produces: `onAddWater`, `onOpenHistory`, `onOpenSettings`, and template-bound state including `totalMl`, `targetMl`, `progressText`, and `isWaterMoving`.

- [ ] **Step 1: Define the expected interaction**

Clicking `+200 mL` changes `1200 / 2000 mL` to `1400 / 2000 mL`, updates progress from `60%` to `70%`, and applies a short visual water-movement class.

- [ ] **Step 2: Implement minimal page state**

Use named constants for the default amount and goal; cap displayed progress at 100%; clear only the short visual feedback state after its transition completes.

- [ ] **Step 3: Verify page JavaScript syntax**

Run: `node --check entry/src/main/js/MainAbility/pages/index/index.js`

Expected: successful syntax check.

### Task 2: Circular home-page layout

**Files:**
- Modify: `entry/src/main/js/MainAbility/pages/index/index.hml`
- Modify: `entry/src/main/js/MainAbility/pages/index/index.css`

**Interfaces:**
- Consumes: state and handlers from Task 1.
- Produces: progress summary, water-cup layers, primary action, and record/settings entries.

- [ ] **Step 1: Build semantic HML**

Render a title, progress text, a two-layer water cup, the `+200 mL` button, and local-image record/settings entries. Bind only existing state and events.

- [ ] **Step 2: Apply Lite Wearable-safe CSS**

Use fixed 466px dimensions, flex layout, explicit spacing, fixed border radii, and a single short transition for water feedback. Do not use filters, clip paths, grids, CSS variables, or infinite animation.

- [ ] **Step 3: Verify markup and styling review**

Check every local media reference exists, text remains within the 466px circular safe area, and the `+200 mL` touch target is at least 60px high.

### Task 3: Build verification

**Files:**
- Verify only: `entry/src/main/js/MainAbility/pages/index/*`

- [ ] **Step 1: Run the project build**

Run the available Hvigor build command.

- [ ] **Step 2: Report simulator and device checks**

Confirm layout safety, image rendering, tap feedback, and whether the short water feedback runs correctly on the simulator. GT4 device verification remains required for rendering and touch behavior.
