(function () {
	var Viv = function (container, width, height) {
		var factory = {};

		factory.oldContainerContent = null;
		factory.container = container;
		factory.scene = null;
		factory.renderer = null;
		factory.width = width || window.innerWidth;
		factory.height = height || window.innerHeight;
		factory.projector = null;
		factory.sun = null;

		factory.addToScene = AddToScene;


		factory.VIEW_ANGLE = 80;
		factory.NEAR = 0.1;
		factory.FAR = 10000;
		factory.CAMERA_X = 0;
		factory.CAMERA_Y = 800;
		factory.CAMERA_Z = 500;
		factory.CAMERA_LX = 0;
		factory.CAMERA_LY = 0;
		factory.CAMERA_LZ = 0;

		Initialize();

		return factory;

		function Initialize() {
			console.log('initializing threejs');
			InitializeThreeJs();
		}

		function InitializeThreeJs() {
			if (Detector.webgl) {
				factory.renderer = new THREE.WebGLRenderer({
					antialias: true
				});
				factory.renderer.setClearColor(0x181D21, 1);
			} else {
				factory.renderer = new THREE.CanvasRenderer();
			}

			factory.renderer.setSize(factory.width, factory.height);
			factory.container.html(factory.renderer.domElement);

			factory.projector = new THREE.Projector();

			// create a scene
			factory.scene = new THREE.Scene();

			// put a camera in the scene
			factory.camera = new THREE.PerspectiveCamera(
				factory.VIEW_ANGLE, factory.WIDTH / factory.HEIGHT,
				factory.NEAR, factory.FAR);
			factory.camera.position.x = factory.CAMERA_X;
			factory.camera.position.y = factory.CAMERA_Y;
			factory.camera.position.z = factory.CAMERA_Z;
			factory.camera.lookAt({ x: factory.CAMERA_LX, y: 0, z: factory.CAMERA_LZ });
			factory.scene.add(factory.camera);

			factory.sun = new THREE.DirectionalLight(0xffff55, 1);
			factory.sun.position.set(-600, 300, 600);
			factory.scene.add(factory.sun);
		}

		function AddToScene(mesh) {
			factory.scene.add(mesh);
		}
	}

	var viv = null;
})();

// $(function () {

// 	var worldMap;
// 	var mouse = { x: 0, y: 0 }
// 	var worldTime = 0;

// 	function Map() {

// 		this.WIDTH = window.innerWidth;
// 		this.HEIGHT = window.innerHeight;

// 		this.VIEW_ANGLE = 80;
// 		this.NEAR = 0.1;
// 		this.FAR = 10000;
// 		this.CAMERA_X = 0;
// 		this.CAMERA_Y = 800;
// 		this.CAMERA_Z = 500;
// 		this.CAMERA_LX = 0;
// 		this.CAMERA_LY = 0;
// 		this.CAMERA_LZ = 0;

// 		this.geo;
// 		this.scene = {};
// 		this.renderer = {};
// 		this.projector = {};
// 		this.camera = {};
// 		this.stage = {};

// 		this.INTERSECTED = null;
// 	}

// 	Map.prototype = {

// 		init_d3: function () {

// 			geoConfig = function () {

// 				this.mercator = d3.geo.equirectangular();
// 				this.path = d3.geo.path().projection(this.mercator);

// 				var translate = this.mercator.translate();
// 				translate[0] = 450;
// 				translate[1] = 0;

// 				this.mercator.translate(translate);
// 				this.mercator.scale(200);
// 			}

// 			this.geo = new geoConfig();
// 		},

// 		init_tree: function () {

// 			if (Detector.webgl) {
// 				this.renderer = new THREE.WebGLRenderer({
// 					antialias: true
// 				});
// 				this.renderer.setClearColor(0x181D21, 1);
// 			} else {
// 				this.renderer = new THREE.CanvasRenderer();
// 			}

// 			this.renderer.setSize(this.WIDTH, this.HEIGHT);

// 			this.projector = new THREE.Projector();

// 			// append renderer to dom element
// 			$("#worldmap").append(this.renderer.domElement);

// 			// create a scene
// 			this.scene = new THREE.Scene();

// 			// put a camera in the scene
// 			this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.WIDTH / this.HEIGHT, this.NEAR, this.FAR);
// 			this.camera.position.x = this.CAMERA_X;
// 			this.camera.position.y = this.CAMERA_Y;
// 			this.camera.position.z = this.CAMERA_Z;
// 			this.camera.lookAt({ x: this.CAMERA_LX, y: 0, z: this.CAMERA_LZ });
// 			this.scene.add(this.camera);
// 		},


// 		add_light: function (x, y, z, intensity, color) {
// 			var pointLight = new THREE.PointLight(color);
// 			pointLight.position.x = x;
// 			pointLight.position.y = y;
// 			pointLight.position.z = z;
// 			pointLight.intensity = intensity;
// 			this.scene.add(pointLight);
// 			return pointLight;
// 		},

