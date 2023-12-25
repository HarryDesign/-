import { Joystick, Model, Skybox, ThirdPersonCamera, useKeyboard, useLoop, World, usePreload, useWindowSize } from "lingo3d-react"
import { useRef, useState } from "react"
import "./App.css"

//Main game component that's rendered after loading is done
const Game = () => {

  //useKeyboard hook will trigger re-render when the user presses keyboard
  const key = useKeyboard()

  //joystick coordinates
  // 操纵杆坐标
  const [joystick, setJoystick] = useState({ x: 0, y: 0, z: 0, angle: 0 })

  //"running" becomes true when user presses "w" key, or pushes joystick forward
  //当用户按下 "w"键，或将操纵杆向前推时，"运行 "变为真。
  //当用户按下 "s"键，或将操纵杆向后推时，"运行 "变为真。
  const running = key === "w" || joystick.y < 0
  const back = key === "s" || joystick.y > 0

  //ref to the character model, used to imperatively move the character forward
  //指人物模型，用于强制性地将人物向前移动。
  const characterRef = useRef()

  //Callback passed to useLoop runs 60 times every second. When "running" is false, loop is paused automatically.
  //传递给useLoop的回调每秒钟运行60次。当 "运行 "为假时，循环会自动暂停。
  useLoop(() => {
    characterRef.current.moveForward(-20)
  }, running)
  useLoop(() => {
    characterRef.current.moveForward(10)
  }, back)
 
  //adjust FOV based on portrait or landscape orientation
  //根据纵向或横向方向调整FOV
  const windowSize = useWindowSize()
  const fov = windowSize.width > windowSize.height ? 75 : 90

  return (
    <>
      <World>
        {/* map model */}
        <Model src="school.glb" scale={8} physics="map" />
        {/* camera and player character model */}
        {/*相机和玩家角色模型 */}
        <ThirdPersonCamera active mouseControl fov={fov}>
          <Model
            ref={characterRef}
            src="idle.fbx"
            x={0}
            y={0}
            z={0}
            animations={{ idleAnimation: "idle.fbx", runnAnimation: "run.fbx", backAnimation: "back.fbx" }}
            animation={ running ? "runnAnimation" : back ? "backAnimation" :  "idleAnimation" }
            physics="character"
          />
        </ThirdPersonCamera>
        <Skybox texture="skybox.jpg" />
      </World>
      <Joystick onMove={e => setJoystick({ x: e.x, y: e.y, z: e.z, angle: e.angle })} />
    </>
  )
}

const App = () => {
  //usePreload hook to preload assets, returns loading progress
  const progress = usePreload(["school.glb", "idle.fbx", "run.fbx","back.fbx", "skybox.jpg"], "21.2mb")

  if (progress < 100)
    return (
      <div className="loading">
        数据读取中请等待...
        小提示：鼠标左键点击屏幕，按键盘W键前进，S键后退，转动鼠标调整视角，手机登陆请使用左下方的虚拟摇杆进行控制。 {Math.round(progress)}%
      </div>
    )

  return (
    <Game />
  )
}

export default App
