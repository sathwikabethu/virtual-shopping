const video = document.getElementById('video');
const snapBtn = document.getElementById('snap');
const autoToggle = document.getElementById('autoToggle');
const overlay = document.getElementById('overlay');
const detectionsEl = document.getElementById('detections');
const cartEl = document.getElementById('cart');

let auto = false;
let streamWidth = 640, streamHeight = 480;

async function startWebcam(){
  const constraints = { video: { width: { ideal: streamWidth }, height: { ideal: streamHeight } }, audio: false };
  try{
    const s = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = s;
    await video.play();
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;
  }catch(e){
    alert('Could not access webcam: ' + e.message);
  }
}

function captureFrame(){
  const c = document.createElement('canvas');
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  const ctx = c.getContext('2d');
  ctx.drawImage(video, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.8);
}

async function sendFrame(){
  const data = { image: captureFrame() };
  const res = await fetch('/detect', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  const j = await res.json();
  drawDetections(j.detections);
  renderDetectionsList(j.detections);
}

function drawDetections(dets){
  const ctx = overlay.getContext('2d');
  overlay.width = video.videoWidth; overlay.height = video.videoHeight;
  ctx.clearRect(0,0,overlay.width,overlay.height);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,0,0,0.9)';
  ctx.fillStyle = 'rgba(255,0,0,0.15)';
  (dets || []).forEach(d => {
    const b = d.bbox;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.font = '14px sans-serif';
    ctx.fillText(d.product.name + ' - $' + d.product.price, b.x + 6, b.y + 18);
    ctx.fillStyle = 'rgba(255,0,0,0.15)';
  });
}

function renderDetectionsList(dets){
  detectionsEl.innerHTML = '';
  (dets || []).forEach(d => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<strong>${d.product.name}</strong> — $${d.product.price}<br/><small>${d.product.description}</small><br/>`;
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add to cart';
    addBtn.onclick = async ()=>{
      await fetch('/cart/add', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({product_id: d.product.id, qty:1}) });
      loadCart();
    }
    div.appendChild(addBtn);
    detectionsEl.appendChild(div);
  });
}

async function loadCart(){
  const res = await fetch('/cart');
  const items = await res.json();
  cartEl.innerHTML = '';
  items.forEach(it=>{
    const d = document.createElement('div');
    d.className = 'item';
    d.innerHTML = `<strong>${it.product.name}</strong> x ${it.qty} — $${(it.product.price * it.qty).toFixed(2)}`;
    cartEl.appendChild(d);
  });
}

snapBtn.addEventListener('click', ()=> sendFrame());
autoToggle.addEventListener('click', ()=>{
  auto = !auto;
  autoToggle.textContent = auto ? 'Stop Auto Scan' : 'Start Auto Scan';
  if(auto) autoScan();
});

async function autoScan(){
  while(auto){
    await sendFrame();
    await new Promise(r=>setTimeout(r, 1200));
  }
}

startWebcam();
loadCart();