// 		add_plain: function (x, y, z, color) {
// 			var planeGeo = new THREE.CubeGeometry(x, y, z);
// 			var planeMat = new THREE.MeshLambertMaterial({ color: color });
// 			var plane = new THREE.Mesh(planeGeo, planeMat);

// 			// rotate it to correct position
// 			plane.rotation.x = -Math.PI / 2;
// 			this.scene.add(plane);
// 		},

// 		add_countries: function (data) {

// 			var countries = [];
// 			var i, j;

// 			// convert to threejs meshes
// 			for (i = 0; i < data.features.length; i++) {
// 				var geoFeature = data.features[i];
// 				var properties = geoFeature.properties;
// 				var feature = this.geo.path(geoFeature);

// 				// we only need to convert it to a three.js path
// 				var mesh = transformSVGPathExposed(feature);

// 				// add to array
// 				for (j = 0; j < mesh.length; j++) {
// 					countries.push({ "data": properties, "mesh": mesh[j] });
// 				}
// 			}

// 			// extrude paths and add color
// 			for (i = 0; i < countries.length; i++) {

// 				// create material color based on average		
// 				var material = new THREE.MeshPhongMaterial({
// 					color: this.getCountryColor(countries[i].data),
// 					opacity: 0.5
// 				});

// 				// extrude mesh
// 				var shape3d = countries[i].mesh.extrude({
// 					amount: 1,
// 					bevelEnabled: false
// 				});

// 				// create a mesh based on material and extruded shape
// 				var toAdd = new THREE.Mesh(shape3d, material);

// 				//set name of mesh
// 				toAdd.name = countries[i].data.name;

// 				// rotate and position the elements
// 				toAdd.rotation.x = Math.PI / 2;
// 				toAdd.translateX(-490);
// 				toAdd.translateZ(50);
// 				toAdd.translateY(20);

// 				// add to scene
// 				this.scene.add(toAdd);
// 			}
// 		},

// 		getCountryColor: function (data) {
// 			var multiplier = 0;

// 			for (i = 0; i < 3; i++) {
// 				multiplier += data.iso_a3.charCodeAt(i);
// 			}

// 			multiplier = (1.0 / 366) * multiplier;
// 			// return multiplier*0xffffff;
// 			return 0x91a5ad
// 		},

// 		setCameraPosition: function (x, y, z, lx, lz) {
// 			this.CAMERA_X = x;
// 			this.CAMERA_Y = y;
// 			this.CAMERA_Z = z;
// 			this.CAMERA_LX = lx;
// 			this.CAMERA_LZ = lz;
// 		},

// 		moveCamera: function () {
// 			var speed = 0.2;
// 			var target_x = (this.CAMERA_X - this.camera.position.x) * speed;
// 			var target_y = (this.CAMERA_Y - this.camera.position.y) * speed;
// 			var target_z = (this.CAMERA_Z - this.camera.position.z) * speed;

// 			this.camera.position.x += target_x;
// 			this.camera.position.y += target_y;
// 			this.camera.position.z += target_z;

// 			this.camera.lookAt({ x: this.CAMERA_LX, y: 0, z: this.CAMERA_LZ });
// 		},

// 		animate: function () {

// 			if (this.CAMERA_X != this.camera.position.x ||
// 				this.CAMERA_Y != this.camera.position.y ||
// 				this.CAMERA_Z != this.camera.position.z) {
// 				this.moveCamera();
// 			}

// 			// find intersections
// 			var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
// 			this.projector.unprojectVector(vector, this.camera);
// 			var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
// 			var intersects = raycaster.intersectObjects(this.scene.children);

// 			// var objects = this.scene.children;

// 			// if (intersects.length > 1) {
// 			// 	if (this.INTERSECTED != intersects[0].object) {
// 			// 		if (this.INTERSECTED) {
// 			// 			for (i = 0; i < objects.length; i++) {
// 			// 				if (objects[i].name == this.INTERSECTED.name) {
// 			// 					objects[i].material.opacity = 0.5;
// 			// 					objects[i].scale.z = 1;
// 			// 				}
// 			// 			}
// 			// 			this.INTERSECTED = null;
// 			// 		}
// 			// 	}

// 			// 	this.INTERSECTED = intersects[0].object;
// 			// 	for (i = 0; i < objects.length; i++) {
// 			// 		if (objects[i].name == this.INTERSECTED.name) {
// 			// 			objects[i].material.opacity = 1.0;
// 			// 			objects[i].scale.z = 5;
// 			// 		}
// 			// 	}

// 			// } else if (this.INTERSECTED) {
// 			// 	for (i = 0; i < objects.length; i++) {
// 			// 		if (objects[i].name == this.INTERSECTED.name) {
// 			// 			objects[i].material.opacity = 0.5;
// 			// 			objects[i].scale.z = 1;
// 			// 		}
// 			// 	}
// 			// 	this.INTERSECTED = null;
// 			// }

