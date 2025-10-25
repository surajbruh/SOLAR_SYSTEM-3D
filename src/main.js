import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { degToRad } from "three/src/math/MathUtils.js"

// scene
const scene = new THREE.Scene()

// camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

controls.minDistance = 10
controls.maxDistance = 1000

camera.position.set(-150, 75, -150)
controls.update()

// instantiate a loader
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath("/textures/cubeMaps/")
const backgroundCubeMap = cubeTextureLoader.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
]);

scene.background = backgroundCubeMap

// axes
const originAxes = new THREE.AxesHelper(100)
// scene.add(originAxes)

// sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

const sunTexture = textureLoader.load("/textures/sun.png")
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture })
sunMaterial.roughness = 0

const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)

sunMesh.scale.setScalar(10)
scene.add(sunMesh)

// materials
const mercuryMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/mercury.png") })
const venusMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/venus.png") })
const earthMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/earth.png") })
const moonMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/moon.png") })
const marsMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/mars.png") })
const jupiterMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/jupiter.png") });
const saturnMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/saturn.png") });
const uranusMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/uranus.png") });
const neptuneMaterial = new THREE.MeshPhysicalMaterial({ map: textureLoader.load("/textures/neptune.png") });

const planets = [
  {
    name: "mercury",
    radius: 1,
    distance: 20,
    speed: 4.7,
    material: mercuryMaterial
  },
  {
    name: "venus",
    radius: 2.4,
    distance: 30,
    speed: 3.5,
    material: venusMaterial
  },
  {
    name: "earth",
    radius: 2.6,
    distance: 40,
    speed: 3,
    material: earthMaterial,
    moons: [
      {
        name: "moon",
        radius: 0.25,
        distance: 3,
        speed: 6,
        material: moonMaterial
      }
    ]
  },
  {
    name: "mars",
    radius: 1.8,
    distance: 55,
    speed: 2.4,
    material: marsMaterial
  },
  {
    name: "jupiter",
    radius: 7,
    distance: 75,
    speed: 1.3,
    material: jupiterMaterial
  },
  {
    name: "saturn",
    radius: 6,
    distance: 100,
    speed: 1,
    material: saturnMaterial,
    rings: {
      innerRadius: 1.5,
      outerRadius: 2,
    }
  },
  {
    name: "uranus",
    radius: 4,
    distance: 125,
    speed: 0.7,
    material: uranusMaterial
  },
  {
    name: "neptune",
    radius: 3.8,
    distance: 150,
    speed: 0.5,
    material: neptuneMaterial
  }
]

const createPlanetMesh = (planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material)

  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance

  return planetMesh
}

const createMoonMesh = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moon.material)

  moonMesh.scale.setScalar(moon.radius)
  moonMesh.position.x = moon.distance

  return moonMesh
}

const planetModels = planets.map((planet) => {
  const planetMesh = createPlanetMesh(planet)
  scene.add(planetMesh)

  if (planet.moons) {
    planet.moons.forEach((moon) => {
      const moonMesh = createMoonMesh(moon)
      planetMesh.add(moonMesh)
    })
  }

  if (planet.rings) {
    const geometry = new THREE.RingGeometry(planet.rings.innerRadius, planet.rings.outerRadius)
    const material = new THREE.MeshStandardMaterial({ map: textureLoader.load("/textures/saturn_ring..png") })
    material.side = THREE.DoubleSide

    const ringMesh = new THREE.Mesh(geometry, material)
    ringMesh.rotation.x = degToRad(113)

    planetMesh.add(ringMesh)
    // ringMesh.add(originAxes)
  }

  return planetMesh
})

// lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

const sunLight = new THREE.PointLight(0xffffff, 5000, 0, 2);
sunMesh.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 3)
scene.add(ambientLight)

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

// clock
let previousTime = 0;
const clock = new THREE.Clock()

// animation loop
function animate() {
  requestAnimationFrame(animate)

  const currentTime = clock.getElapsedTime()
  const delta = currentTime - previousTime

  previousTime = currentTime

  sunMesh.rotation.y += degToRad(1) * delta * 15

  planetModels.forEach((planet, planetIndex) => {
    planet.rotation.y += degToRad(1) * delta * planets[planetIndex].speed * 25

    planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance
    planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance

    // console.log(planet)
    if (planet.children) {
      planet.children.forEach((child, index) => {
        if (child.geometry.type === "RingGeometry") {
          console.log(child)
          child.rotation.z += degToRad(1) * delta * 25
          return
        }

        child.rotation.y += degToRad(1) * delta * planets[planetIndex].moons[index]?.speed * 25
        child.position.x = Math.sin(child.rotation.y) * planets[planetIndex].moons[index].distance
        child.position.z = Math.cos(child.rotation.y) * planets[planetIndex].moons[index].distance
      })
    }
  })

  controls.update()
  renderer.render(scene, camera)
}
animate()