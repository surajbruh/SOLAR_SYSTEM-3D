import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

// scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

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

camera.position.set(0, 0, 10)
controls.update()

// axes
const originAxes = new THREE.AxesHelper(10)
scene.add(originAxes)

// sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial()

const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)

// ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 3)

scene.add(ambientLight)

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

// animation loop
function animate() {
  requestAnimationFrame(animate)

  controls.update()
  renderer.render(scene, camera)
}
animate()