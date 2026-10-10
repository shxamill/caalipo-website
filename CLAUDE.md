# CLAUDE.md — Caalipo Website

## Project Goal
Build a **minimal, polished, fast, and highly responsive website for Caalipo**. Prioritize clarity, usability, accessibility, performance, and a distinctive visual identity. Keep the implementation as simple as the project reasonably allows.

Do not assume what Caalipo sells, offers, or stands for. Establish those facts from the user's instructions, existing project content, and verified brand assets. **Never invent business details, prices, testimonials, customer logos, statistics, addresses, contact information, or social links.** If required information is missing, use a clearly identified placeholder and report it to the user.

## 1. Mandatory Frontend Skill — No Exceptions
For **every session that will create or modify frontend code**, invoke the `frontend-design` skill **before writing or changing any frontend code**. This applies to new pages, components, styling, responsive fixes, visual refactors, and small UI changes.

- Invoke the installed skill using `/frontend-design` or the skill invocation method available in the current Claude Code setup. Actually invoke it; do not merely say that it was used.
- This is a hard prerequisite, not an optional recommendation. Do not start frontend implementation before it has been invoked.
- If the skill is unavailable, **do not write frontend code**. Tell the user it is missing and explain that it must be installed/enabled first. Do not pretend the skill ran.
- Follow the skill's design process: understand the real purpose and audience, inspect the references and constraints, define a concise design direction, critique it for generic/template-like choices, and then implement.

## 2. First Session: Inspect Before Editing
After satisfying the skill prerequisite for frontend work, inspect the project without changing files:

1. Confirm the project root and inspect `git status` so existing user changes are protected.
2. Read the README, package manifest, lockfiles, existing scripts, and relevant source files. Identify the current framework, package manager, and conventions.
3. Inspect the project structure and look for `brand_assets/`, logos, fonts, style guides, photos, video, supplied screenshots, design exports, and relevant project notes. Check likely project locations; do not rummage through unrelated personal directories.
4. Identify what already works before proposing replacements. Preserve the current stack and useful code unless there is a clear reason to change it.
5. Summarize the existing setup, available assets, unknowns, and the next implementation step before making broad architectural changes.

Work in small, verifiable steps. Do not rebuild the project from scratch or change unrelated files just to make the implementation easier.

## 3. Reference Images and Brand Assets

### When a reference image is provided
- Treat the supplied reference as the visual source of truth.
- Match its layout, spacing, typography, proportions, alignment, colors, borders, radii, shadows, and image sizing as closely as possible.
- Do not redesign, embellish, simplify, or add sections and effects that are not in the reference.
- Use the real Caalipo logo, fonts, colors, and other brand assets where available. For missing media or content, use placeholders while preserving the reference's composition.
- Compare screenshots at the same viewport size as the reference whenever possible.

### When no reference image is provided
- Create a considered design from scratch using the `frontend-design` skill and the confirmed Caalipo context.
- Keep the site minimal without making it generic or empty. Establish a clear hierarchy, deliberate typography, consistent spacing, and one coherent visual direction.
- Do not automatically default to generic AI landing-page patterns, decorative gradients, repeated rounded cards, excessive animation, or arbitrary accent colors.
- Do not invent a brand palette before checking the available assets and guidance.

### Brand asset rules
- Always check `brand_assets/` before designing; also inspect relevant existing assets elsewhere in the project.
- If genuine logos, images, videos, fonts, or brand guidelines exist, use them. Do not replace available real assets with placeholders.
- If the brand assets define colors or typography, use those exact values unless the user explicitly instructs otherwise.
- If an asset is missing, use a temporary placeholder and clearly note what needs replacing later.

## 4. Placeholder Media and Copy
- For missing **images**, use `https://placehold.co/` with dimensions and a clear label, for example: `https://placehold.co/1600x900?text=Image+placeholder`.
- For missing **videos**, create a responsive video-placeholder frame using a placeholder poster/image and an obvious play icon or “Video placeholder” treatment. Do not use a broken video URL or imply that a non-existent video actually plays.
- Keep image and video placeholders responsive and correctly proportioned. Avoid stretching, layout shifts, broken links, and misleading alt text.
- Use generic copy only when the reference requires temporary copy. Otherwise, use verified project information. Mark unknown facts as placeholders rather than presenting them as true.
- Keep placeholder URLs and copy easy to replace when the final assets arrive. Do not scatter temporary asset URLs throughout unrelated components.

