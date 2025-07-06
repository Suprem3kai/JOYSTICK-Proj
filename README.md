Virtual Joystick UI
A lightweight, browser-based joystick control built with HTML, CSS, and JavaScript. It provides real-time directional input and a sensitivity slider to fine-tune responsiveness. Perfect for games, simulations, or interactive demos on desktop and mobile browsers.

Features
Customizable joystick knob and base styles

Real-time X/Y coordinate output

Sensitivity slider for input scaling

Touch and mouse support

Responsive layout for various screen sizes

Live Demo
Open index.html in any modern browser to try the joystick and adjust sensitivity on the fly.

Installation
Clone this repository

Navigate into the project folder

Open index.html in your browser

Usage
Include style.css and script.js alongside your HTML file

Add the <div id="joystick"></div> markup where you want the control

Initialize in JavaScript:

js
const joystick = new VirtualJoystick({
  container: document.getElementById('joystick'),
  sensitivity: 0.5
});
joystick.onMove((x, y) => {
  // handle input values
});
Adjust the sensitivity slider below the joystick to change response curve

File Structure
File	Description
index.html	Demo page with markup
style.css	Styles for joystick and slider
script.js	Core joystick logic and event hooks
README.md	Project overview and usage guide
Customization
Modify CSS variables in style.css to change colors, sizes, or transitions.

Tweak initial sensitivity value when initializing.

Extend script.js event hooks to integrate with your game engine or UI framework.

Roadmap
Multi-touch support for dual joysticks

Haptic feedback integration on mobile devices

Publish as an npm package for easy installation

Add unit tests and TypeScript definitions

Contributing
Contributions, issues, and feature requests are welcome. Please fork the repo and submit a pull request with a clear description of changes.
