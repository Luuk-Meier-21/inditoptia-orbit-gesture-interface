const RADIUS = 1000;
const SIZE = RADIUS * 0.04;

const entries = [
  {color: 0xcc8b3a, height: 1},
  {color: 0x563071, height: 2},
  {color: 0x3c4b6e, height: 4},
  {color: 0x8f221f, height: 8},
];

const latLngToVevtor = ({lat, lng, radius, height}) => {
  const phi = (lat * Math.PI) / 180;
  const theta = ((lng - 180) * Math.PI) / 180;
  const x = -(radius + height) * Math.cos(phi) * Math.cos(theta);
  const y = (radius + height) * Math.sin(phi);
  const z = (radius + height) * Math.cos(phi) * Math.sin(theta);

  return {x, y, z};
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const latlng = [
  ["52.87405", "-1.501679"],
  ["53.22739", "-4.129263"],
  ["50.949707", "0.73726"],
  ["60.152988", "-1.149293"],
  ["51.272644", "0.52527"],
  ["56.071739", "-3.452151"],
  ["53.106152", "-3.91236"],
  ["55.992622", "-3.409195"],
  ["51.876534", "0.553436"],
  ["51.745735", "-2.217758"],
  ["55.723331", "-4.898329"],
  ["50.390202", "-3.920431"],
  ["52.415089", "-4.083116"],
  ["53.137032", "-3.795732"],
  ["51.925957", "-0.500873"],
  ["52.69994", "-2.021829"],
  ["55.81879", "-4.167187"],
  ["51.572803", "-0.776339"],
  ["53.478764", "-2.094523"],
  ["55.94228", "-3.052139"],
  ["51.56736", "0.550539"],
  ["50.514999", "-4.45394"],
  ["52.179485", "-3.440298"],
  ["50.233021", "-5.226666"],
  ["52.122665", "0.169775"],
  ["52.482533", "-2.121166"],
  ["52.986115", "-1.986144"],
  ["50.711163", "-2.441181"],
  ["56.013035", "-3.603531"],
  ["51.150719", "-0.973177"],
  ["52.45665", "0.307016"],
  ["56.002716", "-4.580081"],
  ["52.982136", "-1.351061"],
  ["52.906002", "-2.147913"],
  ["53.841965", "-0.435093"],
  ["51.581551", "-0.099649"],
  ["52.853638", "-2.726712"],
  ["56.62674", "-5.313209"],
  ["51.29134", "-0.513182"],
  ["53.745766", "-0.432844"],
  ["51.796078", "-0.655879"],
  ["53.330009", "-1.656355"],
  ["52.4561\t0", ".054012"],
  ["52.984695", "-1.487313"],
  ["50.169174", "-5.107088"],
  ["51.825302", "-2.500958"],
  ["51.61359", "-0.062553"],
  ["55.908749", "-3.288481"],
  ["57.653484", "-3.335724"],
  ["53.002666", "-2.179404"],
  ["52.412811", "-1.778197"],
  ["51.481583", "-3.17909"],
  ["50.768036", "0.290472"],
  ["51.752022", "-1.257677"],
  ["51.509865", "-0.118092"],
  ["51.568535", "-1.772232"],
  ["51.441883", "0.370759"],
  ["52.240479", "-0.902656"],
  ["52.370876", "-1.265032"],
  ["52.570385", "-1.824042"],
  ["51.772938", "0.10231"],
  ["57.149651", "-2.099075"],
  ["51.621441", "-3.943646"],
  ["53.235046", "-1.421629"],
  ["51.068787", "-1.794472"],
  ["50.614429", "-2.457621"],
  ["52.59137", "-2.110748"],
  ["53.765762", "-2.692337"],
  ["50.720806", "-1.904755"],
  ["53.52282", "-1.128462"],
  ["55.458565", "-4.629179"],
  ["50.854259", "0.573453"],
  ["52.136436", "-0.460739"],
  ["51.572376", "0.470009"],
  ["51.458057", "-2.116074"],
  ["54.607868", "-5.926437"],
  ["50.967941", "0.085831"],
  ["50.825024", "-0.383835"],
  ["53.801277", "-1.548567"],
  ["54.328506", "-2.74387"],
  ["50.376289", "-4.143841"],
  ["52.080875", "0.444517"],
  ["52.328415", "-1.377561"],
  ["57.477772", "-4.224721"],
  ["52.630886", "1.297355"],
  ["54.369209", "-1.299906"],
  ["54.328136", "-1.710434"],
  ["50.93671", "0.795299"],
  ["51.904949", "0.202641"],
  ["55.961502", "-2.602957"],
  ["56.699039", "-2.477074"],
  ["56.031548", "-2.736641"],
  ["54.172798", "-1.39006"],
  ["52.666924", "-1.41935"],
  ["56.268547", "-3.396567"],
  ["50.825539", "0.391275"],
  ["51.997128", "0.710512"],
  ["53.19994", "-1.865906"],
  ["57.421562", "-4.665638"],
  ["52.775696", "0.847255"],
  ["51.770145", "-0.530216"],
  ["56.013653", "-4.606447"],
  ["56.015846", "-4.610138"],
  ["56.008476", "-4.358299"],
  ["52.916039", "-1.319553"],
  ["51.998718", "-4.492331"],
  ["50.966694", "-2.31091"],
  ["53.009388", "-1.255502"],
  ["53.523922", "-3.025844"],
  ["50.906975", "0.301376"],
  ["55.391445", "-4.186113"],
  ["54.055508", "-0.805329"],
  ["52.076752", "-2.066007"],
  ["52.897724", "-1.313197"],
  ["51.096313", "0.268194"],
  ["50.79023", "0.088627"],
  ["51.308643", "-0.0825"],
  ["53.861942", "-0.288906"],
  ["53.007732", "-1.433412"],
  ["53.234604", "0.010666"],
  ["54.742683", "-2.659233"],
  ["52.671661", "0.812899"],
  ["58.024811", "-5.352271"],
  ["51.137486", "-3.540236"],
  ["51.127769", "-4.228621"],
  ["50.863289", "-3.221575"],
  ["51.78307", "-0.73388"],
  ["53.968327", "-1.943041"],
  ["51.207661", "0.643803"],
  ["51.223495", "0.571032"],
  ["51.239258", "0.720655"],
  ["52.294331", "-0.248909"],
  ["60.137714", "-1.282203"],
  ["52.20702", "0.114895"],
  ["53.445923", "-2.312527"],
  ["54.010006", "-2.787985"],
  ["52.210712", "0.116883"],
  ["51.474312", "-0.069228"],
  ["52.202942", "0.118686"],
  ["52.953648", "-1.151851"],
  ["55.865063", "-4.272175"],
  ["53.478062", "-2.244666"],
  ["51.507359", "-0.136439"],
  ["51.505779", "-0.553606"],
  ["53.464455", "-2.235348"],
  ["50.82539", "-0.138166"],
  ["53.480312", "-2.248746"],
  ["51.523933", "-0.131573"],
  ["50.23288", "-5.227213"],
  ["53.486618", "-2.243786"],
  ["51.296387", "-0.749608"],
  ["52.205067", "0.10776"],
  ["51.51469", "-0.115698"],
  ["51.529972", "-0.127676"],
  ["51.754074", "-1.254042"],
  ["52.47974", "-1.908484"],
  ["54.11422", "-3.231364"],
  ["51.511127", "-0.621439"],
  ["51.496483", "-0.014119"],
  ["53.491554", "-2.375021"],
  ["51.562023", "-0.280151"],
  ["52.897541", "-1.42319"],
  ["51.518875", "-0.149895"],
  ["51.615788", "-0.262034"],
  ["52.187248", "0.97078"],
  ["53.593349", "-2.296605"],
  ["50.904766", "-1.367111"],
  ["51.765907", "0.667367"],
  ["51.654827", "-0.083599"],
];

class Sphere {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      RADIUS * 5
    );
    this.mouse = new THREE.Vector2();
    this.camera.position.z = RADIUS * 2.5;
    this.camera.rotation.z *= 0.2;
    this.group = new THREE.Group();
    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({antialiasing: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
    this.raycaster = new THREE.Raycaster();
    document.body.appendChild(this.renderer.domElement);
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 10);
    this.center = new THREE.Vector3(0, 0, 0);

    this.$toggleButton = document.getElementById("toggle");
  }

  bindEvents = () => {
    this.$toggleButton.addEventListener("click", this.onClickToggle);
  };

  init() {
    this.renderSphere();
    this.renderDataPoints();
    this.bindEvents();
    this.setupLights();

    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.update();
    this.scene.add(this.group);

    return this;
  }

  hidePoints = (points) => {
    points.forEach((point) => {
      TweenMax.to(point.scale, 1, {
        z: 1,
      });
      TweenMax.to(point.material, 1, {
        opacity: 0,
      });
    });
  };

  addLocals = (latlng) => {
    const total = latlng.length;
    const totalPoints = this.points.length;

    const points = this.points.slice(0, total);

    // // log(points)
    this.hidePoints(this.points.slice(total, totalPoints));

    this.latLngCords = latlng.map(([lat, lng]) => {
      const {x, y, z} = latLngToVevtor({
        lat,
        lng,
        radius: RADIUS,
        height: 0,
      });
      return {x, y, z};
    });

    /*
      ANIMATE ITEMS AROUNDS THE SPHERE
      WAAAA!?
    */
    this.local = points.map((point, index) => {
      const {x, y, z} = this.latLngCords[index];

      TweenMax.to(point.position, 5.5, {
        x,
        y,
        z,
        onUpdate: () => {
          point.lookAt(this.center);
        },
      });

      TweenMax.to(point.scale, 5.5, {
        x: SIZE * 0.1,
        y: SIZE * 0.1,
        z: 10,
        onUpdate: () => {
          point.lookAt(this.center);
        },
      });
    });
    const {x, y, z} = this.latLngCords[0];
    this.moveCamera({x, y, z});
  };

  onClickToggle = (e) => {
    this.addLocals(latlng);
    this.shouldFetch = false;
  };

  moveCamera = ({x, y, z}) => {
    const {x: cx, y: cy, z: cz} = this.camera.position;
    const start = new THREE.Vector3(cx, cy, cz);

    // move camera to the target
    const point = {x, y, z};

    const camDistance = this.camera.position.length();
    this.camera.position
      .copy(new THREE.Vector3(point.x, point.y, point.z))
      .normalize()
      .multiplyScalar(camDistance);

    // save the camera position
    const {x: a, y: b, z: c} = this.camera.position;

    // invert back to original position
    this.camera.position.copy(start).normalize().multiplyScalar(camDistance);

    // animate from start to end

    const tl = new TimelineMax();

    const zoom = {
      value: this.camera.zoom,
    };

    tl.to(this.camera.position, 8, {
      x: a,
      y: b,
      z: c,
      onUpdate: () => {
        this.controls.update();
      },
    }).to(
      zoom,
      3,
      {
        value: 5,
        onUpdate: () => {
          this.camera.zoom = zoom.value;
          this.camera.updateProjectionMatrix();
          this.controls.update();
        },
      },
      "-=2.5"
    );
  };

  setupLights = () => {
    const pointLight = new THREE.PointLight(0xffffff, 5, 60);
    pointLight.position.set(50, 50, 76);
    this.lightHolder = new THREE.Group();
    this.lightHolder.add(pointLight);
    this.scene.add(this.lightHolder);

    this.light = new THREE.SpotLight(0xffffff);

    this.light.castShadow = true;

    this.light.shadow.mapSize.width = 50;
    this.light.shadow.mapSize.height = 50;

    this.light.shadow.camera.near = 500;
    this.light.shadow.camera.far = 3000;
    this.light.shadow.camera.fov = 75;
    this.scene.add(this.light);
  };

  prev = null;
  outline = null;
  shouldRotate = true;

  getDistribution = (n) => {
    const rnd = 1;
    const offset = 2 / n;
    const increment = Math.PI * (3 - Math.sqrt(5));

    return Array(n)
      .fill(null)
      .map((_, i) => {
        const y = i * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - Math.pow(y, 2));
        const phi = ((i + rnd) % n) * increment;

        return {
          x: Math.cos(phi) * r,
          z: Math.sin(phi) * r,
          y,
        };
      });
  };

  renderDataPoints = () => {
    this.points = this.getDistribution(200).map(({x, y, z}, index) => {
      const {color, height} = entries[rand(0, 3)];
      const material = new THREE.MeshPhongMaterial({
        color: color,
        opacity: 1,
        transparent: true,
        emissive: color,
        emissiveIntensity: 0,
      });

      const cube = new THREE.Mesh(this.cubeGeometry, material);

      cube.castShadow = true;
      cube.receiveShadow = true;

      cube.position.set(x * RADIUS, y * RADIUS, z * RADIUS);

      cube.material.color.setHex(color);
      cube.lookAt(this.center);
      cube.scale.y = SIZE;
      cube.scale.x = SIZE;
      cube.scale.z += height * rand(0.5, 8);

      cube.__animating = false;
      cube.__id = index;
      cube.__update = height;
      cube.__default = 1;

      this.group.add(cube);

      return cube;
    });
  };

  renderSphere = () => {
    const material = new THREE.MeshBasicMaterial({
      color: 0x06131b,
      vertexColors: THREE.FaceColors,
    });
    const geometry = new THREE.SphereGeometry(RADIUS, 32, 32);
    const sphere = new THREE.Mesh(geometry, material);

    this.group.add(sphere);
  };

  shouldFetch = true;

  render = (timestamp) => {
    if (this.shouldRotate) {
      if (!this.start) this.start = timestamp;

      const progress = timestamp - this.start;
      this.group.rotation.y = progress * 0.00005;
      this.group.rotation.z = progress * 0.000025;
    }

    this.lightHolder.quaternion.copy(this.camera.quaternion);
    this.light.position.copy(this.camera.position);

    //this.controls.update()
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };
}

new Sphere().init().render();
