# Agent Context (myhealth)

## Project Summary
A React Native (Expo) mobile app named **myhealth** for tracking daily physical activity. Core features include login gating, goal setting, streak tracking, daily suggestions, reminders, activity templates with detail views, team management, member ranking, points and challenges, and daily/detailed activity charts.

## Repo Location
Use `/Users/in22911941/Documents/myhealth` as the project root. The older folder name “New project” is not the current repo.

## Tech Stack
- React Native (Expo SDK 50)
- AsyncStorage for local persistence
- expo-notifications for reminders
- react-native-chart-kit + react-native-svg for charts

## Key Commands
- Install: `npm install`
- Start dev server: `npm run start`
- iOS build/run: `npm run ios`
- Android build/run: `npm run android`
- Web preview: `npm run web`

## App Structure
- `App.js`: main screen layout, state-based routing, auth gating
- `src/components/`: UI cards, login, navigation, headers, charts, templates, teams
- `src/modules/`: domain logic (e.g., teams)
- `src/data/`: templates and suggestion content
- `src/storage/`: AsyncStorage keys and team storage helpers
- `src/services/`: notifications setup and scheduling
- `src/utils/`: date helpers, activity/level utilities

## UX Layout Rules
- Login screen is shown on cold start until authenticated (mocked username/password or Google/Mobile buttons).
- Home tab shows: profile header, points from auto-captured activity, team challenges, daily activity graph, goal progress, streak, current template.
- My Activities tab shows: suggestions, “Open Template Library” CTA, goal/reminder cards.
- Activity Templates list is a separate screen with a “Create Your Own Template” CTA and a detail view per template.
- Teams tab shows: teams list, manager, members, ranking, daily/detailed charts.
- Team detail shows members with streak/points; member profile shows stats and achievements.
- Bottom nav: Home, My Activities, Teams, Menu (with icons) and stays visible across screens.
- Menu tab provides Settings, Privacy Policy, Share (placeholders).
- Team/member data is persisted locally only; backend comes later.

## Notes
- iOS simulator builds are handled via Expo prebuild and CocoaPods.
- Home daily activity graph uses mocked “auto-captured” 7‑day data; team charts use mocked/member data.
