import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js"

// function dumpObject(obj, lines = [], isLast = true, prefix = '') {
//     const localPrefix = isLast ? '└─' : '├─';
//     lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
//     const newPrefix = prefix + (isLast ? '  ' : '│ ');
//     const lastNdx = obj.children.length - 1;
//     obj.children.forEach((child, ndx) => {
//         const isLast = ndx === lastNdx;
//         dumpObject(child, lines, isLast, newPrefix);
//     });
//     return lines;
// }


class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer = renderer;

        let scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupPicking();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel() {
        const gltfLoader = new GLTFLoader();
        const item = "data/02-_restoration__3december/scene.gltf"

        gltfLoader.load(item, ( gltf ) => {
                const obj3d = gltf.scene;
                const box = new THREE.Box3().setFromObject(obj3d);
                const sizeBox = box.max.z - box.min.z;
                const scale = 1 / sizeBox;
                obj3d.scale.set(scale, scale, scale);
        
                this._scene.add(obj3d);
                obj3d.name = "sneaker";
                // gltfLoader.traverse(child => {
                //     child.castShadow = true;
                //     child.receiveShadow = true;
    // });

    });
            }


    _setupPicking() {
        const raycaster = new THREE.Raycaster();
        this._divContainer.addEventListener("dblclick", this._onDblClick.bind(this));
        this._raycaster = raycaster;
    }    

    _onDblClick(event) {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const xy = {
            x: (event.offsetX / width) * 2 - 1, 
            y: -(event.offsetY / height) * 2 + 1
        };
        this._raycaster.setFromCamera(xy, this._camera);

        const cars = [];
        this._scene.traverse(obj3d => {
            if(obj3d.name === "car") {
                cars.push(obj3d);
            }
        });
        
        for(let i=0; i<cars.length; i++) {
            const car = cars[i];
            const targets = this._raycaster.intersectObject(car);
            if(targets.length > 0) {
                this._zoomFit(car, 70);
                this._controls.enabled = true;
                return;
            }
        }

        const box = this._scene.getObjectByName("box");
        this._zoomFit(box, 45);        
    }    

    _zoomFit(object3d, viewAngle) {
        const box = new THREE.Box3().setFromObject(object3d);
        const sizeBox = box.getSize(new THREE.Vector3()).length();
        const centerBox = box.getCenter(new THREE.Vector3());
        
        const direction = new THREE.Vector3(0,1,0);
        direction.applyAxisAngle(new THREE.Vector3(1,0,0), 
            THREE.Math.degToRad(viewAngle));
        
        const halfSizeModel = sizeBox * 0.5;
        const halfFov = THREE.Math.degToRad(this._camera.fov * .5);
        const distance = halfSizeModel / Math.tan(halfFov);

        const newPosition = new THREE.Vector3().copy(
            direction.multiplyScalar(distance).add(centerBox));
        
        //this._camera.position.copy(newPosition);
        gsap.to(this._camera.position, { duration: 1.5,  
            x: newPosition.x, y: newPosition.y, z: newPosition.z});

        //this._controls.target.copy(centerBox);
        gsap.to(this._controls.target, { duration: 0.5,  
            x: centerBox.x, y: centerBox.y, z: centerBox.z,
            onUpdate: () => {
                this._camera.lookAt(this._controls.target.x,
                    this._controls.target.y, this._controls.target.z);                
            }} 
        );        
    }
    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            35, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );

        camera.position.z = 0.2;
        this._camera = camera;
    }

    _setupLight() {
        const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
        this._scene.add(ambientLight);

        const color = 0xffffff;
        const intensity = 1.5;
        
        const light1 = new THREE.DirectionalLight(color, intensity);
        light1.position.set(-1, 2, 0);
        this._scene.add(light1);        

        const light2 = new THREE.DirectionalLight(color, intensity);
        light2.castShadow = true;        
        light2.position.set(1, 4, 0);
        light2.shadow.mapSize.width = light2.shadow.mapSize.height = 1024 * 10;
        light2.shadow.radius = 4;
        light2.shadow.bias = 0.0001;        
        this._scene.add(light2);
    }

    update(time) {
        time *= 0.001; // second unit
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);   
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}