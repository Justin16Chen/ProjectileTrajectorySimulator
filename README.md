# BrainSTEM Offboard Shooting
link here:
https://brainstem-first.github.io/OffboardShooting/

## Overview
This is a website to create your own physics-based launcher capable of 
- shooting on the move
- accurate hood compensation for velocity drop on the shooter wheel

All of the physics calculations are done on this website to reduce strain on the robot code. The final product of this website is a series of JSON files containing trajectory data that the robot code uses. Specifically, the robot code runs a series of interpolated lookup tables on the trajectories this website will help you generate.

The physics inside this website models 3 forces: gravity, drag, and magnus (spin), and requires 3 tuned values:
1. shooter speed -> exit speed (meters per second) conversion
2. drag coefficient
3. magnus coefficient

## Tuning process
### Recording videos
1. Record 5-10 videos of robot shooting balls
   - Camera should face perpendicular to trajectory of ball to minimize perspective distortion
   - Lay meterstick parallel to exit position of ball (needed later)
   - Make sure to vary shooter speed and hood angle in recordings. Record at the highest FPS possible for best results and easiest tuning
   - Some of these videos will go to tuning the 3 values, some will go to validate the 3 values to make sure they are accurate
   - Make sure camera is static throughout the duration of the video. If not, it will be impossible to tune you drag and magnus coefficients
### Tuning shooter speed -> exit speed conversion
2. Upload the videos into the OffboardShooting website
3. Go through the videos frame-by-frame and plot the positions of the balls
4. Drag the virtual yellow meterstick and match it with the meterstick in the video
5. Go to System Identification -> Empirical Testing. Specify the FPS of your video there
6. Use the exit speed calculated to create regression to convert shooter speed to exit speed (will need data from multiple videos)
   - exit speed calculation finds the pixel distance between the first two points plotted
   - then converts pixel to meters using meterstick
   - then divides distance by time passed calculated using FPS
### Tuning drag and magnus coefficients
5. Go to System Identification -> Simulation
6. Specify a launch point (tab on right)
7. Click show simulation
   - If it is greyed out, look at the instructions below the button to find what you still need to do
8. Specify the exit speed and exit angle of the trajectory
9. Tune drag and magnus coeffients until simulation trajectory matches points plotted in video
10. Repeat for at least 3 videos, take the average drag and magnus coefficients
   - Validate your drag and magnus coefficients by plotting points for a new trajectory, use your existing coefficients, and see how close it is
### Generating trajectories
11. Go to Trajectory Generation
12. In the left panel, specify:
   - Range of distance you will be shooting from
   - Height offset from the goal to your exit position
   - ### IMPORTANT this is not the height of the goal. It is the height of the goal - height of your exit position
   - Existing drag and magnus coefficients
   - Exit Angle, Impact Angle, and Exit speed sliders
   - Step sizes for angle and velocity (smaller step sizes give you more trajectories)
13. Click Generate Trajectories
### Refining and exporting trajectories
14. The right panel shows all generated trajectories. Each tab shows all the trajectories corresponding to a certain goal. You can copy, refine, delete, or manually add trajectories. Sometimes there will be gaps in the generated trajectories. You may either regenerate them with smaller step sizes for velocity, or manually add in the missing ones. 
15. Once you are satisfied, click download all trajectories, and it will download a series of JSON files. Each JSON file contains info for all the trajectories corresponding to a certain goal

## Styling and theming

All visual styling is centralized in two files. Nothing else in the codebase should
contain a colour.

| File | What it holds |
| --- | --- |
| `src/index.css` | The raw values — every colour in the app, as RGB channels, once per theme (`:root` = light, `html.dark` = dark). |
| `tailwind.config.js` | Maps semantic token names (`surface`, `edge`, `content`, `accent`, `positive`…) onto those variables, plus font stacks and elevation. |
| `src/styles/theme.ts` | The style guide: named, categorized class strings for every kind of UI element, plus the colour constants canvas and chart code use. |

**To reskin the app**, change the channels in `src/index.css` and the mirrored
`plotColors` / `plotColorsDark` constants in `theme.ts`. Nothing else.

### Light and dark

There are two themes, `Slate` and `Slate Night`, toggled by the sun/moon button
beside the wordmark. The choice persists to `localStorage` and defaults to the OS
setting; a small script in `index.html` applies it before first paint so a dark
reload never flashes white.

Because every token resolves through a CSS variable, **components need no dark
variants** — no `dark:` classes anywhere. Two things are deliberately exempt:

- `stage` is true black in both themes. The video is letterboxed with
  `object-contain`, so that colour fills the bars beside the footage and has to
  read as "outside the frame".
- The `video-*` tokens (used by `chrome.onVideoLabel` and mirrored in
  `videoOverlayColors`) are identical in both themes, because their backdrop is
  footage — it doesn't lighten when the app does.

Canvas code can't read a class, so it calls `plotPalette(useThemeMode())` and
must list the result in its draw dependencies, or a toggle won't repaint it.

**To build a new UI element**, import its category from `theme.ts`:

```tsx
import { text, button, input, control } from '../styles/theme';

<h3 className={text.subsectionTitle}>Physics model</h3>
<input className={input.numeric} />
<button className={`${button.primary} ${button.block}`}>Generate</button>
```

The categories are `layout`, `text`, `button`, `input`, `control` (checkboxes,
segmented toggles, sliders), `tab`, `list`, `table`, `badge`, `overlay`, `feedback`,
`chrome`, and `brand`. Stateful ones are functions — `tab.pane(isActive)`,
`table.row('invalid')`.

**Rules of thumb** (the full version is the header comment in `theme.ts`):

- Reuse the closest existing entry rather than adding a near-duplicate. A ninth
  slightly-different grey is a bug, not a style.
- If genuinely nothing fits, add a named entry to the right category with a comment
  saying when to pick it over its siblings.
- Colours come from `tailwind.config.js` only. Use semantic names (`caution`) rather
  than palette names (`amber-500`).
- Status colour is `positive` / `caution` / `critical`. Never use the accent to mean
  something.
- The video stage is the one intentional black, because the video is letterboxed and
  those bars must read as "outside the footage". Before a video is loaded, that area
  is an ordinary light empty state.

## Helpful Tips
To fill in missing trajectories, simply copy an existing one, edit the exit angle, then hover over the trajectory and click the refine icon (looks like a repeat icon) to the right. This will automatically adjust the trajectory to accurately hit the goal.  

When refining trajectories, you may choose to keep either the angle or the speed of the trajectory constant. Normally you would keep angle constant.
By default the Threshold for trajectory accuracy is 0.001 meters (1 mm). You may change this to be more or less accurate to your preference
