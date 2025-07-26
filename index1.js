const leftPanel = document.getElementById('leftPanel');
const rightPanel = document.getElementById('rightPanel');
const dragElement = document.getElementById('dragElement');

let isDragging = false;
let startX = 0;
let startTranslateX = 0;
let startLeftWidth = 0;
let startRightWidth = 0;

// 初始化宽度
function initWidths() {
  const containerWidth = document.querySelector('.container').offsetWidth;
  leftPanel.style.flexBasis = `${containerWidth * 0.3}px`;
  rightPanel.style.flexBasis = `${containerWidth * 0.7}px`;
}

// 开始拖拽
dragElement.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startTranslateX = parseInt(getComputedStyle(dragElement).transform.split(',')[4]) || 0;
  startLeftWidth = parseInt(getComputedStyle(leftPanel).flexBasis);
  startRightWidth = parseInt(getComputedStyle(rightPanel).flexBasis);
  
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

// 拖拽中
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  const dx = e.clientX - startX;
  const newTranslateX = startTranslateX + dx;
  
  // 计算宽度变化（1:1比例）
  const widthChange = dx;
  const newLeftWidth = startLeftWidth + widthChange;
  const newRightWidth = startRightWidth - widthChange;
  
  // 边界检查
  const minWidth = 100;
  if (newLeftWidth < minWidth || newRightWidth < minWidth) return;
  
  // 更新面板宽度
  leftPanel.style.flexBasis = `${newLeftWidth}px`;
  rightPanel.style.flexBasis = `${newRightWidth}px`;
  
  // 更新元素位置（视觉反馈）
  dragElement.style.transform = `translateX(${newTranslateX}px)`;
});

// 结束拖拽
document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  
  isDragging = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  
  // 重置translate（保持布局由flex控制）
  dragElement.style.transform = 'translateX(0)';
});

// 初始化
window.addEventListener('load', initWidths);
window.addEventListener('resize', initWidths);