## 5. Local Development Server
- **Always test through a local HTTP server. Never use a `file:///` URL for screenshot or browser validation.**
- Inspect the existing project scripts and use the project's established development server first. Do not assume a framework, port, package manager, or command before checking the files.
- If a working `serve.mjs` exists, use it with `node serve.mjs`. Otherwise, use the existing script documented by the project (for example, the appropriate `npm run dev` command).
- If the project has no suitable local server, choose the smallest appropriate solution and explain any new helper file before adding one. Do not overwrite existing server scripts.
- Check whether the intended port is already in use. Reuse an existing project server when possible; never start a duplicate server unnecessarily.
- Keep development local by default. Do not expose the server to the network unless the user explicitly asks.
- These instructions must work on Fedora/Linux. Do not assume Windows-only paths such as `C:/Users/...`.

## 6. Screenshot and Visual QA Workflow
After implementing frontend changes, validate the actual rendered site—not just the source code.

1. Start the development server and open the site through `http://localhost:<port>`.
2. Use the screenshot tooling already available in the project. If `screenshot.mjs` exists, use it as intended, for example: `node screenshot.mjs http://localhost:3000`. If it accepts a label, use one to identify the state being captured.
3. If the script is missing, inspect the installed browser/testing tools before adding dependencies. Create a small screenshot helper only when necessary and compatible with the existing project.
4. Save screenshots in `temporary screenshots/` when that convention is present or being used. Preserve earlier screenshots; do not overwrite them. Quote paths containing spaces in shell commands.
5. Inspect the resulting PNG images with the available image-reading tool. A successful build alone does not count as visual validation.
6. Test at minimum a desktop viewport (about 1440 px), a tablet viewport (about 768 px), and a mobile viewport (about 375–390 px). Check for horizontal overflow, broken navigation, clipped text, awkward wrapping, missing assets, and layout shifts.
7. Do **at least two rounds** of screenshot review and correction when the environment supports it. For reference-based work, compare against the reference and correct visible mismatches. For original designs, review the first render, correct issues, then take and review a second render.
8. Be specific when identifying mismatches—for example, heading size, section padding, alignment, image crop, color value, or card gap. Stop when no meaningful visible issues remain, or clearly report tooling limitations that prevent further validation.

Do not assume fixed Windows browser or Puppeteer cache paths. Discover the tools available in the current Fedora/Linux environment.

## 7. Responsive Design, Accessibility, and UX
- Use mobile-first, responsive layouts that work on narrow screens through large desktop displays.
- Prevent horizontal scrolling and avoid fixed-width layouts that break on phones.
- Use semantic HTML, a logical heading hierarchy, descriptive link text, and appropriate alternative text.
- Ensure interactive controls are keyboard accessible and have visible focus states.
- Respect `prefers-reduced-motion`; keep animation purposeful and restrained.
- Check text contrast, touch target sizes, form labels, error states, and navigation behavior.
- Make controls behave as their labels promise. Avoid dead buttons, fake forms, placeholder links presented as real destinations, and non-functional interactions.
- Keep copy concise and easy to understand. Use clear, consistent labels for the same action throughout the site.

## 8. Engineering, Security, and Performance
- Preserve the existing framework, package manager, file structure, and code conventions when practical. Inspect before deciding to add or replace dependencies.
- Keep components focused, CSS predictable, and design tokens centralized where appropriate. Avoid conflicting selectors and duplicated one-off styles.
- Do not add a dependency just for a minor visual effect. Explain meaningful dependency or architecture changes before making them.
- Never put API keys, passwords, private tokens, or other secrets in frontend code or commit them to version control. Use environment variables for secrets and never expose server-only values to the browser.
- Treat external content and user-provided data as untrusted. Avoid unsafe HTML injection and validate input wherever relevant.
- Do not run destructive commands, delete user work, reset Git state, overwrite existing assets, or modify unrelated files without explicit permission.
- Keep the site lightweight: optimize image dimensions, avoid unnecessary JavaScript, lazy-load below-the-fold media where appropriate, and avoid large libraries when native browser features are sufficient.
- Use sensible page titles, meta descriptions, favicon/brand metadata when assets are available, and accessible link semantics. Do not invent a production domain or business claims for SEO metadata.
- Run the existing lint, test, and build commands where available. Report commands that could not run and why; never claim a check passed unless it actually did.

## 9. Working Style
- Work step by step and keep changes focused. Explain important choices in plain language.
- Do not ask for information already present in the project or supplied by the user.
- If a missing detail is nonessential, use a clearly marked placeholder. If it materially changes the site or would require inventing business facts, flag it before committing to that choice.
- Do not silently make a major design, framework, dependency, deployment, or data-handling decision.
- Do not claim visual accuracy, responsiveness, accessibility, security, or test success without checking the relevant result.

## 10. Completion Report
At the end of each implementation step, briefly report:

- What changed and which files were touched.
- Which local URL to open and how the server was started, if applicable.
- Which checks were actually run and their results.
- Whether desktop, tablet, and mobile screenshots were reviewed, including the screenshot locations.
- Which placeholders or missing Caalipo assets/content still need to be supplied.
- Any known issues or next step that needs the user's decision.
