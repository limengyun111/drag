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
    this.moveRange = {
      top: 100,
      left: 100,
      right: 700,
      bottom: 600,
    };
    this.draggable();

  }


  getDragElePos = () => {
    const eleRect = this.ele.getBoundingClientRect();
    return {
      // x: eleRect.width + eleRect.left,
      // y: eleRect.height + eleRect.top,
      // width: eleRect.width,
      // height: eleRect.height,
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
        // x: elePos.x,
        // y: elePos.y,
        left: elePos.left,
        right: elePos.right,
        top: elePos.top,
        bottom: elePos.bottom
      }
  }
  #setDragElePos = (mouseCurX, mouseCurY) => {
    const eleCurX = this.dragEleBeginPos.left + mouseCurX - this.mouseBeginPos.x;
    const eleCurY = this.dragEleBeginPos.top + mouseCurY - this.mouseBeginPos.y;

    const getTranslateX = () => {
      if (eleCurX <= this.moveRange.left) return this.moveRange.left;
      if (eleCurX >= this.moveRange.right) return this.moveRange.right;
      return eleCurX;
    }
    const getTranslateY = () => {
      if (eleCurY <= this.moveRange.top) return this.moveRange.top;
      if (eleCurY >= this.moveRange.bottom) return this.moveRange.bottom;
      return eleCurY
    }


    this.ele.style.transform = `translate(${getTranslateX()}px, ${getTranslateY()}px)`;
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