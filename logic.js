///Making a joystick for Arduino
onload = function() {
    var canvas = document.getElementById("canvas");
    var sensitivitySlider = document.getElementById("sensitivitySlider");
    var sensitivityValue = document.getElementById("sensitivityValue");

    var wdth = innerWidth;
    var hght = innerHeight;

    ///Joystick configuration - positioned at bottom center with 25px padding
    var j1_centerX = wdth / 2; ///Horizontal center
    var j1_centerY = hght - 75 ; ///Bottom with 25px padding + radius
    var j2_centerX = wdth / 2;
    var j2_centerY = hght - 75 ;
    var j1_radius = 50; ///J1 is outer part of joystick
    var j2_radius = 25; ///J2 is inner part of joystick
    var joy_Touching = false; ///This is true when the joystick is being touched
    var angle = 0;

    ///Cube configuration
    var cubeSize = 30; ///Size of the controllable cube
    var cubeX = wdth / 2; ///Initial cube X position (center of screen)
    var cubeY = hght / 2; ///Initial cube Y position (center of screen)
    var baseCubeSpeed = 3; ///Base movement speed (will be multiplied by sensitivity)
    var sensitivity = 50; ///Default sensitivity value (1-100)

    ///Initialize sensitivity slider
    sensitivitySlider.value = sensitivity;
    sensitivityValue.textContent = sensitivity;

    ///Listen for sensitivity changes
    sensitivitySlider.addEventListener("input", function() {
        sensitivity = parseInt(sensitivitySlider.value);
        sensitivityValue.textContent = sensitivity;
    });

    interval = setInterval(draw, 50);

    ///Draw the joystick
    canvas.addEventListener("mousedown", joystickS);
    canvas.addEventListener("mouseup", reset_Joy);
    canvas.addEventListener("mousemove", joystickM);
    canvas.addEventListener("touchstart", function(e) {
        e.preventDefault();
        joystickS(e);
    });
    canvas.addEventListener("touchend", function(e) {
        e.preventDefault();
        reset_Joy();
    });
    canvas.addEventListener("touchmove", function(e) {
        e.preventDefault();
        joystickM(e);
    });

    function draw() {
        var c = canvas.getContext("2d");
        canvas.width = wdth;
        canvas.height = hght;
        
        ///Update dimensions if window resized
        wdth = innerWidth;
        hght = innerHeight;
        j1_centerX = wdth / 2; ///Keep joystick horizontally centered
        j1_centerY = hght - 25 - 50; ///Keep joystick at bottom with padding
        
        ///Clear canvas with transparent background
        c.clearRect(0, 0, canvas.width, canvas.height);

        ///Update cube position based on joystick input
        updateCubePosition();

        ///Draw the controllable cube
        drawCube(c);

        ///Draw outer joystick circle (always visible)
        c.beginPath();
        c.arc(j1_centerX, j1_centerY, j1_radius, 0, 2 * Math.PI);
        c.fillStyle = "rgba(255, 255, 255, 0.3)";
        c.fill();
        c.strokeStyle = "rgba(255, 255, 255, 0.6)";
        c.lineWidth = 2;
        c.stroke();

        ///Draw inner joystick knob
        c.beginPath();
        c.arc(j2_centerX, j2_centerY, j2_radius, 0, 2 * Math.PI);
        c.fillStyle = joy_Touching ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.7)";
        c.fill();
        c.strokeStyle = "rgba(255, 255, 255, 1)";
        c.lineWidth = 1;
        c.stroke();
    }

    ///Update cube position based on joystick displacement
    function updateCubePosition() {
        if (joy_Touching) {
            ///Calculate joystick displacement from center
            var deltaX = j2_centerX - j1_centerX;
            var deltaY = j2_centerY - j1_centerY;
            
            ///Normalize the displacement (0-1 range) based on joystick radius
            var normalizedX = deltaX / j1_radius;
            var normalizedY = deltaY / j1_radius;
            
            ///Calculate dynamic speed based on sensitivity (1-100 maps to 0.5-10 speed)
            var dynamicSpeed = baseCubeSpeed * (sensitivity * 0.5);
            
            ///Apply movement to cube position with dynamic speed multiplier
            cubeX += normalizedX * dynamicSpeed;
            cubeY += normalizedY * dynamicSpeed;
            
            ///Constrain cube to window boundaries
            cubeX = Math.max(cubeSize / 2, Math.min(wdth - cubeSize / 2, cubeX));
            cubeY = Math.max(cubeSize / 2, Math.min(hght - cubeSize / 2, cubeY));
        }
    }

    ///Draw the controllable cube on the canvas
    function drawCube(context) {
        context.fillStyle = "rgba(255, 100, 100, 0.8)"; ///Red cube color
        context.fillRect(
            cubeX - cubeSize / 2, ///Center the cube on its position
            cubeY - cubeSize / 2, 
            cubeSize, 
            cubeSize
        );
        
        ///Add a border to make the cube more visible
        context.strokeStyle = "rgba(255, 255, 255, 1)";
        context.lineWidth = 2;
        context.strokeRect(
            cubeX - cubeSize / 2,
            cubeY - cubeSize / 2,
            cubeSize,
            cubeSize
        );
    }

    function joystickS(e) {
        let rect = canvas.getBoundingClientRect();
        let px = (e.pageX || e.touches[0].pageX) - rect.left;
        let py = (e.pageY || e.touches[0].pageY) - rect.top;
        
        ///Check if touch is within joystick area
        let distance = Math.sqrt((px - j1_centerX) ** 2 + (py - j1_centerY) ** 2);
        if (distance <= j1_radius) {
            joy_Touching = true;
        }
    }

    function reset_Joy() {
        joy_Touching = false;
        angle = 0;
        ///Reset joystick knob to center when released
        j2_centerX = j1_centerX;
        j2_centerY = j1_centerY;
    }

    function joystickM(e){
        if(!joy_Touching) return;
        
        let rect = canvas.getBoundingClientRect();
        let px = (e.pageX || e.touches[0].pageX) - rect.left;
        let py = (e.pageY || e.touches[0].pageY) - rect.top;
        
        ///Calculate distance from center
        let dx = px - j1_centerX;
        let dy = py - j1_centerY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= j1_radius - j2_radius) {
            j2_centerX = px;
            j2_centerY = py;
        } else {
            ///Constrain to circle boundary
            let ratio = (j1_radius - j2_radius) / distance;
            j2_centerX = j1_centerX + dx * ratio;
            j2_centerY = j1_centerY + dy * ratio;
        }
        
        angle = calcAngleDegree(j2_centerX - j1_centerX, j2_centerY - j1_centerY);
    }

    function calcAngleDegree(x, y) {
        var angle = Math.atan2(y, x) * 180 / Math.PI; ///Convert radians to degrees
        if (angle < 0) {
            angle += 360; ///Make sure the angle is positive
        }
        return angle;
    }
}