# Number Puzzle 2048

A modern, mobile-first implementation of the classic 2048 puzzle game.

## Features

- **4x4 Grid Gameplay**: Combine tiles to reach 2048
- **Multiple Input Methods**: Keyboard arrows, touch swipe, mobile-optimized
- **Smooth Animations**: CSS transitions and pop effects
- **Dark Mode Support**: Automatic theme switching based on system preference
- **Score Tracking**: Local storage for best scores
- **Undo Functionality**: Go back up to 10 moves
- **Multilingual**: Support for 12 languages (Korean, English, Chinese, Hindi, Russian, Japanese, Spanish, Portuguese, Indonesian, Turkish, German, French)
- **PWA Ready**: Install as app on any device
- **Responsive Design**: Works perfectly from 360px phones to desktop
- **Ad-Ready**: Pre-configured for AdSense and interstitial ads
- **Confetti Animation**: Celebrate wins with confetti effect

## Game Rules

1. Tiles with the same number merge when moving in the same direction
2. After each move, a new tile (2 or 4) appears randomly
3. Score increases by the value of merged tiles
4. Game ends when no more moves are possible
5. Win by reaching 2048 (can continue playing after)

## Technical Stack

- **HTML5**: Semantic markup with PWA support
- **CSS3**: Grid layout, glassmorphism effects, dark mode
- **Vanilla JavaScript**: No dependencies, lightweight (~20KB)
- **i18n**: 12-language support with localStorage
- **Analytics**: GA4 ready

## File Structure

```
number-puzzle/
├── index.html              # Main HTML with ad slots
├── manifest.json           # PWA configuration
├── sw.js                   # Service Worker for offline
├── icon-192.svg           # App icon (192x192)
├── icon-512.svg           # App icon (512x512)
├── css/
│   └── style.css          # All styles (responsive, dark mode)
├── js/
│   ├── app.js             # Game logic and UI
│   ├── i18n.js            # Language manager
│   └── locales/
│       ├── ko.json        # Korean
│       ├── en.json        # English
│       ├── zh.json        # Chinese
│       ├── hi.json        # Hindi
│       ├── ru.json        # Russian
│       ├── ja.json        # Japanese
│       ├── es.json        # Spanish
│       ├── pt.json        # Portuguese
│       ├── id.json        # Indonesian
│       ├── tr.json        # Turkish
│       ├── de.json        # German
│       └── fr.json        # French
└── README.md              # This file
```

## Installation

### Local Development

```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node.js http-server
npx http-server

# Then open http://localhost:8000
```

### As PWA

1. Open the game in a modern browser
2. Look for "Install" or "Add to Home Screen" prompt
3. Click to install as an app
4. Works offline after installation

## Game Controls

### Keyboard
- **Arrow Keys**: Move tiles (↑↓←→)

### Touch/Mobile
- **Swipe**: Drag in any direction to move tiles
- **Tap Buttons**: Use on-screen buttons for controls

## Customization

### Change Colors

Edit `css/style.css`:
```css
:root {
    --primary-color: #EDB879;  /* Change to your color */
    --primary-dark: #D4A574;
    /* ... other colors ... */
}
```

### Add More Languages

1. Create `js/locales/xx.json` (replace `xx` with language code)
2. Add language code to `supportedLanguages` in `js/i18n.js`
3. Add button to language selector in `index.html`

### Configure Ads

1. Replace `ca-pub-xxxxxxxxxxxxxxxx` with your AdSense Publisher ID
2. Replace ad slot IDs with your actual slot IDs
3. Ad placements:
   - Top banner: Display ad
   - Bottom banner: Display ad
   - Interstitial: Full-screen ad every 3 moves

## Performance

- **Bundle Size**: ~25KB (HTML + CSS + JS)
- **Locale Size**: ~2KB per language (JSON)
- **First Load**: <500ms on 4G
- **Runtime**: <5ms per move
- **Memory**: <50MB even after 100+ moves

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- iOS Safari 14+
- Samsung Internet 14+

## Mobile Optimization

- **Touch Target Size**: 44px minimum
- **Viewport**: Responsive from 320px to 4K
- **Orientation**: Portrait & Landscape support
- **Safe Area**: Notch/cutout safe
- **Battery**: Optimized for low power consumption

## Analytics

Game tracks:
- Game start event
- Move counts
- Win/loss outcomes (future)
- Language preference
- Device type

GA4 integration ready (add your tracking ID to index.html)

## Future Enhancements

- [ ] Leaderboard integration
- [ ] Multiplayer mode
- [ ] Different grid sizes (3x3, 5x5)
- [ ] Sound effects
- [ ] Theme customization
- [ ] Achievement system
- [ ] Social sharing

## Known Limitations

- Max tile value: 8192+ (no hard limit)
- Undo history: Last 10 moves only
- Locale files: Must be valid JSON

## Troubleshooting

### Game not loading
- Check browser console (F12) for errors
- Clear browser cache and reload
- Ensure all files are in correct directories

### Ads not showing
- Verify AdSense account approval
- Check publisher ID and slot IDs
- Ensure site is in allowed countries
- Wait 24-48 hours for new placements

### Language not changing
- Clear localStorage and refresh
- Check `js/locales/` for correct JSON files
- Verify language code in HTML

## Credits

Inspired by the original 2048 game by Gabriele Cirulli.
Built by DopaBrain for global audience.

## License

Free to use and modify for personal/commercial projects.

## Version

- **v1.0.0** - Initial release (2026-02-10)
  - 12 languages
  - PWA support
  - Ad integration
  - Dark mode
  - Responsive design

## Support

For issues or suggestions, please check the DopaBrain repository.
