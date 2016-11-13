var Water = function(viv){
    var factory = {};

    factory.viv = viv;
    factory.water = null;

    Initialize();
    return factory;

    function Initialize(){
        var waterNormals = new THREE.ImageUtils.loadTexture('../img/waternormals.jpg');
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

		// Create the water effect
		factory.water = new THREE.Water(factory.viv.renderer,
			factory.viv.camera, factory.viv.scene, {
				textureWidth: 256,
				textureHeight: 256,
				waterNormals: waterNormals,
				alpha: 1.0,
				sunDirection: factory.viv.sun.position.normalize(),
				sunColor: 0xffffff,
				waterColor: 0x001e0f,
				betaVersion: 0,
				side: THREE.DoubleSide
			});

		var aMeshMirror = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(2000, 2000, 10, 10),
		    factory.water.material
		);

		aMeshMirror.add(factory.water);
		aMeshMirror.rotation.x = - Math.PI * 0.5;
    }
}