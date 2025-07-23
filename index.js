class DraggableEle {
  static paramEleHistory = new Set();

  constructor(ele) {
    this.ele = ele;
    if (DraggableEle.paramEleHistory.has(this.ele)) {
      return [...DraggableEle.paramEleHistory].find(item => item === this.ele);
    }
    DraggableEle.paramEleHistory.add(this.ele);

    this.isBeginMove = false;
    this.mouseBeginPos = undefined;
    this.dragEleBeginPos = undefined;
    this.canMove = true;
    this.draggable();

  }
  getTranslatePos() {
    const style = window.getComputedStyle(this.ele);
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

  cancelMove() {
    this.canMove = false;
  }
  restoreMove() {
    this.canMove = true;
  }


  getDragElePos = () => {
    const eleRect = this.ele.getBoundingClientRect();
    return {
      left: eleRect.left,
      top: eleRect.top,
      right: eleRect.right,
      bottom: eleRect.bottom
    }
  };
  isMouseInRange = (mousePos) => {
    const elePos = this.getDragElePos();
    const isMouseInRange = mousePos.x - elePos.left > 0 && mousePos.y - elePos.top && elePos.right - mousePos.x > 0 && elePos.bottom - mousePos.y > 0
    return isMouseInRange;
  };

  #setMoveBeginVal = (posX, posY) => {
    const elePos = this.getDragElePos();

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
      }
  }
  #setDragElePos = (mouseCurX, mouseCurY) => {
    const { x, y } = this.getTranslatePos();
    const eleCurX = x + mouseCurX - this.mouseBeginPos.x;
    const eleCurY = y + mouseCurY - this.mouseBeginPos.y;
    this.mouseBeginPos.x = mouseCurX;
    this.mouseBeginPos.y = mouseCurY;
     const elePos = this.getDragElePos();
    console.log('this.dragEleBeginPos.top',this.dragEleBeginPos.top);
  
    if(this.canMove) {
      console.log('eleCurY', eleCurY);
      this.ele.style.transform = `translate(${eleCurX}px, ${eleCurY}px)`;

            this.ele.style.transform = `translate(${0}px, ${0}px)`;

    }

  }


  draggable = () => {
    this.ele.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      if (this.isMouseInRange({ x: touch.clientX, y: touch.clientY })) {
        this.#setMoveBeginVal(touch.clientX, touch.clientY);
      }
    });
    this.ele.addEventListener('mousedown', (event) => {
      if (this.isMouseInRange(event)) {
        this.#setMoveBeginVal(event.x, event.y);
      }
    });

    document.addEventListener('mousemove', (event) => {
      event.preventDefault();
    
      if (this.isMouseInRange(event)) {
        this.ele.style.cursor = 'move';
        if (this.isBeginMove) {
          this.#setDragElePos(event.x, event.y);
        }
      } else {
        this.ele.style.cursor = 'pointer'
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