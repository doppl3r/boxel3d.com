class App {
    constructor() {
        var a = this;
        a.window = window;
        a.document = document;
        a.BOX_SIZE = 32;
        a.engine = Matter.Engine.create();
        a.screenWidth = a.window.innerWidth;
        a.screenHeight = a.window.innerHeight;
        a.quality = 10; // 1=low, 10=high
        a.targetFPS = 60;
        a.interval = 1000 / a.targetFPS;
        a.then = new Date().getTime();
        a.now = a.then;
        a.delta = 0;
        a.play = true;
        a.renderer = new THREE.WebGLRenderer({ antialias: true });
        a.camera = new THREE.PerspectiveCamera(75, a.screenWidth / a.screenHeight, 1, 1000);
        a.scene = new THREE.Scene();
        a.light = new THREE.HemisphereLight('#ffffff', 1);

        // Add lighting
        a.light.position.set(0, 0, 1);
        a.scene.add(a.light);

        // Update scene settings
        a.renderer.setSize(a.screenWidth, a.screenHeight);
        a.renderer.setPixelRatio(a.window.devicePixelRatio / (10 / a.quality));
        a.renderer.powerPreference = 'high-performance';
        a.scene.background = new THREE.Color('#f8d4de');
        a.camera.position.x = 0;
        a.camera.position.y = 0;
        a.camera.position.z = 200;
        a.document.body.appendChild(a.renderer.domElement);

        // Add player
        a.player = new Player({ x: 0, y: 0, z: 0 });
        Matter.World.add(a.engine.world, a.player.rectangle);
        a.scene.add(a.player);

        // Add event listeners and render app
        a.window.addEventListener('resize', function(e) { a.resizeWindow(e, a); });
        a.update(null, a);
        a.render(null, a);
    }

    render = function(e, a) {
        a.now = new Date().getTime();
        a.delta = a.now - a.then;
        if (a.delta > a.interval) {
            // Update if play is true
            if (a.play == true) {
                a.update(null, a);
                Matter.Engine.update(a.engine);
            }
            a.then = a.now - (a.delta % a.interval);
        }
        a.renderer.render(a.scene, a.camera);
        requestAnimationFrame(function(e) { a.render(e, a); });
    }

    update = function(e, a) {
        Matter.Body.setAngularVelocity(a.player.rectangle, 0.0015);
        a.camera.position.x = a.player.position.x;
        a.camera.position.y = a.player.position.y + 100;
        a.camera.lookAt(a.player.position.x, a.player.position.y, a.player.position.z);
        for (var i = 0; i < a.scene.children.length; i++) {
            var child = a.scene.children[i];
            if (child.rectangle != null) {
                var rect = child.rectangle;
                var z = rect.angle;
                child.setRotation(-z, false);
            }
        }
    }

    resizeWindow = function(e, a) {
        var screenWidth = a.window.innerWidth;
        var screenHeight = a.window.innerHeight;
        a.camera.aspect = screenWidth / screenHeight;
        a.camera.updateProjectionMatrix();
        a.renderer.setSize(screenWidth, screenHeight);
    }
}
var app = new App();