// 			this.render();
// 		},

// 		render: function () {

// 			// actually render the scene
// 			this.renderer.render(this.scene, this.camera);
// 		}
// 	};

// 	function init() {
// 		$.when($.getJSON("data/countries.json")).then(function (data) {

// 			worldMap = new Map();

// 			worldMap.init_d3();
// 			worldMap.init_tree();

// 			var light = worldMap.add_light(0, 3000, 0, 1.0, 0xFFFFFF);
// 			worldMap.add_plain(1400, 700, 30, 0x23292d);

// 			worldMap.add_countries(data);

// 			// request animation frame
// 			var onFrame = window.requestAnimationFrame;

// 			function tick(timestamp) {
// 				worldMap.animate();
// 				// worldTime++;

// 				// if (worldMap.INTERSECTED) {
// 				// 	$('#country-name').html(worldMap.INTERSECTED.name);
// 				// } else {
// 				// 	$('#country-name').css({ top: -1000, left: -1000 });
// 				// }

// 				onFrame(tick);
// 			}

// 			createTimeline();
// 			drawWater(light);
// 			onFrame(tick);

// 			document.addEventListener('mousemove', onDocumentMouseMove, false);
// 			window.addEventListener('resize', onWindowResize, false);

// 		});
// 	}

// 	function createTimeline() {
// 		$('#ts').TimeSlider({
// 			start_timestamp: -602294400,
// 			end_timestamp: 2553465600,
// 			hours_per_ruler: 48,
// 			update_timestamp_interval: 1000,
// 			update_interval: 1000,
// 			graduation_step: 40
// 		});
// 	}

// 	function drawWater(light) {
// 		var waterNormals = new THREE.ImageUtils.loadTexture('../img/waternormals.jpg');
// 		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

// 		var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
// 		directionalLight.position.set(-600, 300, 600);
// 		worldMap.scene.add(directionalLight);

// 		// Create the water effect
// 		this.ms_Water = new THREE.Water(worldMap.renderer,
// 			worldMap.camera, worldMap.scene, {
// 				textureWidth: 256,
// 				textureHeight: 256,
// 				waterNormals: waterNormals,
// 				alpha: 1.0,
// 				sunDirection: light.position.normalize(),
// 				sunColor: 0xffffff,
// 				waterColor: 0x001e0f,
// 				betaVersion: 0,
// 				side: THREE.DoubleSide
// 			});
// 		var aMeshMirror = new THREE.Mesh(
// 			new THREE.PlaneBufferGeometry(2000, 2000, 10, 10),
// 			this.ms_Water.material
// 		);

// 		aMeshMirror.add(this.ms_Water);
// 		aMeshMirror.rotation.x = - Math.PI * 0.5;

// 		worldMap.scene.add(aMeshMirror);
// 	}

// 	function onDocumentMouseMove(event) {

// 		event.preventDefault();
// 		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
// 		mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
// 		worldMap.CAMERA_X = -(window.innerWidth / 2 - event.pageX) / 8;
// 		worldMap.CAMERA_Y = 800 + (worldMap.CAMERA_X > 0 ? -1 * worldMap.CAMERA_X : worldMap.CAMERA_X);
// 		$('#country-name').css({ 'top': event.pageY - 30, 'left': event.pageX });
// 	}

// 	function onWindowResize() {

// 		windowHalfX = window.innerWidth / 2;
// 		windowHalfY = window.innerHeight / 2;

// 		worldMap.camera.aspect = window.innerWidth / window.innerHeight;
// 		worldMap.camera.updateProjectionMatrix();

// 		worldMap.renderer.setSize(window.innerWidth, window.innerHeight);
// 	}

// 	$('.navbar-fixed-top ul li a').click(function () {
// 		switch (this.hash) {
// 			case "#africa":
// 				worldMap.setCameraPosition(100, 320, 200, 100, 50);
// 				break;
// 			case "#europe":
// 				worldMap.setCameraPosition(75, 210, -75, 75, -150);
// 				break;
// 			case "#asia":
// 				worldMap.setCameraPosition(400, 350, 100, 400, -100);
// 				break;
// 			case "#northamerica":
// 				worldMap.setCameraPosition(-300, 350, -90, -300, -120);
// 				break;
// 			case "#southamerica":
// 				worldMap.setCameraPosition(-200, 350, 250, -200, 120);
// 				break;
// 			case "#australia":
// 				worldMap.setCameraPosition(500, 270, 300, 500, 120);
// 				break;
// 			case "#all":
// 				worldMap.setCameraPosition(0, 1000, 500, 0, 0);
// 				break;
// 		}
// 	});

// 	window.onload = init;

// } ());