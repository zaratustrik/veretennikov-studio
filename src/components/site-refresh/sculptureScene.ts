import * as THREE from "three";

type Control = { x: number; y: number; open: boolean; paused: boolean };

export function mountSculpture(host: HTMLDivElement, control: Control) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
  catch { return () => {}; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 40);
  camera.position.set(0, 0, 9.5);
  scene.add(new THREE.HemisphereLight(0xf7f5ec, 0x5c6579, 2.6));
  for (const [color, intensity, x, y, z] of [
    [0xfff3df, 4, -3, 5, 5], [0xcbdcff, 3, 4, 1, 3], [0xffffff, 4, 0, -2, -4],
  ]) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x,y,z); scene.add(light);
  }
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const resources: { dispose: () => void }[] = [];
  const colors = [0x344f89, 0x647987, 0x879ab5, 0xa4b1c2];
  const ribbons: { group: THREE.Group; path: THREE.CatmullRomCurve3; beads: THREE.Mesh[] }[] = [];
  for (let strand = 0; strand < 4; strand++) {
    const phase = strand * Math.PI / 3;
    const faint = strand >= 2;
    const points = Array.from({ length: 241 }, (_, i) => {
      const t = i / 240 * Math.PI * 2;
      const r = 1.7 + .08 * Math.cos(3*t + phase);
      const point = new THREE.Vector3(r*Math.cos(t), r*.76*Math.sin(t), .1*Math.sin(2*t+phase));
      point.applyAxisAngle(new THREE.Vector3(1,0,0), phase + .2);
      point.applyAxisAngle(new THREE.Vector3(0,1,0), strand*.65);
      return point;
    });
    const path = new THREE.CatmullRomCurve3(points.slice(0,-1), true, "centripetal");
    const frames = path.computeFrenetFrames(240,true);
    const positions: number[] = [];
    const indices: number[] = [];
    // Elliptical cross-section gives each ribbon a broad face and rounded edge.
    for (let i=0; i<=240; i++) {
      const p=path.getPointAt(i/240);
      for (let j=0; j<=8; j++) {
        const a=j/8*Math.PI*2;
        const v=p.clone().addScaledVector(frames.normals[i],Math.cos(a)*(faint?.009:.024))
          .addScaledVector(frames.binormals[i],Math.sin(a)*(faint?.006:.011));
        positions.push(v.x,v.y,v.z);
        if(i<240 && j<8) {
          const k=i*9+j; indices.push(k,k+9,k+1,k+1,k+9,k+10);
        }
      }
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const material=new THREE.MeshStandardMaterial({color:colors[strand],metalness:.32,roughness:.3,transparent:faint,opacity:faint?.3:1,depthWrite:!faint});
    const group=new THREE.Group();
    group.add(new THREE.Mesh(geometry,material)); sculpture.add(group);
    const beadGeometry=new THREE.SphereGeometry(.058,12,8);
    const beadMaterial=new THREE.MeshStandardMaterial({color:strand===0?0xc6d4ed:0x5279b8,metalness:.4,roughness:.2});
    const beads=Array.from({length:faint?1:2},()=>{const bead=new THREE.Mesh(beadGeometry,beadMaterial);group.add(bead);return bead;});
    ribbons.push({group,path,beads});
    resources.push(geometry,material,beadGeometry,beadMaterial);
  }
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible=true, frame=0, last=0, time=0, spread=0;
  function render(now: number) {
    frame=requestAnimationFrame(render);
    if (!visible || document.hidden || now-last<32) return;
    const dt=Math.min((now-last)/1000,.05); last=now;
    if(!reduce.matches && !control.paused) time+=dt;
    spread+=(Number(control.open)-spread)*.07;
    const motion=reduce.matches?0:1;
    sculpture.rotation.set(.3+control.y*.25*motion,Math.sin(time*.18)*.38+control.x*.35*motion,time*.09);
    const speeds = [.029, -.043, .019, -.034];
    ribbons.forEach(({group,path,beads},i)=>{
      group.position.z=(i-1)*spread*.65;
      group.rotation.z=Math.sin(time*.32+i*2)*.035;
      beads.forEach((bead,j)=>{
        const raw = time * speeds[i] + j / beads.length + i * .13;
        bead.position.copy(path.getPointAt((raw % 1 + 1) % 1));
      });
    });
    renderer.render(scene,camera);
    host.dataset.ready="true";
  }
  const resize=new ResizeObserver(()=>{
    const {width,height}=host.getBoundingClientRect();
    if(!width || !height) return;
    renderer.setSize(width,height);camera.aspect=width/height;
    // Portrait canvases need a wider camera framing so a rotating orbit never
    // meets the viewport edge. Desktop stays deliberately more immersive.
    camera.position.z=camera.aspect<1.05?8.2:6.7;
    sculpture.position.x=camera.aspect<1.05?0:-1.55;
    camera.updateProjectionMatrix();
  });
  resize.observe(host);
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=performance.now();});
  intersection.observe(host);
  frame=requestAnimationFrame(render);
  const lost=(event: Event)=>{event.preventDefault();host.dataset.ready="false";visible=false;};
  renderer.domElement.addEventListener("webglcontextlost",lost);
  return ()=>{
    cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();
    renderer.domElement.removeEventListener("webglcontextlost",lost);
    resources.forEach(resource=>resource.dispose());renderer.dispose();renderer.domElement.remove();
    delete host.dataset.ready;
  };
}
