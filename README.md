# PsyChing

PsyChing is a personality hexagram web app that combines modern psychological-questionnaire ideas with an I Ching interpretation framework.

Psyching 是一个将现代心理测量问卷思路与周易人格卦象解释框架结合起来的网页应用。

## V2.0.1 Update

- Added `Life Review / 人生回溯`, which guides users to answer as their past self from five years ago and compares that result with the present result.
- Added `Future Guide / 未来指引`, which guides users to answer as their ideal self five years in the future and compares that result with the present result.
- Improved result-page localization and cleaned up several mixed Chinese/English display issues.
- Polished several UI details, including the time-comparison presentation and historical result viewing flow.
- `Psyching V2.0.1` is currently a testing release. Reliability, validity, and item-parameter tuning will be evaluated and refined in a later empirical phase.

## Features

- Adaptive personality assessment flow
- I Ching hexagram-based personality interpretation
- Bilingual Chinese/English interface
- Local history storage and result review
- Time-perspective journeys for past and future self comparison

## Tech Stack

- React
- TypeScript
- Vite
- Zustand
- React Router
- Tailwind CSS

## Quick Start

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Notes

- This project is currently in a feature-validation stage rather than a completed psychometric-validation stage.
- The current item coefficients are heuristic and will be tuned later with empirical data.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT
