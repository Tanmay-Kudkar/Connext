# Connext: Design

Direction: a Threads-inspired shell (text-first, calm, thin-line) extended with communities, outcome states and a Vibe / Pro identity switch. Modern, premium, and deliberately not "AI generic".

## 1. Principles

1. Content first. Posts are lines separated by hairlines, not stacked cards.
2. One accent colour, used rarely.
3. Hierarchy: the user always sees community, then post, then action.
4. Gamification is subtle: numbers and small moments, no loud HUD on the feed.
5. Specific over vibes: every token is named below.
6. Do not copy Threads branding. Own wordmark and mark.

## 2. Layout

### Desktop (>= 1100px), three columns
- **Left rail:** logo, Home, Communities, Ask, Map, Activity, Me, More.
- **Center feed:** about 600px wide.
- **Right rail (contextual):** daily quest and streak, suggested communities, Doubt Radar for staff.

### Tablet
Rail collapses to icons only. Right rail hidden.

### Mobile
Single column. Bottom nav: Home, Explore (communities + map), Ask (center), Activity, Me. No floating action button.

## 3. Design tokens (starting values)

### Colour
- Background light `#FAFAF8`, dark `#0A0A0A`
- Surface light `#FFFFFF`, dark `#121212`
- Text primary light `#111111`, dark `#F5F5F2`
- Text muted `#6B6B66` (light), `#9A9A94` (dark)
- Hairline `#E8E8E3` (light), `#242424` (dark)
- Accent (default, taste decision): vermilion `#FF4B2B`. Used for credits, primary action, resolved state. User can change accent in Vibe mode.
- Success `#1F9D55`, Warning `#B7791F`, Error `#D64545`

### Typography
- UI: Geist or Inter Tight
- Numbers (credits, XP, streak): Geist Mono or JetBrains Mono
- Body 15px / 1.45, small 13px, title 20px, display 28px
- Weights: 400 body, 600 names and headers

### Spacing, radius, motion
- Spacing scale 4 / 8 / 12 / 16 / 24 / 32
- Radius: Vibe 16-20px, Pro 8px
- Motion 150-200ms ease-out; only on votes, credit award, mode switch. Respect reduced motion.
- Icons: one set (Lucide or Phosphor Light), 1.5px stroke

## 4. Vibe vs Pro

Same layout, different tokens.
- **Vibe:** selectable accent, avatar frames and flair, larger radius, playful empty-state copy.
- **Pro:** neutral palette, smaller radius, department, publications and mock ResearchGate data surfaced, CV-style profile.
- Switch lives in the profile menu. Crossfade about 200ms. Users can also post "as Vibe / as Pro / anonymous".

## 5. First-time user flow

1. **Entry:** wordmark and "Ask without fear." Primary: Continue with college email. Secondary: GitHub, LinkedIn (demo), ResearchGate (demo).
2. **Verify:** college typeahead and OTP (mock ok). One line: "Verified, but you can post anonymously."
3. **Pick your face:** split live preview of Vibe and Pro, avatar or icon pack, handle.
4. **Join communities:** chips suggested by course and syllabus, skip allowed.
5. **Land in feed, no tour.** First quest "Ask or answer once" as a progress ring. LinkedIn/ResearchGate linking later via "Passport 40%" on profile.

## 6. Post anatomy

- Header: avatar, name, college badge, time.
- Community chip (for example r/DBMS).
- Body text and optional image.
- Actions: vote, reply, save, share.
- Outcome states: Open, Resolved, "Unblocked me" button for the asker, credits earned shown in mono.
- Anonymous posts show "Verified student" only. No college or branch.
- Replies: vertical connector line, collapsible, visual depth cap 4 then "Continue thread".

## 7. Key screens

- Home feed (joined communities plus recommended)
- Community page: header, channels (Q&A, Projects, Announcements, Chat), pinned rules, bot posts
- Thread view with nested comments
- Compose (post as Vibe / Pro / Anonymous, syllabus tag, similar-question suggestions)
- Profile (Vibe), Profile (Pro) and Academic Passport
- Dashboard under Me: XP, level, streak, quests, heatmap, badges, leaderboard
- Map: list-first with map toggle, opt-in, college/city clusters
- Mock LinkedIn and ResearchGate login/signup portals with a visible "Demo integration" label
- Staff: Doubt Radar

## 8. Gamification UI rules

- Streak flame in the top bar, small.
- Credits as a monospace number in profile and in award moments.
- Confetti only on the first credit.
- Level and badges live in the Me tab, not the feed.

## 9. States

- Empty: warm, one primary action. Example: "Nobody has asked in r/DBMS yet. Be first. Anonymous is on."
- Loading: skeleton lines, no spinners over content.
- Error: plain language, cause, and retry.
- Offline: banner with queued actions.
- Long text: truncate names with ellipsis, full name on tap.
- Zero results, first-time versus returning user variants.

## 10. Accessibility

- 4.5:1 contrast in light, dark and system themes
- 44px touch targets
- Visible focus rings and full keyboard navigation
- Screen-reader labels for icon buttons
- Reduced-motion variant

## 11. Anti "AI slop" rules

- No gradients, glass blur, glow, emoji headers, 3-column feature cards or stock illustrations.
- Real, human copy. No "revolutionizing education".
- Cards only where they earn their place (modals, popovers).
- One accent, one icon set, one type pair.

## 12. Open design decisions

- Accent colour (vermilion, ink blue or lime)
- Wordmark and logo mark
- Exact avatar and icon pack style
- Map: real map or cluster list
