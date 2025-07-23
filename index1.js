class DragScaleCombin {
  static paramEleHistory = new Set();

  constructor(dragEle, scaleEle) {
    this.dragEle = dragEle;
    this.scaleEle = scaleEle;
    if (DragScaleCombin.paramEleHistory.has(this.dragEle)) {
      return [...DragDropCombin.paramEleHistory].find(item => item === this.dragEle);
    }
    DragScaleCombin.paramEleHistory.add(this.dragEle);

    this.isBeginMove = false;
    this.mouseBeginPos = undefined;
    this.dragEleBeginPos = undefined;
    this.scaleEleRange = {
      minHeight: 30,
      maxHeight: 200,
      minWidth: 30,
      maxWidth: 100,
    }
    this.draggable();

  }
  getTranslatePos() {
    const style = window.getComputedStyle(this.dragEle);
    const transform = style.transform;

    if (!transform || transform === 'none') {
      return { x: 0, y: 0, z: 0 };
    }

    const matrix = new DOMMatrix(transform);
    return {
      x: matrix.m41,
      y: matrix.m42,
      z: matrix.m43
    };
  }

  getDragElePos = () => {
    const eleRect = this.dragEle.getBoundingClientRect();
    return {
      left: eleRect.left,
      top: eleRect.top,
      right: eleRect.right,
      bottom: eleRect.bottom
    }
  };

  getScaleElePos = () => {
    const eleRect = this.scaleEle.getBoundingClientRect();
    return {
      left: eleRect.left,
      top: eleRect.top,
      right: eleRect.right,
      bottom: eleRect.bottom,
      height: eleRect.height,
      width: eleRect.width,

    }
  };

  isMouseInRange = (mousePos) => {
    const elePos = this.getDragElePos();
    const isMouseInRange = mousePos.x - elePos.left > 0 && mousePos.y - elePos.top && elePos.right - mousePos.x > 0 && elePos.bottom - mousePos.y > 0
    return isMouseInRange;
  };

  #setMoveBeginVal = (posX, posY) => {
    const elePos = this.getDragElePos();
    const scalePos = this.getScaleElePos();
    this.isBeginMove = true,
    this.mouseBeginPos = {
      x: posX,
      y: posY,
    },
    this.dragEleBeginPos = {
      left: elePos.left,
      right: elePos.right,
      top: elePos.top,
      bottom: elePos.bottom
    };
    this.scaleEleBeginPos = {
      left: scalePos.left,
      right: scalePos.right,
      top: scalePos.top,
      bottom: scalePos.bottom,
      height: scalePos.height
    }
  }
  #setDragElePos = (mouseCurX, mouseCurY) => {
    const { x, y } = this.getTranslatePos();
    const offSetX = mouseCurX - this.mouseBeginPos.x;
    const offSetY = mouseCurY - this.mouseBeginPos.y;

    const eleCurX = x + offSetX;
    const eleCurY = y + offSetY;

    this.mouseBeginPos.x = mouseCurX;
    this.mouseBeginPos.y = mouseCurY;

    const curScalePos = this.getScaleElePos();
    const nextScalePosWidth = curScalePos.width + offSetX;
    const nextScalePosHeight = curScalePos.height + offSetY;

    const isWidthInRange = nextScalePosWidth >= this.scaleEleRange.minWidth && nextScalePosWidth <= this.scaleEleRange.maxWidth;
    const isHeightInRange = nextScalePosHeight >= this.scaleEleRange.minHeight && nextScalePosHeight <= this.scaleEleRange.maxHeight;
    if (isWidthInRange) {
      this.scaleEle.style.width = nextScalePosWidth + 'px';
    }
    if (isHeightInRange) {
      this.scaleEle.style.height = nextScalePosHeight + 'px';
    }
    if (isWidthInRange && isHeightInRange) {
      this.dragEle.style.transform = `translate(${eleCurX}px, ${eleCurY}px)`;
    }
  }

  draggable = () => {
    this.dragEle.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      if (this.isMouseInRange({ x: touch.clientX, y: touch.clientY })) {
        this.#setMoveBeginVal(touch.clientX, touch.clientY);
      }
    });
    this.dragEle.addEventListener('mousedown', (event) => {

      if (this.isMouseInRange(event)) {
        this.#setMoveBeginVal(event.x, event.y);
      }
    });

    this.dragEle.addEventListener('mousemove', (event) => {
      event.preventDefault();
      if (this.isMouseInRange(event)) {
        this.dragEle.style.cursor = 'move';
        if (this.isBeginMove) {

          this.#setDragElePos(event.x, event.y);
        }
      } else {
        this.dragEle.style.cursor = 'pointer'
      };
    });
    document.addEventListener('touchmove', (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      if (this.isBeginMove) {
        this.#setDragElePos(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    document.addEventListener('mouseup', (event) => {
      this.isBeginMove = false;
    });
    document.addEventListener('touchend', (event) => {
      this.isBeginMove = false
    });

  }
}